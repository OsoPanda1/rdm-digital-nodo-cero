import { Router } from 'express';
import { z } from 'zod';
import { federatedPoiService } from '../services/federatedPoiService';

const router = Router();

const allowedZones = ['real-del-monte', 'centro', 'minas', 'bosque'] as const;

const poisQuerySchema = z.object({
  zone: z.enum(allowedZones).default('real-del-monte'),
  type: z.enum(['historico', 'gastronomico', 'cultural', 'servicio']).optional(),
  category: z.string().min(2).max(40).optional(),
  tags: z.string().optional(),
  onlyAccessible: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const mapEventSchema = z.object({
  eventType: z.enum(['MAP_POI_SELECTED', 'MAP_VIEWPORT_CHANGED', 'MAP_PAGE_VIEW']),
  poiId: z.string().min(1).optional(),
  type: z.string().optional(),
  userProfile: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  geo: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

interface PoiRecord {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    type: 'historico' | 'gastronomico' | 'cultural' | 'servicio';
    category: string;
    opening_hours: string;
    commerce_id: string | null;
    priority: number;
    is_accessible: boolean;
    tags: string[];
    emotion_profile: 'contemplativo' | 'familiar' | 'aventura';
    zone: (typeof allowedZones)[number];
    description: string;
  };
}

const POI_FIXTURE: PoiRecord[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-98.672, 20.141] },
    properties: {
      id: 'poi-mina-acosta',
      name: 'Mina de Acosta',
      type: 'historico',
      category: 'museo-minero',
      opening_hours: '09:00-18:00',
      commerce_id: null,
      priority: 10,
      is_accessible: true,
      tags: ['familiar', 'adulto-mayor'],
      emotion_profile: 'contemplativo',
      zone: 'minas',
      description: 'Recorridos mineros y experiencia de patrimonio industrial.',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-98.674, 20.1375] },
    properties: {
      id: 'poi-museo-paste',
      name: 'Museo del Paste',
      type: 'gastronomico',
      category: 'museo-gastronomia',
      opening_hours: '10:00-19:00',
      commerce_id: 'commerce-paste-001',
      priority: 9,
      is_accessible: true,
      tags: ['ninos', 'pet-friendly'],
      emotion_profile: 'familiar',
      zone: 'centro',
      description: 'Historia del paste con degustación y talleres.',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-98.66, 20.15] },
    properties: {
      id: 'poi-penas-cargadas',
      name: 'Peñas Cargadas',
      type: 'cultural',
      category: 'ecoturismo',
      opening_hours: '08:00-17:30',
      commerce_id: null,
      priority: 8,
      is_accessible: false,
      tags: ['aventura', 'senderismo'],
      emotion_profile: 'aventura',
      zone: 'bosque',
      description: 'Miradores y senderos con paisaje natural de montaña.',
    },
  },
];

router.get('/', async (req, res) => {
  const parsed = poisQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Query inválida',
      details: parsed.error.flatten(),
    });
  }

  const { zone, type, category, tags, onlyAccessible, limit } = parsed.data;
  const requestedTags = tags ? tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean) : [];

  const localPois = POI_FIXTURE
    .filter((poi) => poi.properties.zone === zone || zone === 'real-del-monte')
    .filter((poi) => (type ? poi.properties.type === type : true))
    .filter((poi) => (category ? poi.properties.category.toLowerCase() === category.toLowerCase() : true))
    .filter((poi) => (onlyAccessible ? poi.properties.is_accessible : true))
    .filter((poi) => (requestedTags.length > 0
      ? requestedTags.every((tag) => poi.properties.tags.map((item) => item.toLowerCase()).includes(tag))
      : true))
    .sort((a, b) => b.properties.priority - a.properties.priority);

  const federationPois = await federatedPoiService.fetchFederationPois();
  const federationAsFeatures: PoiRecord[] = federationPois.map((poi) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [poi.lng, poi.lat] },
    properties: {
      id: poi.id,
      name: poi.name,
      type: poi.type,
      category: poi.category,
      opening_hours: 'N/D',
      commerce_id: null,
      priority: poi.priority,
      is_accessible: poi.is_accessible,
      tags: poi.tags,
      emotion_profile: poi.type === 'cultural' ? 'contemplativo' : poi.type === 'servicio' ? 'familiar' : 'aventura',
      zone: poi.zone,
      description: poi.description,
    },
  }));

  const merged = [...localPois, ...federationAsFeatures]
    .filter((poi) => poi.properties.zone === zone || zone === 'real-del-monte')
    .filter((poi) => (type ? poi.properties.type === type : true))
    .filter((poi) => (category ? poi.properties.category.toLowerCase() === category.toLowerCase() : true))
    .filter((poi) => (onlyAccessible ? poi.properties.is_accessible : true))
    .filter((poi) => (requestedTags.length > 0
      ? requestedTags.every((tag) => poi.properties.tags.map((item) => item.toLowerCase()).includes(tag))
      : true))
    .sort((a, b) => b.properties.priority - a.properties.priority)
    .slice(0, limit);

  console.info(JSON.stringify({
    level: 'info',
    route: '/api/v1/pois',
    zone,
    type,
    category,
    requestedTags,
    onlyAccessible,
    returned: merged.length,
    localRecords: localPois.length,
    federatedRecords: federationAsFeatures.length,
  }));

  return res.json({
    zone,
    total: merged.length,
    source: federationAsFeatures.length > 0 ? 'hybrid-federated-poi' : 'pois-fixture-stub',
    features: merged,
    integrity: {
      localRecords: localPois.length,
      federatedRecords: federationAsFeatures.length,
      geolocationValidated: true,
    },
  });
});

router.post('/events', (req, res) => {
  const parsed = mapEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Payload inválido',
      details: parsed.error.flatten(),
    });
  }

  console.info(JSON.stringify({
    level: 'info',
    route: '/api/v1/pois/events',
    ...parsed.data,
    metadataKeys: parsed.data.metadata ? Object.keys(parsed.data.metadata).slice(0, 12) : [],
    timestamp: new Date().toISOString(),
  }));

  return res.status(202).json({ accepted: true });
});

export default router;
