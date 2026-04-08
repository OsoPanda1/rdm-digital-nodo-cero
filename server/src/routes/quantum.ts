import { Router } from 'express';
import { z } from 'zod';
import { quantumIntegrityLayerService } from '../services/quantumIntegrityLayerService';

const router = Router();

const quantumPayloadSchema = z.object({
  stateId: z.string().min(3),
  bits: z.array(z.number()).min(1),
  epsilon: z.number().positive().max(1).optional(),
  noiseProbability: z.number().min(0).max(0.49).optional(),
});

router.get('/architecture', (_req, res) => {
  res.json(quantumIntegrityLayerService.getArchitecture());
});

router.get('/status', (_req, res) => {
  const resilience = quantumIntegrityLayerService.simulateResilience({
    stateId: 'rdm-quantum-runtime',
    bits: [1, 0, 1, 0, 1, 1],
    rounds: 12,
    epsilon: 0.08,
    noiseProbability: 0.12,
  });

  res.json({
    layer: 'L6.Q',
    runtime: resilience.status,
    faultToleranceIndex: resilience.antifragilityIndex,
    passRate: resilience.passRate,
    maxResidualError: resilience.maxResidualError,
    updatedAt: new Date().toISOString(),
  });
});

router.post('/validate', (req, res) => {
  const parsed = quantumPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Payload cuántico inválido',
      details: parsed.error.issues,
    });
  }

  return res.json(quantumIntegrityLayerService.validateState(parsed.data));
});

router.post('/resilience', (req, res) => {
  const parsed = quantumPayloadSchema
    .extend({
      rounds: z.number().int().min(1).max(500).optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Payload de resiliencia inválido',
      details: parsed.error.issues,
    });
  }

  return res.json(quantumIntegrityLayerService.simulateResilience(parsed.data));
});

export default router;
