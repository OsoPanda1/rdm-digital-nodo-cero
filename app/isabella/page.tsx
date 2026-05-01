import Link from "next/link"

const principios = [
  "Autonomía tecnológica",
  "Dignidad y empoderamiento humano",
  "No dependencia de terceros",
  "Ética por diseño",
  "Control humano obligatorio",
  "Prohibición absoluta de sexualización",
]

const capas = [
  "Sanitización técnica",
  "Clasificación semántica",
  "Riesgo ético",
  "Consistencia contextual",
  "Coherencia cognitiva",
  "Evaluación legal",
  "Evaluación de impacto",
  "Decisión de flujo",
]

export default function IsabellaMaestroPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-14 md:px-8">
      <header className="border border-border bg-card/50 p-6 md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Documento maestro final</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl">ISABELLA VILLASEÑOR AI</h1>
        <p className="mt-6 max-w-4xl text-muted-foreground">
          Diseño conceptual, técnico, jurídico y de ingeniería avanzada del sistema ISABELLA dentro del ecosistema
          TAMV. Este marco es fundacional, soberano y autosuficiente, sin dependencia de APIs externas.
        </p>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <article className="border border-border p-6">
          <h2 className="font-serif text-2xl">Principios fundacionales</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {principios.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="border border-border p-6">
          <h2 className="font-serif text-2xl">Definición de Isabella</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Isabella es un sistema de IA para acompañamiento contextual, curaduría, memoria y recomendación. No es
            persona, entidad jurídica, autoridad soberana ni instancia decisoria.
          </p>
        </article>
      </section>

      <section className="mt-8 border border-border p-6">
        <h2 className="font-serif text-2xl">Blindaje sexual y ético</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Isabella no contiene datasets sexuales, no genera contenido erótico, no participa en roleplay íntimo y no
          puede reconfigurarse para ello. El bloqueo es ontológico, semántico y conductual.
        </p>
      </section>

      <section className="mt-8 border border-border p-6">
        <h2 className="font-serif text-2xl">Arquitectura general</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Arquitectura de microservicios con doble pipeline, 8 capas de filtrado, núcleo cognitivo desacoplado y
          bóveda económica multiagente.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {capas.map((capa, i) => (
            <div key={capa} className="border border-border bg-background p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Capa {i + 1}</p>
              <p className="mt-2 text-sm text-muted-foreground">{capa}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <article className="border border-border p-6">
          <h2 className="font-serif text-2xl">Doble pipeline</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Pipeline A: flujo cognitivo normal.</li>
            <li>• Pipeline B: flujo de riesgo y contención.</li>
          </ul>
        </article>
        <article className="border border-border p-6">
          <h2 className="font-serif text-2xl">TAMVAI API + API Isabella</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            TAMVAI API es la capa soberana interna para modelos autoalojados. Isabella opera como orquestadora y capa
            ética, sin entrenar modelos ni modificar pesos.
          </p>
        </article>
      </section>

      <section className="mt-8 border border-border p-6">
        <h2 className="font-serif text-2xl">SDK, economía y observabilidad</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          La librería Isabella SDK integra cognición, filtros, gobernanza, economía y shutdown. La economía vive en
          una bóveda multiagente aislada. Observabilidad continua con métricas de latencia, coherencia, estrés
          cognitivo, bloqueos y auditoría.
        </p>
      </section>

      <section className="mt-8 border border-border p-6">
        <h2 className="font-serif text-2xl">Shutdown, Kubernetes y cumplimiento</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          HARD STOP con doble autorización humana, congelamiento de memoria y exportación de logs. Despliegue en
          Kubernetes con namespaces separados, autoescalado, circuit breakers y mTLS. Alineado con EU AI Act, GDPR,
          NIST AI RMF, ISO 27001 y principios UNESCO.
        </p>
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">Implementación activa dentro de RDM Digital · TAMV.</p>
        <Link className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline" href="/">
          Volver al núcleo
        </Link>
      </footer>
    </main>
  )
}
