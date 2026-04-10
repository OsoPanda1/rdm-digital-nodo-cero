# RDM Digital Nexus

Plataforma full-stack para operación turística/cultural de Real del Monte con backend federado, capa de identidad soberana, runtime de IA (Isabella), unificación multi-repo y panel operacional.

---

## Estado actual (abril 2026)

- Frontend React + Vite (Bun) en producción local (`bun run dev`, `bun run build`).
- Backend Express + TypeScript con rutas versionadas (`/api/v1`) y rutas legacy (`/api`).
- Integración federada de repositorios GitHub (owner configurable).
- Pipeline CI para ejecutar unificación por lotes (remote/fetch/merge opcional) con reporte de conflictos.
- Capa de seguridad constitucional opcional para JWT firmados con clave maestra federada.

---

## Arquitectura

### Frontend
- React 18 + TypeScript + Vite + Tailwind.
- Ruta operacional: `/soberano` (telemetría de territorio, estado cuántico y sesión soberana).

### Backend
- Express + Prisma + Zod.
- Seguridad base: `helmet`, `cors`, `express-rate-limit`, middleware de errores.
- Submódulos principales:
  - **Federados**: sincronización GitHub, plan/script de unificación.
  - **Isabella**: contexto federado, runtime de procesamiento.
  - **Identity**: registro/desafío/verificación/revocación/auditoría.
  - **Quantum (L6.Q)**: validación de estado y resiliencia.
  - **Simulation**: escenarios de ataque y score de recuperación.
  - **Territory**: estado operativo de mapa/capas/sensores.

### Datos
- Prisma + PostgreSQL para entidades de negocio/social.
- Supabase migrations para tablas y políticas RLS.
- Shield de inmutabilidad para bloque génesis en `system_logs`.

---

## Endpoints clave

### Federación / Unificación
- `GET /api/v1/federados/github/interconnect`
- `GET /api/v1/federados/github/chain-loop`
- `GET /api/v1/federados/github/unification-plan`
- `GET /api/v1/quantum/architecture`
- `GET /api/v1/quantum/status`
- `POST /api/v1/quantum/validate`
- `POST /api/v1/quantum/resilience`
- `GET /api/v1/territory/map-state`
- `POST /api/v1/identity/register`
- `POST /api/v1/identity/challenge`
- `POST /api/v1/identity/verify`
- `GET /api/v1/identity/session`
- `GET /api/v1/identity/me`
- `POST /api/v1/identity/revoke`
- `GET /api/v1/identity/audit`
- `GET /api/v1/simulation/scenarios`
- `POST /api/v1/simulation/run`

Capacidades:
- Descubre y puntúa repos por relevancia (RDM/TAMV/federated-AI).
- Construye grafo de interconexiones (`nodes`, `edges`, peso y razones).
- Genera backlog técnico priorizado (`P0/P1/P2`) con módulo objetivo e impacto esperado.
- Construye una cadena circular repo→repo para flujo continuo entre todos los repos activos de un owner, con loopback al origen.
- Permite fijar `startRepo` para arrancar la cadena desde un repositorio concreto (ej. `tamv-digital-nexus`).
- Genera un plan de consolidación multi-fase para unificar repositorios activos en un hub objetivo (`targetRepo`) con secuencia de merge y comandos bootstrap (hasta 400 repos).
- Soporta `preset=quantum` para inyectar automáticamente repos base (Microsoft Quantum, TensorFlow Quantum, QuantumKatas, QuantumultX y PennyLane) al plan de bootstrap.
- Acepta `seedRepo` (uno o varios) para anexar repos externos estratégicos al plan sin perder la priorización de los repos del owner.

## 2) Isabella federada (IA funcional)

### Isabella
- `POST /api/v1/isabella/process`
- `POST /api/v1/isabella/process-federated`
- `GET /api/v1/isabella/context`
- `GET /api/v1/isabella/readiness`

Parámetros federados:
- `owner`
- `maxRepos` (hasta 400)
- `maxContext` (hasta 100)
- `refresh=1`

### Quantum / Identity / Simulation / Territory
- `GET /api/v1/quantum/architecture`
- `GET /api/v1/quantum/status`
- `POST /api/v1/quantum/validate`
- `POST /api/v1/quantum/resilience`

- `POST /api/v1/identity/register`
- `POST /api/v1/identity/challenge`
- `POST /api/v1/identity/verify`
- `GET /api/v1/identity/session`
- `GET /api/v1/identity/me`
- `POST /api/v1/identity/revoke`
- `GET /api/v1/identity/audit`

- `GET /api/v1/simulation/scenarios`
- `POST /api/v1/simulation/run`

- `GET /api/v1/territory/map-state`

---

## Seguridad constitucional de tokens

Si defines `FEDERATION_MASTER_KEY`, los JWT emitidos por `/auth/login` y `/auth/signup` incluyen `federationSig`.

- `requireAuth` rechaza tokens sin firma válida de federación.
- `optionalAuth` solo adjunta usuario cuando la firma es válida.

Si `FEDERATION_MASTER_KEY` no está definido, el sistema mantiene compatibilidad con el flujo actual.

---

## Punto Cero (Libro Génesis)

La migración `20260408073000_genesis_immutability_shield.sql`:
- Inserta el bloque raíz `TAMV_GENESIS_ROOT` de forma idempotente.
- Crea trigger para bloquear cualquier `UPDATE` o `DELETE` sobre dicho bloque.

---

## CI/CD de unificación real

Workflow: `.github/workflows/unification-pipeline.yml`

Trigger manual (`workflow_dispatch`) con:
- `owner`
- `target_repo`
- `max_repos`
- `batch_size`
- `dry_run`
- `merge_branch`

Ejecutor: `tools/ci/unification-executor.mjs`
- Obtiene `unification-script` desde API.
- Aplica `git remote add` y `git fetch` por lotes.
- Ejecuta merges opcionales por rama.
- Genera `unification-report.json` con fallos y conflictos.

---

## Quickstart

### Frontend

> Vite está configurado para correr en el puerto **8080**.

```bash
bun install --frozen-lockfile
bun run dev
```

Opcional (variables de entorno frontend):

```bash
cp .env.example .env.local
```

### Backend

```bash
cp server/.env.example server/.env
npm --prefix server ci
npm --prefix server run dev
```

### Checks recomendados

```bash
bun run lint
bun run test
bun run build

npm --prefix server run lint
npm --prefix server run test -- --run
npm --prefix server run build
```

---

## Variables de entorno

Archivos recomendados:
- Frontend: copia `.env.example` → `.env.local`
- Backend: copia `server/.env.example` → `server/.env`

### Backend mínimas
- `PORT` (default 3001)
- `FRONTEND_URL`
- `DATABASE_URL`
- `JWT_SECRET`

### Federación
- `GITHUB_FEDERATION_OWNER` (default `OsoPanda1`)
- `GITHUB_TOKEN` (recomendado para evitar rate limits)

### Seguridad constitucional
- `FEDERATION_MASTER_KEY` (activa validación federada de JWT)

---

## Objetivo operativo

Consolidar los repos federados en un hub funcional (`tamv-digital-nexus`) con flujo repetible de unificación, trazabilidad de conflictos y validación de integridad en runtime.
