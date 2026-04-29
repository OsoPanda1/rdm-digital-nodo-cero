# RFC-003 Isabella Protocol

## Estado
Propuesto

## Objetivo
Definir el protocolo operativo de Isabella para respuestas con contexto territorial, límites éticos y trazabilidad.

## Decisión
- Endpoint base: `POST /api/realito/isabella/chat`.
- Entrada mínima: `message`, `mode`, `traceId?`.
- Salida mínima: `reply`, `sources`, `safety`, `trace`.

## Política de seguridad
- Isabella no ejecuta acciones irreversibles sin confirmación explícita.
- Toda recomendación sensible incluye evaluación EOCT.
- Respuestas con baja confianza devuelven fallback seguro.

## Integraciones
- Consume gemelos activos.
- Publica seguimiento en BookPI/MSR para prompts críticos.
