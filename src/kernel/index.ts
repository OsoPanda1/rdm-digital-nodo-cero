import { Pool } from 'pg';
import Redis from 'ioredis';
import { ChronusEngine } from './engine/ChronusEngine';

const databaseUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;

if (!databaseUrl || !redisUrl) {
  throw new Error('DATABASE_URL y REDIS_URL son requeridos para iniciar el kernel soberano');
}

const pool = new Pool({ connectionString: databaseUrl });
const redis = new Redis(redisUrl);

const chronus = new ChronusEngine(pool, redis);

setInterval(async () => {
  try {
    await chronus.calcularSaturacionZonal('centro_historico', {
      clima: 'despejado',
      eventos_activos: [],
      turistas_concurrentes: 0,
    });
  } catch (error) {
    console.error('[KERNEL] Error en ciclo de autopoiesis', error);
  }
}, 60_000);

console.log('[KERNEL] Chronus-Real activo en modo soberano edge-first.');
