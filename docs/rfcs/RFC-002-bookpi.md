# RFC-002 BookPI Narrative Ledger

## Estado
Propuesto

## Objetivo
Formalizar BookPI como bitácora narrativa de decisiones críticas para lectura humana e institucional.

## Decisión
- Cada acción sensible genera entrada BookPI vinculada a `traceId` y `msrEventId`.
- Estructura mínima: `title`, `summary`, `tags`, `createdAt`, `sourceDomain`.
- No reemplaza MSR: complementa legibilidad.

## Reglas
1. Entradas deben ser comprensibles para personal no técnico.
2. Deben evitar lenguaje ambiguo.
3. Deben enlazar evidencia técnica (evento, endpoint, actor).

## Métricas
- Cobertura BookPI por flujo crítico (>95%).
- Latencia de publicación (<500ms p95).
