import { Router } from 'express';
import { z } from 'zod';
import { isabellaRuntimeService } from '../services/isabellaRuntimeService';
import { bookpiStore } from '../services/bookpiStore';

const router = Router();

const processSchema = z.object({
  userId: z.string().min(1),
  text: z.string().min(1),
});

router.post('/process', (req, res) => {
  const parsed = processSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.flatten() });
  }

  const result = isabellaRuntimeService.process(parsed.data);
  return res.json(result);
});

router.get('/bookpi/:userId', (req, res) => {
  const records = bookpiStore.byUser(req.params.userId);
  return res.json({ userId: req.params.userId, total: records.length, records });
});

router.get('/bookpi', (_req, res) => {
  return res.json({ latest: bookpiStore.latest() });
});

export default router;
