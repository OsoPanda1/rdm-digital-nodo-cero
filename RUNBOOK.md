# RDM Digital - Runbook de Operaciones

## 1. Información General

**Proyecto:** RDM Digital - Plataforma Turística de Real del Monte  
**versión:** 1.0.0  
**Stack:** React + TypeScript + Vite (Frontend), Express + Prisma + PostgreSQL (Backend)

---

## 2. Contactos de Emergencia

| Rol | Contacto | Teléfono |
|-----|----------|----------|
| Lead Developer | Por definir | - |
| DevOps | Por definir | - |
| On-Call | Por definir | - |

---

## 3. URLs de Producción

| Servicio | URL |
|----------|-----|
| Frontend | https://rdmdigital.mx |
| Backend API | https://api.rdmdigital.mx |
| Panel Admin | https://rdmdigital.mx/admin |
| Base de Datos | PostgreSQL en Supabase/AWS RDS |

---

## 4. Comandos de Despliegue

### Desarrollo Local

```bash
# Frontend
npm run dev

# Backend
cd server
npm run dev
```

### Producción con Docker

```bash
# Construir imágenes
docker build -f Dockerfile.frontend -t rdm-frontend .
docker build -f Dockerfile.backend -t rdm-backend .

# Ejecutar con Docker Compose
docker-compose -f docker-compose.yml up -d

# Ver logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Kubernetes

```bash
# Aplicar manifiestos
kubectl apply -f k8s/

# Ver estado de pods
kubectl get pods -n rdmdigital

# Ver logs
kubectl logs -n rdmdigital -l app=rdm-frontend
kubectl logs -n rdmdigital -l app=rdm-backend

# Restart deployment
kubectl rollout restart deployment/rdm-frontend -n rdmdigital
kubectl rollout restart deployment/rdm-backend -n rdmdigital
```

---

## 5. Procedures de Emergencia

### 5.1 Base de datos no responde

**Síntomas:**
- Errores de conexión a BD en logs
- Timeout en requests API

**Pasos:**
1. Verificar estado del servicio de BD:
   ```bash
   # Si es Supabase
   curl -H "apikey: $SUPABASE_ANON_KEY" \
     "https://$SUPABASE_PROJECT.ref.supabase.co/rest/v1/"
   ```

2. Verificar variables de entorno:
   ```bash
   kubectl get secret rdm-secrets -n rdmdigital -o yaml
   ```

3. Si la BD está caído:
   - Notificar al equipo de infraestructura
   - Considerar activar "modo solo lectura" (ver 5.5)

4. Recovery:
   ```bash
   # Restart backend pods
   kubectl rollout restart deployment/rdm-backend -n rdmdigital
   ```

### 5.2 Payments deshabilitados temporalmente

**Situación:** Necesidad de desactivar pagos por mantenimiento o incidente de seguridad

**Pasos:**
1. Configurar variable de entorno:
   ```bash
   # Kubernetes
   kubectl set env deployment/rdm-backend PAYMENTS_ENABLED=false -n rdmdigital
   
   # O agregar en configmap
   ```

2. Frontend mostrará mensaje de "Pagos temporalmente deshabilitados"

3. Reactivar:
   ```bash
   kubectl set env deployment/rdm-backend PAYMENTS_ENABLED=true -n rdmdigital
   ```

### 5.3 Modo Solo Lectura

**Situación:** Incidente mayor que requiere proteger integridad de datos

**Pasos:**
1. Activar modo solo lectura:
   ```bash
   kubectl set env deployment/rdm-backend READ_ONLY_MODE=true -n rdmdigital
   ```

2. Esto deshabilitará:
   - Creación/Edición de Posts
   - Creación de Negocios
   - Pagos/Donaciones
   - Suscripciones a newsletter

3. El frontend mostrará banner informativo

4. Desactivar:
   ```bash
   kubectl set env deployment/rdm-backend READ_ONLY_MODE=false -n rdmdigital
   ```

### 5.4 Escalamiento de pods

**Alta carga:**

```bash
# Escalar frontend
kubectl scale deployment rdm-frontend --replicas=5 -n rdmdigital

# Escalar backend
kubectl scale deployment rdm-backend --replicas=5 -n rdmdigital

# Ver métricas
kubectl top pods -n rdmdigital
```

### 5.5 Rollback

**Problema con nuevo deployment:**

```bash
# Ver historial
kubectl rollout history deployment/rdm-frontend -n rdmdigital
kubectl rollout history deployment/rdm-backend -n rdmdigital

# Rollback a versión anterior
kubectl rollout undo deployment/rdm-frontend -n rdmdigital
kubectl rollout undo deployment/rdm-backend -n rdmdigital

# Rollback a versión específica
kubectl rollout undo deployment/rdm-frontend --to-revision=2 -n rdmdigital
```

---

## 6. Monitoreo

### Métricas

| Métrica | Umbral | Acción |
|---------|--------|--------|
| CPU Usage | > 80% | Escalar pods |
| Memory Usage | > 85% | Escalar pods |
| Response Time | > 2s | Investigar |
| Error Rate | > 5% | Revisar logs |
| DB Connections | > 80% max | Optimizar queries |

### Logs

```bash
# Buscar errores recientes
kubectl logs -n rdmdigital -l app=rdm-backend --since=1h | grep ERROR

# Ver requests con status code 500
kubectl logs -n rdmdigital -l app=rdm-backend --since=1h | grep "500"
```

---

## 7. Base de Datos

### Backup

Los backups se realizan automáticamente:
- Supabase: Daily automated backups
- Retention: 30 días

### Restore

```bash
#导出 backup (solo admins)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup.sql

# Importar
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup.sql
```

### Seed (Datos de prueba)

```bash
cd server
npm run db:seed
```

---

## 8. Secrets y Variables

### Producción

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DATABASE_URL | Connection string BD | postgresql://... |
| JWT_SECRET | Secret para JWT | random-string-256-chars |
| STRIPE_SECRET_KEY | API Key Stripe | sk_live_... |
| OPENAI_API_KEY | API Key OpenAI | sk-... |
| FRONTEND_URL | URL del frontend | https://rdmdigital.mx |

### Cómo actualizar secrets

```bash
# Kubernetes
kubectl create secret generic rdm-secrets \
  --from-literal=database_url='postgresql://...' \
  --from-literal=jwt_secret='nuevo-secret' \
  -n rdmdigital \
  --dry-run=client -o yaml | kubectl apply -f -
```

---

## 9. Mantenimiento Programado

### Actualización de dependencias

```bash
# Frontend
npm audit fix
npm update

# Backend
cd server
npm audit fix
npm update

# Rebuild y test
npm run build
```

### Migraciones de BD

```bash
cd server
npm run db:migrate

# En producción
npm run db:deploy
```

---

## 10. Checklist de Verificación Post-Deploy

- [ ] Health check responde: `curl https://api.rdmdigital.mx/health`
- [ ] Frontend carga correctamente
- [ ] Login/Registro funciona
- [ ] API de lugares responde
- [ ] API de negocios responde
- [ ] API de eventos responde
- [ ] REALITO AI chatbot responde
- [ ] Pagos (Stripe) configurado
- [ ] Newsletter configurado
- [ ] Logs sin errores críticos

---

## 11. Recursos Adicionales

- [Documentación del Proyecto](./RDM-Digital-GAP-PLAYBOOK.md)
- [Schema de Base de Datos](./server/prisma/schema.prisma)
- [GitHub Actions CI/CD](./.github/workflows/ci-cd.yml)
- [Manifiestos Kubernetes](./k8s/)

---

**Última actualización:** 2026-03-04  
**Mantenedor:** Equipo RDM Digital
