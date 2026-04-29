# TAMV / RDM Digital MD‑X5

Plataforma civilizatoria digital para Real del Monte: identidad, turismo inteligente, geolocalización operativa, protocolos auditables, economía creativa y capa de IA contextual.

## 1) Qué es y qué no es

**Qué es**
- Un sistema territorial unificado con capas de identidad, datos, protocolos, visualización y servicios para ciudadanía, comercio e instituciones.
- Una base para social + turismo + geointeligencia + economía + gobernanza trazable.

**Qué no es**
- No es solo landing estática.
- No es un stack “demo-only” sin trazabilidad.
- No es un sistema de vigilancia encubierta ni gamificación opaca de poder.

---

## 2) Diagnóstico técnico profundo del repositorio (actualizado)

### Fortalezas
- App Next.js moderna con App Router y segmentación por rutas funcionales.
- Integración Supabase Auth + Prisma + Stripe + endpoints de IA.
- Nuevas rutas de geolocalización y Digital Twin ya operativas (`places`, `telemetry`, `realito`).
- Cursor pagination incorporada para listas dinámicas (`/api/github/repos`).

### Debilidades detectadas
- **Inconsistencia de fuentes de verdad** entre Supabase Auth y Prisma User (identidad híbrida no completamente orquestada).
- **Type safety rota en build TS** por versión Stripe (`lib/payments.ts`).
- **Observabilidad parcial**: faltan métricas unificadas por dominio (auth/turismo/telemetry/protocols).
- **Riesgo de deuda UX**: aún conviven pantallas avanzadas con páginas “en construcción”.

### Cuellos de botella
- Dependencia de APIs externas sin capa fuerte de resiliencia/circuit breaker.
- Falta de un bus/event layer explícito entre EOCT/MSR/BookPI y servicios de dominio.
- Ausencia de estrategia de “live updates” persistentes (SSE existe, pero aún no hay pipeline continuo multi-consumer).

### Sesgos/inconsistencias funcionales corregidas recientemente
- Redirecciones de autenticación frágiles (signup/login/callback) reforzadas.
- Mensajería opaca en login corregida para casos de correo no confirmado.
- Paginación estructurada para absorción incremental de repos GitHub.

---

## 3) Arquitectura federada TAMV (L0–L7)

- **L0 Doctrina/Ética**: reglas explícitas anti-daño, anti-opacidad y trazabilidad.
- **L1 Memoria/Registro**: eventos MSR + narrativa BookPI.
- **L2 Protocolos controlados**: EOCT + Protocol Engine + lifecycle de decisión.
- **L3 Guardianía**: monitoreo, alertas, umbrales y observabilidad operacional.
- **L4 XR/Visual**: representación territorial y DreamSpaces.
- **L5 Servicios de dominio**: identidad, turismo, telemetría, economía, social.
- **L6 Shell UX**: flujos web de uso ciudadano/comercial/institucional.
- **L7 Quant-inspired**: desacople de definición de decisión vs. resolución futura híbrida.

---

## 4) Endpoints clave (actual)

### Identidad
- `POST /api/auth/register`
- `GET /auth/callback`
- `/auth/login`, `/auth/sign-up`

### Protocolos y narrativa
- `POST /api/protocols/execute`

### Geolocalización / Digital Twin
- `POST /api/places/register`
- `GET /api/places/:id`
- `POST /api/telemetry/ingest`
- `GET /api/telemetry/live` (SSE)

### IA
- `POST /api/realito/isabella/chat`
- `POST /api/ai/ask`

### Absorción GitHub (OsoPanda1)
- `GET /api/github/repos?cursor=<opaque>&limit=20`
- Respuesta: `{ items, nextCursor }`

---

## 5) UX y estilo visual (estado)

- Home rediseñada con enfoque visual operativo + acceso ID‑NVIDA + KPIs rápidos.
- Turismo con tarjetas visuales, categorías y asistente IA.
- Navegación principal ampliada a rutas estratégicas.

---

## 6) Seguridad y cumplimiento (mínimo aplicable)

- Saneamiento de `next` en auth callbacks/login.
- Validaciones de payload en rutas críticas.
- Recomendado inmediato:
  1. Rate limiting por endpoint crítico.
  2. Firma/verificación estricta de webhooks.
  3. RLS end-to-end en tablas sensibles.
  4. Rotación de secretos + auditoría periódica.

---

## 7) Instalación

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

Build:
```bash
pnpm build
```

Type-check:
```bash
npx tsc --noEmit
```

---

## 8) Estado de calidad conocido

- Si `npx tsc --noEmit` falla por Stripe API version typing en `lib/payments.ts`, actualizar `apiVersion` al valor esperado por el SDK instalado.
- Si `next build` falla por descarga de Google Fonts en entornos cerrados, usar fallback local de fuentes o pipeline con egress habilitado.

---

## 9) Roadmap prioritario

1. Unificar identidad Supabase ↔ Prisma (ID‑NVIDA service).
2. Consolidar Social Layer (feed real + comments + channels + DM).
3. Live map continuo (telemetry stream + heat/radar layer).
4. Motor de membresías/economía con ledger interno auditable.
5. Panel de guardianía (latencia, errores, riesgo EOCT, salud de servicios).

---

## 10) Posicionamiento tecnológico

TAMV se posiciona como una **infraestructura territorial de nueva generación** (social + XR + economía + protocolos auditables), diferenciada por su enfoque civilizatorio, trazabilidad ética y arquitectura modular para escalar a operaciones institucionales.
