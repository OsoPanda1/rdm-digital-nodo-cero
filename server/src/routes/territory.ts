import { Router } from 'express';
import prisma from '../lib/prisma';

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

router.get('/knowledge/overview', async (_req, res) => {
  try {
    const [nodeStats, edgeStats, docStats] = await Promise.all([
      prisma.$queryRaw<Array<{ total: bigint; active: bigint }>>`
        select
          count(*)::bigint as total,
          count(*) filter (where status = 'active')::bigint as active
        from public.nodes
      `,
      prisma.$queryRaw<Array<{ total: bigint }>>`
        select count(*)::bigint as total
        from public.edges
      `,
      prisma.$queryRaw<Array<{ total: bigint }>>`
        select count(*)::bigint as total
        from public.documents
      `,
    ]);

    return res.json({
      source: 'tamv-knowledge-graph-core',
      generatedAt: new Date().toISOString(),
      nodes: {
        total: Number(nodeStats[0]?.total ?? 0),
        active: Number(nodeStats[0]?.active ?? 0),
      },
      edges: {
        total: Number(edgeStats[0]?.total ?? 0),
      },
      documents: {
        total: Number(docStats[0]?.total ?? 0),
      },
    });
  } catch (error) {
    return res.status(503).json({
      error: 'Knowledge graph no disponible. Ejecuta migraciones base TAMV.',
      details: error instanceof Error ? error.message : 'error desconocido',
    });
  }
});

export default router;
