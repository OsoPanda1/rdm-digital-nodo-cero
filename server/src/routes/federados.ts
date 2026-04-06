import { Router } from 'express';
import { quantumFederationService } from '../services/quantumFederationService';
import { githubRepoFusionService } from '../services/githubRepoFusionService';

const router = Router();

router.get('/overview', (_req, res) => {
  res.json(quantumFederationService.getOverview());
});

router.get('/catalog', (_req, res) => {
  res.json({
    source: 'OsoPanda1 federation sync',
    items: quantumFederationService.getCatalog(),
  });
});

router.get('/pulse/:id', (req, res) => {
  const pulse = quantumFederationService.getPulse(req.params.id);
  if (!pulse) {
    return res.status(404).json({ error: 'Federado no encontrado' });
  }

  return res.json(pulse);
});

router.get('/github/interconnect', async (req, res) => {
  try {
    const owner = typeof req.query.owner === 'string' ? req.query.owner : undefined;
    const forceRefresh = req.query.refresh === '1';
    const limitParam = Number(req.query.limit);
    const limit = Number.isFinite(limitParam) ? limitParam : undefined;

    const sync = await githubRepoFusionService.syncRelatedRepos({
      owner,
      forceRefresh,
      limit,
    });

    return res.json({
      source: 'live-github-graph',
      ...sync,
    });
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo sincronizar la federación desde GitHub',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

export default router;
