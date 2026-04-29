# RFC-001 Event Fabric

## Estado
Propuesto

## Objetivo
Definir un bus de eventos interoperable para conectar dominios TAMV (auth, protocolos, telemetry, economy, XR) con contratos estables, idempotencia y trazabilidad auditada.

## Decisión
- Estándar de evento: `eventId`, `traceId`, `domain`, `type`, `version`, `occurredAt`, `payload`, `actor`.
- Compatibilidad inicial: publicación por API interna + persistencia en MSR.
- Entrega: at-least-once con deduplicación por `eventId`.

## Contrato mínimo
```json
{
  "eventId": "evt_...",
  "traceId": "trc_...",
  "domain": "telemetry",
  "type": "telemetry.point.ingested",
  "version": 1,
  "occurredAt": "2026-04-29T00:00:00.000Z",
  "actor": { "id": "usr_123", "role": "ciudadano" },
  "payload": {}
}
```

## Riesgos
- Duplicación de eventos.
- Acoplamiento entre productores y consumidores.

## Mitigaciones
- Versionado estricto por tipo.
- Validación de esquema en frontera.
