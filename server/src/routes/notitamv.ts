import { Router } from 'express';
import { z } from 'zod';
import { notitamvService } from '../services/notitamvService';

const router = Router();

const orchestrateSchema = z.object({
  title: z.string().min(2).max(120),
  message: z.string().min(4).max(1000),
  locale: z.string().default('es-MX').optional(),
  eventType: z.enum(['celebration', 'alert', 'community', 'reminder']),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  mood: z.enum(['festive', 'neutral', 'ceremonial', 'emergency']).optional(),
  preferredChannels: z.array(z.enum(['push', 'webpush', 'iot', 'xr'])).max(4).optional(),
  userId: z.string().max(120).optional(),
});

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    ...notitamvService.getStats(),
  });
});

router.post('/orchestrate', (req, res) => {
  const parsed = orchestrateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'El payload de NOTITAMV es inválido',
        details: parsed.error.flatten(),
      },
    });
  }

  const decision = notitamvService.orchestrate(parsed.data);

  return res.json({
    success: true,
    data: {
      request: parsed.data,
      decision,
      recommendation: `Usa ${decision.selectedChannel.toUpperCase()} con perfil ${decision.sonicProfile.label}.`,
    },
  });
});

router.post('/dreamspace/texturize', (req, res) => {
  const schema = z.object({
    mesh_id: z.string().min(2),
    prompt: z.string().min(6).max(800),
    style: z.string().min(2).max(80).default('Latam Neo-Futurista'),
    user_id: z.string().min(2),
    assets: z.array(z.string()).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const response = {
    success: true,
    data: {
      mesh_id: parsed.data.mesh_id,
      prompt: parsed.data.prompt,
      style: parsed.data.style,
      texture_url: `https://cdn.tamv.local/textures/${parsed.data.mesh_id}.png`,
      stylized_mesh_url: `https://cdn.tamv.local/meshes/${parsed.data.mesh_id}.gltf`,
      thumbnail_url: `https://cdn.tamv.local/thumbs/${parsed.data.mesh_id}.webp`,
      active_assets: parsed.data.assets ?? [],
      xr_ready: true,
    },
  };

  return res.json(response);
});

export default router;
