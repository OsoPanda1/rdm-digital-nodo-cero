import { SectionHeader } from "./section-header"

export function Geopolitics() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Módulo 2 · Geopolítica"
          number="09"
          title="Del colonialismo digital a la supremacía de borde"
          subtitle="No es aislamiento: es interdependencia federada. Cada territorio adquiere capacidad de operar servicios críticos de forma autónoma, definir políticas locales y negociar con plataformas globales desde una base de igualdad técnica."
        />

        <div className="mt-16 grid lg:grid-cols-2 gap-px bg-border border border-border">
          {/* Left — current model */}
          <article className="bg-background p-7 md:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-destructive mb-4">
              Modelo actual · cloud-céntrico
            </div>
            <h3 className="font-serif text-3xl mb-5 leading-tight">
              Datos del Sur, decisiones del Norte.
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Centralización de activos en grandes data centers del Norte Global.",
                "Datos personales y territoriales como nueva materia prima de extracción.",
                "Algoritmos opacos que perfilan crédito, visibilidad y seguridad fuera del territorio.",
                "Marcos legales como Cloud Act que tensionan principios de autodeterminación.",
                "Vendor lock-in que erosiona la capacidad de negociación municipal.",
              ].map((t) => (
                <li key={t} className="flex gap-3 leading-relaxed">
                  <span className="text-destructive mt-2 shrink-0" aria-hidden>
                    —
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Right — TAMV proposal */}
          <article className="bg-card p-7 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 grid-paper-fine opacity-30" aria-hidden />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
                Propuesta TAMV · supremacía de borde
              </div>
              <h3 className="font-serif text-3xl mb-5 leading-tight">
                Cómputo donde ocurre la vida.
              </h3>
              <ul className="space-y-3 text-foreground/90">
                {[
                  "Procesamiento prioritario en nodos territoriales bajo jurisdicción local.",
                  "Datos como infraestructura pública soberana, no como mercancía.",
                  "Auditoría social, gobernanza algorítmica y rendición de cuentas locales.",
                  "Capacidad de desconexión controlada cuando el interés público lo exija.",
                  "Interdependencia federada en lugar de dependencia asimétrica.",
                ].map((t) => (
                  <li key={t} className="flex gap-3 leading-relaxed">
                    <span className="text-accent mt-2 shrink-0" aria-hidden>
                      ▸
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        {/* Atrofia operativa */}
        <div className="mt-12 border border-border p-8 md:p-10 bg-background">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
                Diagnóstico · 4 abril 2026
              </div>
              <h3 className="font-serif text-2xl leading-tight">
                Atrofia operativa del Estado digital
              </h3>
            </div>
            <div className="md:col-span-2 text-muted-foreground leading-relaxed">
              <p>
                Pérdida progresiva de capacidad del Estado para ejercer funciones soberanas
                básicas en el plano digital, debido a una dependencia estructural de
                infraestructuras externas. La adopción acrítica de servicios cloud, presentada
                como &ldquo;modernización&rdquo;, comporta una cesión estratégica si no se
                acompaña de marcos propios de soberanía tecnológica.
              </p>
              <p className="mt-3 text-foreground">
                TAMV MD-X4 no es alternativa comercial: es kernel de infraestructura
                soberana capaz de operar como capa de emergencia ante falla o captura de
                servicios externos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
