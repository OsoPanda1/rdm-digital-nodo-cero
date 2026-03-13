CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE tipo_federacion AS ENUM (
  'hospedaje',
  'gastronomia',
  'plateria',
  'comercio',
  'guias',
  'movilidad',
  'inteligencia'
);

CREATE TABLE IF NOT EXISTS nodos_lsm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  federacion tipo_federacion NOT NULL,
  capas_sinteticas TEXT[] NOT NULL,
  geom geometry(Point, 4326) NOT NULL,
  intensidad_base NUMERIC(3, 2) DEFAULT 0.5,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nodos_lsm_geom ON nodos_lsm USING GIST (geom);

CREATE TABLE IF NOT EXISTS zonas_presion (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  limites geometry(Polygon, 4326) NOT NULL,
  carga_maxima INTEGER NOT NULL,
  carga_actual INTEGER DEFAULT 0,
  estado_saturacion VARCHAR(20) DEFAULT 'FLUIDA'
);

CREATE INDEX IF NOT EXISTS idx_zonas_presion_geom ON zonas_presion USING GIST (limites);

CREATE OR REPLACE FUNCTION trigger_evaluar_autopoiesis()
RETURNS TRIGGER AS $$
DECLARE
  presion NUMERIC;
BEGIN
  presion := NEW.carga_actual::NUMERIC / NEW.carga_maxima::NUMERIC;

  IF presion >= 0.85 THEN
    NEW.estado_saturacion := 'CRITICA';
    PERFORM pg_notify(
      'canal_autopoiesis',
      json_build_object('zona', NEW.id, 'presion', presion, 'accion', 'ACTIVAR_RUTAS_ALIVIO')::text
    );
  ELSIF presion >= 0.50 THEN
    NEW.estado_saturacion := 'ALERTA';
  ELSE
    NEW.estado_saturacion := 'FLUIDA';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_monitoreo_presion ON zonas_presion;
CREATE TRIGGER trg_monitoreo_presion
BEFORE UPDATE OF carga_actual ON zonas_presion
FOR EACH ROW EXECUTE FUNCTION trigger_evaluar_autopoiesis();
