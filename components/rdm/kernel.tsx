import Image from "next/image"
import { Cpu, Activity, ShieldAlert, Flame } from "lucide-react"
import { SectionHeader } from "./section-header"

const protocols = [
  {
    icon: Cpu,
    code: "PROTO-01",
    name: "Autopoiesis",
    description:
      "Métrica compuesta de Temperatura de Integridad: CPU, latencia entre federaciones, tasas de error PQC y eventos de seguridad. Al superar umbrales, el sistema regenera componentes desde versiones verificadas.",
  },
  {
    icon: Activity,
    code: "PROTO-02",
    name: "Modo Isla",
    description:
      "Continuidad operativa en aislamiento total. Malla local P2P sostiene servicios esenciales sin Internet, con sincronización diferida (store-and-forward) cuando regresa la conectividad.",
  },
  {
    icon: ShieldAlert,
    code: "PROTO-03",
    name: "Defensa Extrema",
    description:
      "Tenochtitlan, Anubis, Horus, Dekateotl y radares Quetzalcóatl/Ojo de Ra se despliegan ante ataques sistémicos: contención masiva, bloqueo de exfiltración y telemetría forense reforzada.",
  },
  {
    icon: Flame,
    code: "PROTO-04",
    name: "Fénix",
    description:
      "Si la integridad global se compromete: cifrado fuerte de claves y configuraciones, desactivación ordenada de servicios no vitales y restauración controlada desde snapshot limpio.",
  },
]

export function Kernel() {
  return (
    <section id="kernel" className="border-b border-border bg-card/40 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/sovereign-architecture.jpg"
          alt=""
          fill
          className="object-cover opacity-15"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Módulo 3.4 · Protocolos de decisión"
          number="03"
          title="Kernel TAMV MD-X4"
          subtitle="Cuatro protocolos en cascada que priorizan la vida sobre cualquier otro objetivo. Automatización suficiente para reaccionar en milisegundos; supervisión humana significativa cuando hay derechos en juego."
        />

        {/* Decision tree */}
        <div className="mt-16 border border-border bg-background">
          <div className="border-b border-border px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse-soft" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Árbol de decisión · evento fuera de patrón
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              Regla primaria: preservación de la vida
            </span>
          </div>

          <div className="grid md:grid-cols-2 divide-x divide-border">
            <div className="p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                Si hay riesgo vital
              </div>
              <div className="font-serif text-2xl mb-3">Protocolo de Máxima Seguridad</div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-mono text-accent">01</span>
                  Aislamiento de zona o identidades implicadas. Corte de circulación lógica.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent">02</span>
                  Escalada a decisión humana con resumen estructurado del incidente.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent">03</span>
                  Sistema en espera activa: salvaguardas mínimas, decisión final humana.
                </li>
              </ol>
            </div>
            <div className="p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                Si hay ataque o fraude sin riesgo vital
              </div>
              <div className="font-serif text-2xl mb-3">Protocolo de Defensa Extrema</div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-mono text-accent">01</span>
                  Capas de contención masiva · cierre de superficie de ataque.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent">02</span>
                  Barreras de exfiltración · cifrado reforzado y segmentación.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-accent">03</span>
                  Telemetría reforzada y registro forense para auditoría posterior.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Protocols grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mt-10">
          {protocols.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.code} className="bg-background p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {p.code}
                  </span>
                </div>
                <h3 className="font-serif text-xl mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            )
          })}
        </div>

        {/* Specs */}
        <div className="mt-10 grid md:grid-cols-3 gap-px bg-border border border-border">
          {[
            { k: "Bulkheading", v: "Sí", sub: "aislamiento de fallos por federación" },
            { k: "Zero-Trust", v: "Sí", sub: "validación entre microservicios" },
            { k: "PQC ready", v: "ML-KEM / ML-DSA", sub: "FIPS 203 · 204 (NIST)" },
            { k: "Edge ledger", v: "BookPI™ + MSR", sub: "Merkle · sellos de tiempo" },
            { k: "Modo Isla", v: "store-and-forward", sub: "P2P local + sincronización diferida" },
            { k: "HITL", v: "umbral 95%", sub: "human-in-the-loop por defecto" },
          ].map((s) => (
            <div key={s.k} className="bg-background p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {s.k}
              </div>
              <div className="font-serif text-xl mt-1">{s.v}</div>
              <div className="text-xs text-muted-foreground italic mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
