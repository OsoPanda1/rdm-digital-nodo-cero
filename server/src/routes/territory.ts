import { Router } from 'express';

const router = Router();

router.get('/map-state', (_req, res) => {
  const now = new Date().toISOString();
  res.json({
    territory: 'Real del Monte',
    mode: 'sovereign-operations',
    lastSync: now,
    layers: [
      { id: 'cultura', enabled: true, entities: 42 },
      { id: 'comercio', enabled: true, entities: 57 },
      { id: 'sensores', enabled: true, entities: 16 },
      { id: 'turismo', enabled: true, entities: 31 },
      { id: 'red', enabled: true, entities: 8 },
      { id: 'alertas', enabled: true, entities: 5 },
    ],
    sensorNodes: [
      { id: 'SN-RDM-01', status: 'online', trust: 0.99 },
      { id: 'SN-RDM-02', status: 'degraded', trust: 0.85 },
      { id: 'SN-RDM-03', status: 'online', trust: 0.96 },
    ],
    alerts: [
      { id: 'ALT-001', severity: 'medium', type: 'network-latency', acknowledged: false },
      { id: 'ALT-002', severity: 'low', type: 'sensor-drift', acknowledged: true },
    ],
  });
});

export default router;
