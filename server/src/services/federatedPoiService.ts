import { z } from 'zod';

const federationPoiSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  type: z.enum(['historico', 'gastronomico', 'cultural', 'servicio']),
  category: z.string().min(2).max(50),
  description: z.string().min(8).max(500),
  lat: z.number(),
  lng: z.number(),
  priority: z.number().int().min(1).max(10).default(5),
  tags: z.array(z.string()).default([]),
  zone: z.enum(['real-del-monte', 'centro', 'minas', 'bosque']).default('real-del-monte'),
  is_accessible: z.boolean().default(false),
});

const federationResponseSchema = z.object({
  source: z.string().min(2),
  pois: z.array(federationPoiSchema),
});

export type FederationPoi = z.infer<typeof federationPoiSchema>;

interface FetchFederationPoisOptions {
  timeoutMs?: number;
}

interface FederatedPoiResult {
  source: string;
  pois: FederationPoi[];
}

const REAL_DEL_MONTE_BOUNDS = {
  minLat: 20.06,
  maxLat: 20.22,
  minLng: -98.76,
  maxLng: -98.58,
};

function isValidCoordinate(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return (
    lat >= REAL_DEL_MONTE_BOUNDS.minLat &&
    lat <= REAL_DEL_MONTE_BOUNDS.maxLat &&
    lng >= REAL_DEL_MONTE_BOUNDS.minLng &&
    lng <= REAL_DEL_MONTE_BOUNDS.maxLng
  );
}

async function fetchFederationEndpoint(
  endpoint: string,
  timeoutMs: number,
): Promise<FederatedPoiResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(process.env.FEDERATION_API_KEY ? { Authorization: `Bearer ${process.env.FEDERATION_API_KEY}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Federation endpoint failed (${response.status})`);
    }

    const payload = federationResponseSchema.parse(await response.json());
    const pois = payload.pois.filter((poi) => isValidCoordinate(poi.lat, poi.lng));

    return {
      source: payload.source,
      pois,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export class FederatedPoiService {
  async fetchFederationPois(options?: FetchFederationPoisOptions): Promise<FederationPoi[]> {
    const endpoints = (process.env.FEDERATION_POI_ENDPOINTS ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (endpoints.length === 0) {
      return [];
    }

    const timeoutMs = options?.timeoutMs ?? 2200;
    const results = await Promise.all(endpoints.map((endpoint) => fetchFederationEndpoint(endpoint, timeoutMs)));

    const deduped = new Map<string, FederationPoi>();
    for (const result of results) {
      if (!result) continue;

      for (const poi of result.pois) {
        const key = poi.id || `${poi.name}-${poi.lat.toFixed(5)}-${poi.lng.toFixed(5)}`;
        const current = deduped.get(key);
        if (!current || poi.priority > current.priority) {
          deduped.set(key, poi);
        }
      }
    }

    return [...deduped.values()];
  }
}

export const federatedPoiService = new FederatedPoiService();
