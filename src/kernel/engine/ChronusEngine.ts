import type { Pool } from 'pg';
import type Redis from 'ioredis';

export interface SpatialPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface ContextoCivilizatorio {
  clima: 'despejado' | 'lluvia' | 'niebla_densa';
  eventos_activos: string[];
  turistas_concurrentes: number;
}

export class ChronusEngine {
  private readonly db: Pool;
  private readonly pubsub: Redis;

  constructor(dbPool: Pool, redisClient: Redis) {
    this.db = dbPool;
    this.pubsub = redisClient;
  }

  /**
   * Calcula la Presión Civilizatoria (Fuzzy Logic) y actualiza el estado de la Malla (LSM).
   */
  public async calcularSaturacionZonal(
    polygonId: string,
    contexto: ContextoCivilizatorio,
  ): Promise<number> {
    const res = await this.db.query(
      `
      SELECT count(*) as activos
      FROM turistas_tracking
      WHERE ST_Contains((SELECT limites FROM zonas_presion WHERE id = $1), geom_actual)
      AND last_ping > NOW() - INTERVAL '15 minutes'
    `,
      [polygonId],
    );

    const activos = Number.parseInt(String(res.rows[0]?.activos ?? '0'), 10);
    const densidadFisica = activos / 1000;

    const multiplicadorClima =
      contexto.clima === 'niebla_densa' ? 1.4 : contexto.clima === 'lluvia' ? 1.2 : 1.0;
    const tensorEventos = contexto.eventos_activos.length > 0 ? 0.15 : 0;
    const tensorConcurrencia = Math.min(0.25, contexto.turistas_concurrentes / 10000);

    const cargaBase = densidadFisica * multiplicadorClima;
    const cargaFinal = cargaBase + tensorEventos + tensorConcurrencia;
    const presionNormalizada = Math.min(1.0, Math.max(0.0, cargaFinal));

    if (presionNormalizada > 0.85) {
      await this.activarProtocoloEscape(polygonId, presionNormalizada);
    }

    return presionNormalizada;
  }

  private async activarProtocoloEscape(polygonId: string, presion: number): Promise<void> {
    console.warn(
      `[CHRONUS] ALERTA: Saturación crítica (${(presion * 100).toFixed(1)}%) en Zona ${polygonId}`,
    );

    const payload = JSON.stringify({
      zona_saturada: polygonId,
      accion: 'REDIRECCION_FLUJO',
      capas_afectadas: ['turismo', 'movilidad'],
      presion,
      timestamp: new Date().toISOString(),
    });

    await this.pubsub.publish('SYSTEM_AUTOPOIESIS_ALERT', payload);
  }
}
