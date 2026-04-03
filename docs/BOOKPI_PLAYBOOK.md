# BOOKPI_PLAYBOOK.md

Sistema operativo de filtrado, bóveda BookPI y mini AIs de **ISABELLA IA™ + TAMVAI API NextGen**.

## 1. Propósito
- Limpiar ruido y PII antes de Isabella Core.
- Clasificar intención y emoción con baja latencia.
- Enrutar a mini AIs federadas por contexto.
- Registrar evidencia auditable en BookPI y anclar eventos sensibles a MSR.

## 2. Principios éticos
- **No daño:** priorizar seguridad de usuarios y operadores.
- **Transparencia:** cada bloqueo/degradación debe registrar motivo.
- **Privacidad:** minimización de datos y soporte opt-in/opt-out.
- **Responsabilidad:** decisiones críticas deben ser trazables.

## 3. SLOs de latencia y disponibilidad
- Mensaje texto end-to-end: **P95 < 300 ms**.
- Filtro (ruido + intent + emoción): **P95 < 50 ms**.
- Mini AIs (paralelo): **P95 < 150 ms**.
- Síntesis Isabella: **P95 < 100 ms**.
- Disponibilidad mensual: **99.5%** en `/v1/filter/*` y `/v1/bookpi/*`.

## 4. Pipeline operativo
1. `POST /v1/filter/ingest`
2. NoiseCleaner (normalización + PII masking)
3. IntentClassifier
4. EmotionClassifier
5. Router federado (1..N mini AIs)
6. Isabella Core synth
7. `POST /v1/bookpi/append`

## 5. Flujos emocionales
- **amor:** rápido/medio, mayor apertura creativa.
- **tristeza:** lento, tono contenedor.
- **miedo:** verificación reforzada + seguridad.
- **odio:** flujo restringido + guardia ética máxima.
- **asombro:** expansivo con límites.
- **neutral:** estándar.

## 6. Federados + extensiones next-gen
- Dekateotl: explainability + veto ético predictivo.
- ANUBIS: ZK proofs + observabilidad de seguridad.
- BookPI/DataGit: IPFS pinning + cadenas adaptativas.
- Phoenix: swarm orchestration con quorum.
- MDD/Credits: distribución programática.
- KAOS/XR: perfíl sensorial adaptado por emoción.
- MSR: anclajes y trazabilidad on-chain.

## 7. Modo de ejecución
- **Calmado:** menos agentes, baja estimulación.
- **Crisis/Phoenix:** más logging y controles éticos.
- **Contención emocional:** ritmo lento y respuestas cortas.
