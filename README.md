# RDM Digital Nexus

Plataforma federada para turismo, cultura, comercio local y experiencias inmersivas de **Real del Monte**, con backend API + frontend XR-ready y runtime de IA (**Isabella**) conectado a repositorios federados.

---

## ¿Qué hace este proyecto?

RDM Digital Nexus unifica capacidades de:

- **Portal público** (historia, cultura, directorio, eventos, rutas, gastronomía, arte, comunidad).
- **Módulo de negocios y economía musical** (catálogo, apoyo, donaciones, flows de pago).
- **Mapa y experiencias digitales** (capas geográficas y componentes visuales multimedia).
- **Runtime de IA Isabella** para clasificación de intención/emoción, auditoría de mensajes y enrutamiento de mini-agentes.
- **Federación GitHub** para sincronizar conocimiento distribuido entre repositorios relacionados a TAMV/RDM/federated-AI.

---

## Arquitectura

### Frontend
- React 18 + TypeScript + Vite.
- UI con Tailwind y componentes reutilizables.
- Ruteo SPA por dominios (cultura, turismo, comunidad, admin, música, mapa).

### Backend
- Express + TypeScript + Prisma.
- API versionada (`/api/v1`) + compatibilidad legacy (`/api`).
- Seguridad base: `helmet`, `cors`, rate limit, logging y middleware de errores.

### Data & IA
- PostgreSQL/Prisma para entidades de negocio/turismo/comunidad.
- Isabella Runtime + BookPI para trazabilidad operativa.
- Contexto federado desde GitHub para enriquecer respuestas de IA en caliente.

---

## Funcionalidades clave implementadas

## 1) Federación de repos y backlog de integración

Endpoints:
- `GET /api/v1/federados/github/interconnect`
- `POST /api/v1/federados/github/viable-update`

- `GET /api/v1/federados/github/chain-loop`
- `GET /api/v1/federados/github/unification-plan`

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

Endpoints:
- `POST /api/v1/isabella/process`
- `POST /api/v1/isabella/process-federated`
- `GET /api/v1/isabella/context`
- `GET /api/v1/isabella/bookpi`
- `GET /api/v1/isabella/readiness`

Capacidades:
- Limpieza de ruido + clasificación de intención/emoción.
- Routing de miniagentes (`MiniAI_Auditoria`, `MiniAI_Arquitectura`, `MiniAI_Etico`, `ANUBIS_Sentinel`, etc.).
- Inyección de contexto federado de repos de GitHub (README + descripción) con ranking y caché.
- Trazabilidad de ejecución en BookPI.
- Diagnóstico de readiness para validar entorno mínimo (JWT, DB, conectividad federada) antes de producción.

## 3) Optimizaciones operativas recientes

- Caché temporal para sincronizaciones GitHub.
- Timeouts explícitos en llamadas remotas para evitar bloqueos de request.
- Concurrencia controlada al leer README de múltiples repos para reducir cuellos de botella.


## 4) NOTITAMV + DreamSpaces (nuevo módulo operativo)

Endpoints:
- `GET /api/v1/notitamv/health`
- `POST /api/v1/notitamv/orchestrate`
- `POST /api/v1/notitamv/dreamspace/texturize`

Capacidades:
- Orquestación contextual de notificaciones multicanal (push/webpush/iot/xr) con prioridad por urgencia/evento.
- Selección de firma sonora “Alma TAMV” + efecto visual sugerido para microinteracciones.
- Modo de privacidad por diseño con política de retención diferenciada.
- Stub funcional para texturización DreamSpaces y retorno de artefactos XR (`texture_url`, `stylized_mesh_url`, `thumbnail_url`).

---

## Estado actual de producción

- Frontend: funcional para despliegue con build Vite.
- Backend: funcional en rutas críticas de federación e Isabella.
- Existen módulos legacy con deuda técnica TypeScript que requieren hardening progresivo para CI/CD full green.

---

## Quickstart

## 1) Frontend
```bash
npm install
npm run dev
```

## 2) Backend
```bash
cd server
npm install
npm run dev
```

## 3) Tests backend
```bash
npm --prefix server test -- --run
```

---

## Variables de entorno relevantes

Backend (`server/.env`):
- `PORT`
- `FRONTEND_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `GITHUB_TOKEN` (opcional pero recomendado para evitar rate limit)
- `GITHUB_FEDERATION_OWNER` (default: `OsoPanda1`)

---

## Posicionamiento global del proyecto

RDM Digital Nexus se posiciona como una plataforma **phygital** de patrimonio/turismo con enfoque en:

- **Soberanía tecnológica local** (federación de conocimiento y repositorios).
- **IA contextual de territorio** (Isabella + BookPI + repos federados).
- **Escalabilidad regional** hacia smart-city cultural y economía creativa.
- **Interoperabilidad** con ecosistemas XR/VR/AI y pipelines distribuidos.

En términos de producto, combina un stack utilitario de ciudad/pueblo turístico con una capa de IA federada orientada a operación real y trazabilidad.

---

## Roadmap sugerido (global-ready)

1. Hardening TypeScript del backend legacy para build 100% limpio.
2. CI/CD con gates obligatorios (`lint + test + build`).
3. Métricas SLO para endpoints de federación/IA.
4. Integración de embeddings/vector store para contexto Isabella semántico.
5. Orquestación multi-repo hacia `tamv-digital-nexus` como hub principal.
