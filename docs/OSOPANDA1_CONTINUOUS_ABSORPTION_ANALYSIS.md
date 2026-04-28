# Análisis integral y absorción continua de repos OsoPanda1

Fecha de actualización: 2026-04-27.

## Diagnóstico del estado actual

El proyecto ya tenía cimientos de federación GitHub para detectar repos relacionados, construir grafo de interconexión y generar plan de unificación hacia `tamv-digital-nexus`.

Brechas detectadas:

1. No existía una **base de conocimiento continua** con diagnóstico repo por repo.
2. No se exponían bloqueadores funcionales (README ausente, tópicos faltantes, obsolescencia, lenguaje no declarado).
3. El caché de sincronización no distinguía correctamente owner en todos los escenarios.

## Implementación añadida

Se añadió una capa nueva de absorción continua:

- Servicio `buildRepositoryKnowledgeBase` para analizar hasta 400 repos por owner (default operativo 177).
- Diagnóstico por repositorio con:
  - score de relevancia,
  - antigüedad (`staleDays`),
  - estado README,
  - bloqueadores,
  - acciones sugeridas.
- Resumen agregado por severidad:
  - `ready`
  - `needsWork`
  - `critical`
- Endpoint REST:
  - `GET /api/v1/federados/github/knowledge-base`
  - Parámetros: `owner`, `targetHub`, `maxRepos`, `includeReadme=1`, `refresh=1`

## Uso operativo recomendado

1. Ejecutar cada 6-12 horas con `refresh=1` para mantener telemetría viva.
2. Persistir respuesta en capa de almacenamiento (PostgreSQL/Supabase o data lake) para historial longitudinal.
3. Convertir `critical` en backlog P0 para absorción acelerada al hub.
4. Encadenar salida con `/github/unification-plan` para que cada sprint tenga secuencia de merge concreta.

## Ejemplo de consulta

```bash
curl "http://localhost:3001/api/v1/federados/github/knowledge-base?owner=OsoPanda1&targetHub=tamv-digital-nexus&maxRepos=177&includeReadme=1&refresh=1"
```

## Resultado esperado

Con esta capa, el proyecto puede funcionar como **radar continuo de los repos fuente** y detectar automáticamente qué partes aún no están listas para consolidación total en `tamv-digital-nexus`.
