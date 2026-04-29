# RDM DIGITAL — Sistema Operativo Territorial (SOT)

Plataforma territorial construida con **Next.js App Router**, preparada para ejecución serverless en **Vercel**, con núcleo operativo de:

- **Identidad** (registro y gestión de usuario)
- **Economía** (wallet y recompensas)
- **Comercio** (alta de comercios)
- **IA contextual** (consulta sobre lugares)
- **Pagos** (Stripe + webhook)
- **Gobernanza / trazabilidad** (base para auditoría y expansión)

---

## 1) Arquitectura funcional

```txt
Usuario → Registro → Wallet → Acción → Recompensa → Pago → Comercio → Datos → IA → Optimización
```

### Stack principal
- Next.js 16 (App Router)
- TypeScript
- Prisma + PostgreSQL
- Stripe
- Supabase (flujos existentes del proyecto)
- Vercel (deploy serverless)

---

## 2) Estructura de carpetas (núcleo SOT)

```txt
app/
  page.tsx
  dashboard/
  map/
  commerce/
  api/
    auth/register/
    economy/reward/
    commerce/create/
    ai/ask/
    payments/create/
    webhooks/stripe/
    stripe/webhook/         # flujo Stripe/Supabase legado del repo
lib/
  db.ts
  ledger.ts
  ai.ts
  payments.ts
  stripe.ts                 # cliente Stripe usado por flujos legado
prisma/
  schema.prisma
middleware.ts
vercel.json
package.json
```

---

## 3) Modelo de datos (Prisma)

Definido en `prisma/schema.prisma`:

- `User`
- `Wallet`
- `Transaction`
- `Place`
- `Commerce`
- `PaymentIntent`

Relaciones principales:
- `User` 1:1 `Wallet`
- `Transaction` asociada por `userId`

---

## 4) APIs serverless SOT

### Identidad
- `POST /api/auth/register`
- Crea usuario y wallet base.

### Economía
- `POST /api/economy/reward`
- Incrementa balance y registra transacción `reward`.

### Comercio
- `POST /api/commerce/create`
- Crea comercio (`name`, `category`).

### IA contextual
- `POST /api/ai/ask`
- Devuelve respuesta basada en `Place`.

### Pagos
- `POST /api/payments/create`
- Crea `paymentIntent` en Stripe (MXN) y registra estado inicial.

### Webhook
- `POST /api/webhooks/stripe`
- Endpoint base para eventos de Stripe (ampliable con firma).

> Nota: el proyecto también conserva `/api/stripe/webhook` para el flujo histórico con Supabase.

---

## 5) Variables de entorno

Configura al menos:

```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET=sk_live_...     # usado por lib/payments.ts
STRIPE_SECRET_KEY=sk_live_... # usado por lib/stripe.ts (flujo legado)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 6) Desarrollo local

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

## 7) Deploy en Vercel

`vercel.json` ya incluye:
- framework `nextjs`
- región `iad1`
- límites para funciones de `app/api/**/*.ts`

Pasos:

```bash
npm install
npx prisma generate
npx prisma db push
npm run build
vercel deploy
```

---

## 8) Limpieza y criterios de estructura aplicados

- Se eliminó archivo residual no utilizado (`go.sum`) que no corresponde al stack Node/Next.
- Se concentró la documentación operativa en este `README.md` para reducir dispersión y dejar una guía única de operación/despliegue.
- Se mantuvieron flujos existentes del repositorio (Stripe/Supabase) y se añadieron módulos SOT sin romper compatibilidad.

---

## 9) Próximos pasos recomendados

1. Validación robusta de payloads con `zod` en todas las APIs.
2. Verificación criptográfica real de webhook Stripe.
3. Migraciones Prisma versionadas (`prisma migrate`) para entornos productivos.
4. Observabilidad: logs estructurados + alertas.
5. Hardening: rate limiting, auth de rutas sensibles y gestión de secretos por entorno.
