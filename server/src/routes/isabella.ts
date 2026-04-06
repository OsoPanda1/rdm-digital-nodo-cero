import { Router } from 'express';
import { z } from 'zod';
import { isabellaRuntimeService } from '../services/isabellaRuntimeService';
import { bookpiStore } from '../services/bookpiStore';
import { isabellaFederatedContextService } from '../services/isabellaFederatedContextService';

const router = Router();

const processSchema = z.object({
  userId: z.string().min(1),
  text: z.string().min(1),
});

const federatedQuerySchema = z.object({
  owner: z.string().min(1).optional(),
  refresh: z.string().optional(),
  maxContext: z.coerce.number().int().min(1).max(8).optional(),
});

router.post('/process', (req, res) => {
  const parsed = processSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.flatten() });
  }

  const result = isabellaRuntimeService.process(parsed.data);
  return res.json(result);
});

router.post('/process-federated', async (req, res) => {
  const parsed = processSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.flatten() });
  }

  const queryParsed = federatedQuerySchema.safeParse(req.query);
  if (!queryParsed.success) {
    return res.status(400).json({ error: 'Query inválida', details: queryParsed.error.flatten() });
  }

  try {
    const context = await isabellaFederatedContextService.buildContext(parsed.data.text, {
      owner: queryParsed.data.owner,
      forceRefresh: queryParsed.data.refresh === '1',
    });

    const maxContext = queryParsed.data.maxContext ?? 3;
    const result = isabellaRuntimeService.process({
      ...parsed.data,
      federatedContext: context.snippets.slice(0, maxContext).map((snippet) => `${snippet.repo}: ${snippet.summary}`),
    });

    return res.json({
      source: 'isabella-federated-runtime',
      resolverVersion: '2026.04.merge-safe.1',
      context,
      ...result,
    });
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo cargar el contexto federado de Isabella',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

router.get('/context', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const queryParsed = federatedQuerySchema.safeParse(req.query);
  if (!queryParsed.success) {
    return res.status(400).json({ error: 'Query inválida', details: queryParsed.error.flatten() });
  }

  try {
    const context = await isabellaFederatedContextService.buildContext(q, {
      owner: queryParsed.data.owner,
      forceRefresh: queryParsed.data.refresh === '1',
    });

    return res.json(context);
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo sincronizar el contexto federado',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

router.get('/bookpi/:userId', (req, res) => {
  const records = bookpiStore.byUser(req.params.userId);
  return res.json({ userId: req.params.userId, total: records.length, records });
});

router.get('/bookpi', (_req, res) => {
  return res.json({ latest: bookpiStore.latest() });
});

export default router;
