import { Router } from 'express';
import { z } from 'zod';
import { quantumFederationService } from '../services/quantumFederationService';
import { githubRepoFusionService } from '../services/githubRepoFusionService';
import { repoChainService } from '../services/repoChainService';
import { federatedPoiService } from '../services/federatedPoiService';

const router = Router();

const QUANTUM_ACCELERATOR_REPOS = [
  'https://github.com/microsoft/Quantum.git',
  'https://github.com/tensorflow/quantum.git',
  'https://github.com/microsoft/QuantumKatas.git',
  'https://github.com/w37fhy/QuantumultX.git',
  'https://github.com/Orz-3/QuantumultX.git',
  'https://github.com/KOP-XIAO/QuantumultX.git',
  'https://github.com/PennyLaneAI/pennylane.git',
];

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


router.get('/github/chain-loop', async (req, res) => {
  try {
    const owner = typeof req.query.owner === 'string' ? req.query.owner : undefined;
    const startRepo = typeof req.query.startRepo === 'string' ? req.query.startRepo : undefined;
    const forceRefresh = req.query.refresh === '1';
    const maxReposParam = Number(req.query.maxRepos);
    const maxRepos = Number.isFinite(maxReposParam) ? maxReposParam : undefined;

    const chain = await repoChainService.buildLoopChain({
      owner,
      forceRefresh,
      startRepo,
      maxRepos,
    });

    return res.json({
      source: 'github-loop-chain',
      ...chain,
    });
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo construir la cadena de interconexión GitHub',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

router.get('/github/unification-plan', async (req, res) => {
  try {
    const owner = typeof req.query.owner === 'string' ? req.query.owner : undefined;
    const targetRepo = typeof req.query.targetRepo === 'string' ? req.query.targetRepo : undefined;
    const forceRefresh = req.query.refresh === '1';
    const maxReposParam = Number(req.query.maxRepos);
    const maxRepos = Number.isFinite(maxReposParam) ? maxReposParam : undefined;
    const preset = typeof req.query.preset === 'string' ? req.query.preset.toLowerCase() : undefined;
    const seedRepoParams = Array.isArray(req.query.seedRepo)
      ? req.query.seedRepo.filter((value): value is string => typeof value === 'string')
      : typeof req.query.seedRepo === 'string'
        ? req.query.seedRepo.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

    const externalRepoUrls = preset === 'quantum'
      ? [...QUANTUM_ACCELERATOR_REPOS, ...seedRepoParams]
      : seedRepoParams;

    const plan = await githubRepoFusionService.buildUnificationPlan({
      owner,
      targetRepo,
      forceRefresh,
      maxRepos,
      externalRepoUrls,
    });

    return res.json({
      source: 'github-unification-plan',
      ...plan,
    });
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo construir el plan de unificación de repositorios',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

router.get('/github/unification-script', async (req, res) => {
  try {
    const owner = typeof req.query.owner === 'string' ? req.query.owner : undefined;
    const targetRepo = typeof req.query.targetRepo === 'string' ? req.query.targetRepo : undefined;
    const maxReposParam = Number(req.query.maxRepos);
    const maxRepos = Number.isFinite(maxReposParam) ? maxReposParam : 194;

    const plan = await githubRepoFusionService.buildUnificationPlan({
      owner,
      targetRepo,
      maxRepos,
      forceRefresh: req.query.refresh === '1',
    });

    return res.json({
      source: 'github-unification-script',
      owner: plan.owner,
      targetRepo: plan.targetRepo,
      selectedRepos: plan.selectedRepos,
      estimatedBranches: plan.estimatedBranches,
      scriptLines: plan.bootstrapCommands.length,
      script: plan.bootstrapScript,
    });
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo generar el script de unificación',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

router.get('/live-map-sync', async (_req, res) => {
  try {
    const records = await federatedPoiService.fetchFederationPois({ timeoutMs: 2000 });
    return res.json({
      source: 'federation-live-map-sync',
      syncedAt: new Date().toISOString(),
      records: records.length,
      status: records.length > 0 ? 'connected' : 'degraded',
    });
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo sincronizar mapa con federaciones',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

export default router;
