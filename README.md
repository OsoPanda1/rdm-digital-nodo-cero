# RDM DIGITAL — Sistema Operativo Territorial (SOT)

RDM Digital es una plataforma **Next.js + Prisma + Supabase + Stripe** que integra identidad, economía, IA contextual y operación territorial bajo un mismo runtime.

## Estado actual

- ✅ App Router operativo con rutas API serverless.
- ✅ Dominio base SOT implementado (registro, wallet, recompensas, comercio, pagos).
- ✅ Endurecimiento inicial para Next 16 (`useSearchParams` aislado en client subtree + Suspense).
- ✅ Auditoría automática de usos de `useSearchParams`.

---

## Arquitectura funcional

```txt
Sistema Operativo Territorial = Infraestructura + Identidad + Economía + IA + Gobernanza + Experiencia
```

Flujo operativo principal:

```txt
Usuario → Registro → Wallet → Acción → Recompensa → Pago → Comercio → Datos → IA → Optimización → Gobernanza
```

## Mapa de módulos

- `app/`: interfaz principal y rutas App Router.
- `app/api/`: identidad, economía, comercio, IA, pagos y webhooks.
- `lib/`: conectores de infraestructura (`db`, `ai`, `ledger`, `payments`).
- `prisma/`: modelo de datos y generación del cliente Prisma.
- `core/` e `infra/`: evolución de orquestación/eventos/seguridad/tracing.

---

## Stack técnico

- **Frontend**: Next.js 16, React 19, Tailwind CSS.
- **Datos**: PostgreSQL + Prisma ORM.
- **Identidad sesión**: Supabase Auth.
- **Pagos**: Stripe API + webhook.
- **Observabilidad/seguridad**: módulos de tracing y rate-limit en `infra/`.

---

## Modelo de datos base (Prisma)

`prisma/schema.prisma` define:

- `User`
- `Wallet`
- `Transaction`
- `Place`
- `Commerce`
- `PaymentIntent`

Relaciones clave:

- `User` 1:1 `Wallet`
- Registro económico por `Transaction` (recompensas y movimientos)

---

## Endpoints principales

- `POST /api/auth/register`: alta de usuario y wallet.
- `POST /api/economy/reward`: incrementa saldo y registra transacción.
- `POST /api/commerce/create`: alta de comercios.
- `POST /api/ai/ask`: consulta IA contextual sobre territorio.
- `POST /api/payments/create`: crea `payment_intent` en Stripe.
- `POST /api/webhooks/stripe`: recepción de eventos de pago.

---

## Blindaje antifrágil aplicado

1. **Aislamiento client/server en login**
   - `useSearchParams` se mantiene en componente cliente aislado.
   - `page.tsx` queda como server component con límite de `Suspense`.
2. **Auditoría reutilizable**
   - Script `audit:searchparams` para detectar patrones riesgosos en App Router.
3. **UI de carga dedicada**
   - `app/auth/login/loading.tsx` mejora UX y desacople de hidratación.

---

## Instalación y ejecución

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

Build de producción:

```bash
pnpm build
```

Auditoría de rutas con query params client-side:

```bash
pnpm run audit:searchparams
```

---

## Variables de entorno

```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SSE_BEARER_TOKEN=...
REDIS_URL=...
```

---

## Roadmap de evolución (siguiente nivel)

- Hardening de producción y seguridad bancaria (idempotencia, firma webhook estricta, reconciliación).
- Geo-replicación multi-región con consistencia eventual por dominio.
- Motor IA multi-agente con evaluación online.
- Gemelo digital territorial (XR + telemetría espacial).
- Federación TAMV completa con gobernanza programable.

---

## Notas de implementación

- Para Next 16+, evitar `useSearchParams` en `page.tsx` salvo patrón client + `Suspense`.
- Para despliegue Vercel, validar acceso externo a binarios Prisma y fuentes tipográficas durante build.
