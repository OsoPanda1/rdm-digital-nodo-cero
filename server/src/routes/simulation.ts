import { Router } from 'express';
import { z } from 'zod';
import { resilienceSimulationService } from '../services/resilienceSimulationService';

const router = Router();

router.get('/scenarios', (_req, res) => {
  return res.json({
    scenarios: resilienceSimulationService.getScenarios(),
  });
});

router.post('/run', (req, res) => {
  const parsed = z
    .object({
      scenario: z.enum([
        'replay_identity',
        'api_flood',
        'quantum_error_burst',
        'database_timeout',
        'federation_collapse',
        'session_hijack',
      ]),
      rounds: z.number().int().min(1).max(200).optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Payload de simulación inválido',
      details: parsed.error.issues,
    });
  }

  return res.json(resilienceSimulationService.runScenario(parsed.data));
});

export default router;
