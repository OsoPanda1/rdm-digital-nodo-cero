# RDM Digital – Gap Analysis y Playbook para llegar al 100%

## 1. Alcance del documento

Este documento especifica de forma clara:

- Qué secciones del producto NO están al 100% para un entorno de producción real.
- Qué código, APIs, lógicas de negocio, webhooks, Kubernetes, planes de contingencia, protocolos, reglamentos internos, disparadores y funcionalidades deben implementarse.
- Criterios de aceptación mínimos para considerar RDM Digital listo para "green light" de producción.

---

## 2. Secciones NO al 100% y objetivos

### 2.1 Backend (Express + Prisma + Lovable Cloud)

**Estado actual (observado):**
- Carpeta `server/` con base Express + TypeScript y esquema Prisma definido, pero sin una capa de APIs completa ni conectada de forma consistente al frontend.
- Lovable Cloud activado, sin despliegue claro de modelos/servicios productivos.

**Objetivo 100%:** Backend vivo, con BD real, APIs versionadas y tests básicos.

**Tareas:**

1. Conexión a BD y migraciones
   - Configurar conexión a Postgres/Supabase (variables en `.env`, nunca hardcode).
   - Ejecutar `prisma migrate deploy` en entorno de producción.
   - Crear `prisma/seed.ts` con datos de ejemplo mínimos:
     - 10 negocios, 10 lugares, 10 eventos, 20 posts de comunidad, 6 rutas.

2. Rutas API REST (ejemplo de estructura)
   Implementar en `server/src/routes`:

   - `auth.routes.ts`
     - `POST /api/v1/auth/signup`
     - `POST /api/v1/auth/login`
     - `POST /api/v1/auth/logout`
     - `GET /api/v1/auth/me`

   - `businesses.routes.ts`
     - `GET /api/v1/businesses` (filtros: categoría, premium)
     - `GET /api/v1/businesses/:id`
     - `POST /api/v1/businesses` (solo rol negocio/admin)
     - `PUT /api/v1/businesses/:id`
     - `DELETE /api/v1/businesses/:id` (solo admin)

   - `places.routes.ts`
     - `GET /api/v1/places`
     - `GET /api/v1/places/:id`

   - `events.routes.ts`
     - `GET /api/v1/events` (filtro por fecha)
     - `POST /api/v1/events` (solo admin)

   - `posts.routes.ts` (muro comunidad)
     - `GET /api/v1/posts`
     - `POST /api/v1/posts` (usuario autenticado)
     - `DELETE /api/v1/posts/:id` (admin / autor)

   - `routes.routes.ts` (rutas turísticas)
     - `GET /api/v1/routes`

   Integrar todas en `server/src/index.ts` con `app.use("/api/v1", routes);`.

3. Integración frontend
   - Reemplazar arrays hardcodeados (`places`, `businesses`, etc. en `src/pages/Index.tsx`) por llamadas `fetch`/`axios` hacia las rutas anteriores.
   - Manejar estados de loading/error y cache simple (React Query o similar si se desea).

---

### 2.2 Autenticación, roles y permisos

**Estado actual:**
- No se observa un sistema completo de auth en frontend ni middleware de permisos en backend.

**Objetivo 100%:**
- Autenticación robusta con roles básicos, protección de rutas y endpoints.

**Tareas:**

1. Modelo de usuarios en Prisma
   - `User { id, name, email, passwordHash, role, createdAt, updatedAt }`
   - `role` ∈ { `"visitor"`, `"business"`, `"admin"` }.

2. Lógica de auth en Express
   - Hash de contraseñas con `bcrypt`.
   - Tokens JWT (`accessToken` con expiración corta).
   - Middleware `requireAuth` y `requireRole("admin" | "business")`.

3. Integración frontend
   - Form de login y registro (nueva página `src/pages/Auth.tsx`).
   - Contexto global de usuario (React Context) con: `user`, `token`, `login()`, `logout()`.
   - Protección de rutas sensibles (panel de negocios, administración de contenido).

---

### 2.3 Newsletter y comunicaciones

**Estado actual:**
- UI con intención de newsletter, sin integración demostrada con proveedor externo.

**Objetivo 100%:**
- Newsletter funcional con proveedor externo y registro de suscriptores.

**Tareas:**

1. API backend
   - `POST /api/v1/newsletter/subscribe` con `email` y `source`.
   - Validación de email, alta en BD y disparo de webhook al proveedor (Mailchimp/Brevo/etc.).

2. Provider externo
   - Crear lista/audience en el proveedor.
   - Generar API key y endpoint, mantenerlo en `.env`.

3. UI
   - Formulario de suscripción en footer/sections con mensaje de confirmación, errores y política de privacidad.

---

### 2.4 Monetización: donaciones y negocios premium

**Estado actual:**
- Lógica premium visual en tarjetas (`isPremium` en `businesses`), sin flujo real de pago.

**Objetivo 100%:**
- Flujo de donación y de upgrade a negocio premium con registro transaccional.

**Tareas:**

1. Integración de pasarela de pago (Stripe/PayPal/Conekta)
   - Endpoint `POST /api/v1/payments/create-checkout-session` con:
     - `type`: `"donation"` | `"business-upgrade"`
     - `amount`, `currency`, `businessId?`.

2. Webhook de pagos
   - `POST /api/v1/webhooks/payments`
   - Verifica firma, actualiza BD:
     - crea `Payment` con estado `succeeded` / `failed`.
     - si es `business-upgrade` exitoso → set `Business.isPremium = true`.

3. UI
   - Página `Apoya RDM` con CTA de donación.
   - CTA en tarjetas de negocios para "Convertirme en negocio destacado".

---

### 2.5 REALITO AI (conexión real)

**Estado actual:**
- Chatbot flotante implementado en UI, con respuestas contextuales scriptadas.

**Objetivo 100%:**
- REALITO como gateway IA gobernado: contexto RDM, logs y límites.

**Tareas:**

1. API `POST /api/v1/realito/query`
   - Entradas: `userId?`, `sessionId`, `message`, `context` (opcional).
   - Llamada a proveedor IA (OpenAI/Anthropic/o tu stack) con prompt que incluya:
     - resumen de RDM Digital, bases de datos de lugares/negocios/eventos.

2. Logs de conversación
   - Tabla `RealitoLog { id, userId?, sessionId, question, answer, timestamp }`.

3. Límites
   - Rate limiting simple por IP/user.
   - Respuesta de fallback si IA falla.

4. UI
   - Persistencia de sesión por pestaña.
   - Manejo de estados: `connecting`, `typing`, `error`.

---

### 2.6 SEO técnico y rendimiento

**Estado actual:**
- `index.html`, `robots.txt` y estructura Vite presentes, sin evidencia de SEO avanzado ni mediciones de performance.

**Objetivo 100%:**
- SEO por página y performance aceptable en dispositivos móviles.

**Tareas:**

1. Metadatos por ruta
   - Definir `title`, `meta description`, `og:title`, `og:image`, `twitter:card` para:
     - Inicio, Lugares, Directorio, Eventos, Comunidad, Historia, Cultura, Relatos, Ecoturismo, Gastronomía, Arte, Mapa.

2. `sitemap.xml` y `robots.txt`
   - Generar `public/sitemap.xml` con todas las rutas.
   - Ajustar `robots.txt` para permitir indexación de páginas públicas y bloquear endpoints `/api`.

3. Schema.org
   - Incrustar JSON-LD para:
     - `TouristDestination`, `LocalBusiness`, `Event`.

4. Performance
   - Lazy-load en galerías (`VideoGallery`, `ImageGallery`).
   - Revisión de tamaños de imágenes (`heroImg`, `*Img`) y uso de formatos WebP (ya hay algunos).

---

### 2.7 Seguridad, protocolos y reglamentos internos

**Estado actual:**
- No se observan políticas explícitas de CORS, rate limiting, ni reglamento de comunidad.

**Objetivo 100%:**
- Hardening básico, reglas claras de uso y moderación.

**Tareas:**

1. Seguridad API
   - Configurar CORS solo para dominios oficiales.
   - Rate limiting con `express-rate-limit` en `/api/v1/*`.
   - Sanitización de inputs (XSS, SQL injection) usando validadores (`zod`/`yup` + escapes).

2. Manejo de secretos
   - `.env` con: DB_URL, JWT_SECRET, PAYMENT_KEYS, IA_KEYS.
   - Nunca commitear `.env`.

3. Reglamento de comunidad
   - Crear página `/reglamento` con:
     - normas de publicación en muro de recuerdos,
     - políticas de moderación y contenido prohibido,
     - aviso de privacidad y términos de uso.

4. Moderación
   - Campos `isApproved` en `Post`, `Business`, `Event`.
   - Vista para admin de aprobación rápida.

---

### 2.8 Observabilidad y planes de contingencia

**Estado actual:**
- No se evidencian integraciones con sistemas de logs/errores ni runbooks formales.

**Objetivo 100%:**
- Observabilidad mínima y plan de acción ante caídas.

**Tareas:**

1. Logging estructurado
   - Middleware de logging en Express (correlación por requestId).
   - Envío a servicio externo (Sentry/Logtail/Logflare) opcional.

2. Manejo global de errores
   - `errorHandler` central en Express que:
     - loguee error,
     - devuelva código y mensaje genérico,
     - nunca exponga stacktrace en producción.

3. Planes de contingencia (Runbook)
   - Documento `RUNBOOK.md` con:
     - qué hacer si BD se cae,
     - cómo desactivar pagos temporalmente,
     - cómo poner modo "solo lectura" en caso de incidentes.

---

### 2.9 Despliegue, Kubernetes y CI/CD

**Estado actual:**
- Despliegue actual vía Lovable; no se especifica orquestación Kubernetes ni pipeline CI/CD formal.

**Objetivo 100%:**
- Pipeline reproducible y, opcionalmente, orquestación Kubernetes para escalar.

**Tareas:**

1. Contenedorización
   - Crear `Dockerfile` para:
     - frontend (Vite build + servidor estático),
     - backend (Node + Express).

2. Manifiestos Kubernetes (si se opta por K8s)
   - `k8s/deployment-frontend.yml`
   - `k8s/deployment-backend.yml`
   - `k8s/service-frontend.yml` (LoadBalancer/Ingress)
   - `k8s/service-backend.yml` (ClusterIP)
   - ConfigMaps/Secrets para `.env`.

3. CI/CD
   - Pipeline (GitHub Actions/GitLab CI) con jobs:
     - `lint`, `test`, `build`, `docker build`, `deploy`.
   - Condiciones: no desplegar si tests fallan.

---

## 3. Disparadores y webhooks clave

**Webhooks propuestos:**

1. Pagos
   - `/api/v1/webhooks/payments` – actualiza estado de `Payment` y `Business.isPremium`.

2. Newsletter
   - `/api/v1/webhooks/newsletter` – sincronización con proveedor (bajas, rebotes).

3. Auditoría básica
   - Opcional: `/api/v1/webhooks/audit` – envía eventos clave (nuevo negocio, nuevo evento, alta de ruta) a un sistema externo de auditoría.

---

## 4. Check de "100% listo para producción"

RDM Digital se considerará al 100% listo para producción cuando:

- Todas las APIs descritas estén implementadas, con pruebas básicas.
- Frontend consuma datos en tiempo real desde el backend (sin mocks principales).
- Autenticación y roles funcionen y protejan endpoints sensibles.
- Newsletter, donaciones y lógica premium estén operativos con registro en BD.
- REALITO IA esté conectado a un proveedor real con logs y límites.
- SEO técnico y performance alcancen niveles aceptables (Lighthouse ≥ 80 móvil).
- Seguridad básica, reglamento de comunidad, observabilidad y runbooks estén documentados y activos.
- Pipeline de despliegue (con o sin Kubernetes) sea reproducible y automatizado.
