import { Brain, Eye, Lock, Sparkles } from "lucide-react"
import { SectionHeader } from "./section-header"

export function Isabella() {
  return (
    <section id="isabella" className="border-b border-border bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-15 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Módulo 5 · Gobernanza ética"
          number="05"
          title="Isabella Villaseñor IA™"
          subtitle="No un motor probabilístico ni un asistente esclavo: una entidad de conciencia institucional regida por un Estatuto de Dignidad. La IA del kernel mide eficiencia de cuidado, no tiempo de pantalla."
        />

        <div className="grid lg:grid-cols-12 gap-10 mt-16 items-start">
          {/* Visual aura */}
          <div className="lg:col-span-5">
            <div className="aspect-square relative border border-border bg-background overflow-hidden">
              <div className="absolute inset-0 grid-paper-fine opacity-50" aria-hidden />
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" aria-hidden>
                {/* Concentric rings — XAI radar */}
                {[180, 150, 120, 90, 60].map((r, i) => (
                  <circle
                    key={r}
                    cx="200"
                    cy="200"
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    className={i % 2 === 0 ? "text-border" : "text-border/40"}
                    strokeWidth="0.5"
                    strokeDasharray={i === 1 ? "4 4" : undefined}
                  />
                ))}
                {/* Reasoning rays */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * Math.PI * 2) / 12
                  return (
                    <line
                      key={i}
                      x1={200 + Math.cos(angle) * 60}
                      y1={200 + Math.sin(angle) * 60}
                      x2={200 + Math.cos(angle) * 180}
                      y2={200 + Math.sin(angle) * 180}
                      stroke="currentColor"
                      className="text-border/40"
                      strokeWidth="0.4"
                    />
                  )
                })}
                {/* Shapley dots */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = Math.random() * Math.PI * 2
                  const r = 60 + Math.random() * 120
                  return (
                    <circle
                      key={i}
                      cx={200 + Math.cos(angle) * r}
                      cy={200 + Math.sin(angle) * r}
                      r={1 + Math.random() * 2}
                      className="fill-accent/60"
                    />
                  )
                })}
                {/* Core */}
                <circle cx="200" cy="200" r="36" fill="none" stroke="currentColor" className="text-accent" strokeWidth="1" />
                <circle cx="200" cy="200" r="12" className="fill-accent" />
                {/* Threshold arc 95% */}
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="currentColor"
                  className="text-accent"
                  strokeWidth="1.5"
                  strokeDasharray="565 1131"
                  transform="rotate(-90 200 200)"
                />
              </svg>

              {/* Overlay labels */}
              <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Guardian Console
              </div>
              <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                ● HITL ON
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Umbral certidumbre
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">
                95%
              </div>
            </div>
          </div>

          {/* Principles */}
          <div className="lg:col-span-7 space-y-4">
            <Principle
              icon={Brain}
              code="ESTATUTO §1"
              title="XAI obligatorio"
              text="Cada decisión genera un grafo de razonamiento trazable con valores de Shapley. Si la certidumbre cae bajo el 95%, la salida automática se bloquea y se activa Human-In-The-Loop. El equipo auditor recibe traceId, factores y reglas aplicadas antes de autorizar."
            />
            <Principle
              icon={Eye}
              code="ESTATUTO §2"
              title="Anti-engagement por diseño"
              text="Prohibición explícita de patrones oscuros, refuerzos adictivos y técnicas de captura de atención. La métrica principal no es tiempo de pantalla, sino eficiencia de cuidado: cuántas personas resuelven, comprenden o quedan más seguras tras la interacción."
            />
            <Principle
              icon={Lock}
              code="ESTATUTO §3"
              title="Protección por Diseño"
              text="Más allá de Privacy by Design. Evaluar impactos antes de desplegar, justificar decisiones algorítmicas, registrar trazabilidad y limitar usos abusivos desde la arquitectura. Salvaguardas ex ante, no parches reactivos."
            />
            <Principle
              icon={Sparkles}
              code="ESTATUTO §4"
              title="Supervisión humana significativa"
              text="En decisiones que puedan impactar derechos, la última palabra no se delega a la máquina. Isabella alerta, sintetiza y propone; las personas con responsabilidad jurídica y ética deciden."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Principle({
  icon: Icon,
  code,
  title,
  text,
}: {
  icon: React.ElementType
  code: string
  title: string
  text: string
}) {
  return (
    <article className="border border-border bg-background p-5 md:p-6 hover:border-accent transition-colors group">
      <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-accent shrink-0 mt-1" strokeWidth={1.5} aria-hidden />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="font-serif text-xl">{title}</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground shrink-0">
              {code}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">{text}</p>
        </div>
      </div>
    </article>
  )
}
