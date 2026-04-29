# RDM DIGITAL — SISTEMA OPERATIVO TERRITORIAL (SOT)

**Estado:** Documento maestro operativo + blueprint de infraestructura **GEN-9** listo para despliegue progresivo (Vercel-first, Kubernetes-ready).

RDM Digital se implementa como:

> **Sistema Operativo Territorial = Infraestructura + Identidad + Economía + IA + Gobernanza + Experiencia**

---

## I. Arquitectura total

La solución está dividida en capas:

1. **Experiencia** (web/app, mapas, paneles, comercio)
2. **Runtime** (APIs, streaming, orquestación, eventos)
3. **Datos** (PostgreSQL/Prisma + geodatos)
4. **Economía** (wallet, recompensas, pagos)
5. **Identidad** (registro, autenticación, reputación)
6. **Observabilidad y seguridad** (métricas, trazas, rate limit, auditoría)
7. **Infraestructura** (Vercel / Kubernetes / edge / multi-región)

Flujo macro:

```txt
Usuario → Registro → Wallet → Acción → Recompensa → Pago → Comercio → Datos → IA → Optimización → Gobernanza
```

---

## II. Estructura final del proyecto (Vercel)

```txt
rdm-digital/
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   ├── map/
│   ├── commerce/
│   ├── api/
│   │   ├── auth/
│   │   ├── economy/
│   │   ├── commerce/
│   │   ├── routes/
│   │   ├── ai/
│   │   ├── payments/
│   │   └── webhooks/
├── lib/
│   ├── db.ts
│   ├── ledger.ts
│   ├── ai.ts
│   ├── payments.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts
├── vercel.json
└── package.json
```

> El repositorio también incluye módulos de evolución (`core/`, `infra/`) para la ruta de hardening y escalado.

---

## III. Base de datos (Prisma)

`prisma/schema.prisma` modela entidades núcleo:

- `User`
- `Wallet`
- `Transaction`
- `Place`
- `Commerce`
- `PaymentIntent`

Relaciones clave:
- `User` 1:1 `Wallet`
- `Transaction` vinculada por `userId`

---

## IV. Conexión DB

`lib/db.ts`

```ts
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
```

---

## V. Identidad (API)

Endpoint:
- `POST /api/auth/register`

Responsabilidad:
- Crear usuario (`role: citizen`) y wallet inicial.

---

## VI. Motor económico

Endpoint:
- `POST /api/economy/reward`

Responsabilidad:
- Incrementar balance en wallet.
- Registrar transacción tipo `reward`.

---

## VII. Comercio

Endpoint:
- `POST /api/commerce/create`

Responsabilidad:
- Alta de comercios (`name`, `category`).

---

## VIII. IA contextual

Componentes:
- `lib/ai.ts`
- `POST /api/ai/ask`

Responsabilidad:
- Responder consultas contextuales con señales territoriales (ej. lugares cercanos/disponibles).

---

## IX. Pagos reales (Stripe)

Componentes:
- `lib/payments.ts`
- `POST /api/payments/create`
- `POST /api/webhooks/stripe`

Responsabilidad:
- Crear `payment_intent` en MXN.
- Recibir eventos de pago y ejecutar lógica de conciliación.

---

## X. Configuración Vercel

`vercel.json` define framework Next.js y configuración de funciones serverless.

Plantilla esperada:

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## XI. Variables de entorno

```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Hardening streaming
SSE_BEARER_TOKEN=...
REDIS_URL=... # cuando se habilite transporte distribuido de eventos
```

---

## XII. Despliegue (Vercel-first)

```bash
npm install
npx prisma generate
npx prisma db push
npm run build
vercel deploy
```

---

## XIII. GEN-9 — Infraestructura soberana global (roadmap de implementación)

> Esta sección define el plan objetivo para operación territorial real a escala. Se implementa por etapas para evitar deuda de complejidad.

### Módulo 8 — Kubernetes + Autoscaling real

- Namespaces recomendados:
  - `core`
  - `streaming`
  - `ai`
  - `edge`
- Deployments con `requests/limits` obligatorios.
- HPA v2 por CPU + métricas de negocio (latencia de decisión, backlog de eventos).

### Módulo 9 — CDN Edge + SSE global

- Topología:
  - Cliente → Edge Worker/CDN → SSE Gateway en origen.
- Beneficios:
  - menor latencia global,
  - desacople de conexiones largas,
  - menos presión sobre pods de aplicación.

### Módulo 10 — Geo-replicación multi-región

- Estrategia:
  - escritura local,
  - replicación asíncrona,
  - consistencia eventual controlada por dominio.
- Recomendación:
  - event streams regionales + reconciliación por idempotencia y versionado.

### Módulo 11 — Motor de IA real

- Evolución:
  - de reglas heurísticas a inferencia ML.
- Arquitectura sugerida:
  - servicio de inferencia dedicado (ej. FastAPI/Triton o TF Serving),
  - telemetría de features y evaluación online.

### Módulo 12 — Digital Twin persistente

- Modelo territorial como grafo dinámico.
- Persistencia geoespacial con PostGIS.
- Consultas de proximidad (`ST_DWithin`) para experiencias y decisiones contextuales.

### Módulo 13 — CI/CD + Terraform + dominio global

- IaC para clúster/red/secretos/políticas.
- Pipeline de build, test, scan, deploy y rollback.
- Dominios sugeridos:
  - `isabella.app`
  - `api.isabella.app`
  - `stream.isabella.app`

### Módulo 14 — Pagos + economía + identidad

- Wallet territorial con reglas de incentivo.
- Pagos reales y conciliación robusta.
- Identidad expandible a reputación y DID opcional.

---

## XIV. Seguridad y cumplimiento (obligatorio para producción)

1. Validación de payloads con esquema (Zod).
2. Verificación criptográfica real de webhooks Stripe.
3. Control de acceso por rutas y scopes.
4. Rate limiting por actor, IP y endpoint crítico.
5. Auditoría inmutable de eventos económicos.
6. Gestión de secretos por entorno (no hardcode).

---

## XV. Observabilidad operativa

Mínimo requerido:

- **Métricas**: latencia p95/p99, error rate, throughput, backlog de eventos.
- **Trazas**: request → decisión → efecto (pago/recompensa/stream).
- **Logs**: estructurados con correlation IDs.
- **Alertas**: SLO breach, caída de webhook, latencia de streaming, fallos de DB.

---

## XVI. Estado final del sistema

Con esta base tienes:

- ✅ Plataforma desplegable en Vercel.
- ✅ Backend serverless funcional.
- ✅ Base de datos operativa con Prisma.
- ✅ Integración de pagos habilitable.
- ✅ Módulos de evolución para hardening GEN-8/GEN-9.
- ✅ Ruta clara a operación multi-región y edge global.

---

## XVII. Verdad operativa

Esto deja de ser “demo” cuando se aplican:

- pruebas automatizadas,
- seguridad de extremo a extremo,
- observabilidad profunda,
- despliegue reproducible con rollback,
- gobierno de datos y costos.

En ese punto, el SOT pasa a ser **infraestructura territorial real**.

---

## XVIII. Siguiente nivel

Opciones de expansión:

- Hardening producción + seguridad bancaria.
- Escala federación TAMV completa.
- Integración SPEI/STP.
- IA multi-agente.
- Gemelo digital XR.

