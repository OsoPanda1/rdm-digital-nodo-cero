import { Router } from 'express';
import { quantumFederationService } from '../services/quantumFederationService';
import { githubRepoFusionService } from '../services/githubRepoFusionService';

const router = Router();

const DEFAULT_EXTERNAL_FEDERATED_REPOS = [
  'shreyasnbhat/federated-learning',
  'mayankshah1607/federated-learning-with-grpc-docker',
  'jklujklu/Batch-Aggregate',
  'Victoryao0321/Fedrated-learning',
  'Breeze1in1drizzle/Fed-Learning-Breeze',
  'HemanthKumar-CS/Fedrated_DDoS_Detection',
  'TEOTD/fp-client',
  'nabilajalil/fedcourse24',
  'Chukwuemeka-James/Fedrated-Swarm-Behavior',
  'linhanphan/federated-learning-simulation',
  'ZAKAUDD/Fedrated-Learning',
  'dalqattan/HFL-attacks',
  'Mingyue-Cheng/Awesome-Fedrated-Learning-in-Time-Series',
  'dprcsingh/fedratedGraph',
  'gizealew11/FDT_Museum_Evacuation_Simulation',
  'tianwen1209/FedPTM',
  'Talal-ALBarqi/decentralized_flower',
  'Warwick-PDP-Group/FedratedScope',
  'kanishkdhebana/Fedrated_learning_algorithms',
  'Tinghao-Chen/FedLPS',
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

export default router;
