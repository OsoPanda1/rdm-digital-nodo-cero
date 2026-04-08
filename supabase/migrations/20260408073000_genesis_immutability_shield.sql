-- Genesis immutability shield for system_logs
-- Capa 7: once TAMV_GENESIS_ROOT exists, it cannot be modified or deleted.

CREATE OR REPLACE FUNCTION public.protect_genesis_block()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.log_type = 'TAMV_GENESIS_ROOT' THEN
    RAISE EXCEPTION 'VIOLACIÓN DE SOBERANÍA: El Bloque Génesis es inmutable por mandato del Canon.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS genesis_immutability_shield ON public.system_logs;

CREATE TRIGGER genesis_immutability_shield
BEFORE UPDATE OR DELETE ON public.system_logs
FOR EACH ROW
EXECUTE FUNCTION public.protect_genesis_block();

INSERT INTO public.system_logs (log_type, message, data)
SELECT
  'TAMV_GENESIS_ROOT',
  'Donde la memoria limita al poder, y la dignidad dicta lo que la tecnología puede hacer.',
  '{
    "canon_version": "1.0",
    "arch_id": "0009-0008-5050-1539",
    "author": "Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)",
    "root_hash": "8f3e5b1d9a2c4e6f8b0d2a4c6e8f0a2b4c6e8f0a2b4c6e8f0a2b4c6e8f0a2b4c",
    "sovereignty_level": 100,
    "foundation_date": "2026-04-02T19:22:20Z",
    "status": "Irreversiblemente Iniciado",
    "repository": "rdm-digital-2dbd42b0"
  }'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_logs WHERE log_type = 'TAMV_GENESIS_ROOT'
);
