import { Router } from 'express';
import { z } from 'zod';
import { isabellaRuntimeService } from '../services/isabellaRuntimeService';
import { bookpiStore } from '../services/bookpiStore';
import { isabellaFederatedContextService } from '../services/isabellaFederatedContextService';
import { isabellaReadinessService } from '../services/isabellaReadinessService';

const router = Router();

const processSchema = z.object({
  userId: z.string().min(1),
  text: z.string().min(1),
});

const federatedQuerySchema = z.object({
  owner: z.string().min(1).optional(),
  refresh: z.string().optional(),
  maxContext: z.coerce.number().int().min(1).max(100).optional(),
  maxRepos: z.coerce.number().int().min(5).max(400).optional(),
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

  try {
    const query = federatedQuerySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: 'Parámetros inválidos', details: query.error.flatten() });
    }

    const context = await isabellaFederatedContextService.buildContext(parsed.data.text, {
      owner: query.data.owner,
      forceRefresh: query.data.refresh === '1',
      maxRepos: query.data.maxRepos,
      maxSnippets: query.data.maxContext,
    });

    const result = isabellaRuntimeService.process({
      ...parsed.data,
      federatedContext: context.snippets.map((snippet) => `${snippet.repo}: ${snippet.summary}`),
    });

    return res.json({
      source: 'isabella-federated-runtime',
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
  const parsedQuery = federatedQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ error: 'Parámetros inválidos', details: parsedQuery.error.flatten() });
  }

  const q = typeof req.query.q === 'string' ? req.query.q : '';

  try {
    const context = await isabellaFederatedContextService.buildContext(q, {
      owner: parsedQuery.data.owner,
      forceRefresh: parsedQuery.data.refresh === '1',
      maxRepos: parsedQuery.data.maxRepos,
      maxSnippets: parsedQuery.data.maxContext,
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

router.get('/readiness', async (req, res) => {
  const owner = typeof req.query.owner === 'string' ? req.query.owner : undefined;
  const report = await isabellaReadinessService.run(owner);
  return res.json(report);
});

export default router;
