import { Router } from 'express';
import { quantumFederationService } from '../services/quantumFederationService';

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

export default router;
