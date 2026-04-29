import {
  Palette,
  GraduationCap,
  Coins,
  Map,
  KeyRound,
  Scale,
  Shield,
} from "lucide-react"
import { SectionHeader } from "./section-header"

const federations = [
  {
    id: "F1",
    icon: Palette,
    name: "Contenido y Artes",
    role: "Inmutabilidad de activos",
    capabilities: [
      "Pipeline de huellas criptográficas (Merkle / MSR)",
      "Guardianía de autoría · BookPI™ + DataGit™",
      "Radar anti-scraping y exfiltración",
    ],
    motto: "Cada activo cultural firmado, fechado y trazable.",
  },
  {
    id: "F2",
    icon: GraduationCap,
    name: "Mentoría Profesional",
    role: "Optimización neurocognitiva",
    capabilities: [
      "Motor adaptativo IRT · Test TAMV-I",
      "Monitoreo cognitivo · ergonomía digital",
      "Rutas formativas medibles y auditables",
    ],
    motto: "Personalización sin manipulación.",
  },
  {
    id: "F3",
    icon: Coins,
    name: "Economía Multimodal",
    role: "Autonomía financiera",
    capabilities: [
      "Edge ledger soberano · Modo Isla",
      "Protocolo 20/30/50 · Fondo Fénix",
      "Liquidación local con doble-gasto controlado",
    ],
    motto: "El valor circula en el territorio.",
  },
  {
    id: "F4",
    icon: Map,
    name: "Gestión Territorial",
    role: "Gemelo Digital RDM",
    capabilities: [
      "Edge-HPC · simulación de elementos finitos",
      "Radar geotécnico e hidrometeorológico",
      "Sincronización 1:1 con Real del Monte",
    ],
    motto: "El territorio se piensa a sí mismo.",
  },
  {
    id: "F5",
    icon: KeyRound,
    name: "Seguridad Criptográfica",
    role: "PQC · agilidad criptográfica",
    capabilities: [
      "FIPS 203 (ML-KEM) · FIPS 204 (ML-DSA)",
      "Cifrado E2E en tránsito y en reposo",
      "Rotación de claves por dominios de confianza",
    ],
    motto: "Resistente al hoy y al mañana cuántico.",
  },
  {
    id: "F6",
    icon: Scale,
    name: "Gobernanza Ética",
    role: "Protocolo Isabella",
    capabilities: [
      "Radar de sesgo algorítmico · XAI",
      "Trazas Shapley · Human-In-The-Loop",
      "Estatuto de Dignidad vinculante",
    ],
    motto: "El córtex prefrontal del kernel.",
  },
  {
    id: "F7",
    icon: Shield,
    name: "Soberanía Regional",
    role: "Firewall geopolítico",
    capabilities: [
      "Radar de frontera digital",
      "Residencia de datos · jurisdicción local",
      "Modo Isla · capacidad de desconexión",
    ],
    motto: "El borde decide su propio destino.",
  },
]

export function Federations() {
  return (
    <section id="federaciones" className="border-b border-border relative">
      <div className="absolute inset-0 grid-paper opacity-20 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Módulo 3 · Anatomía del Kernel"
          number="02"
          title="El Núcleo Heptafederado"
          subtitle="Siete federaciones funcionales, aisladas en sus dominios de seguridad pero coordinadas por una orquestación celular. Cada una con su propio pipeline de integridad, su radar y su guardianía."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border mt-16">
          {federations.map((f) => {
            const Icon = f.icon
            return (
              <article
                key={f.id}
                className="group relative bg-background hover:bg-card transition-colors p-7 lg:p-8"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="border border-border p-2.5 group-hover:border-accent transition-colors">
                      <Icon
                        className="h-5 w-5 text-foreground group-hover:text-accent transition-colors"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Federación
                      </div>
                      <div className="font-mono text-sm font-semibold tracking-wide">{f.id}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    activa
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl leading-tight mb-1">{f.name}</h3>
                <p className="text-sm text-accent italic mb-5">{f.role}</p>

                {/* Capabilities */}
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  {f.capabilities.map((c) => (
                    <li key={c} className="flex gap-2.5 leading-relaxed">
                      <span className="text-border mt-1.5 shrink-0" aria-hidden>
                        ▸
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>

                {/* Motto */}
                <div className="pt-4 border-t border-border">
                  <p className="font-serif italic text-sm text-foreground/90">
                    &ldquo;{f.motto}&rdquo;
                  </p>
                </div>
              </article>
            )
          })}

          {/* Final cell: heptagon visual */}
          <article className="relative bg-background p-7 lg:p-8 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 grid-paper-fine opacity-30" aria-hidden />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-3">
                Topología
              </div>
              <h3 className="font-serif text-2xl leading-tight mb-2">
                Orquestación celular
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Microservicios federados con bulkheading, segmentación por dominios y
                gobernanza explícita entre capas. Si una falla, las otras seis permanecen
                operativas.
              </p>
            </div>
            <div className="relative mt-6 flex items-center justify-center">
              <Heptagon />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function Heptagon() {
  // 7-vertex polygon visual
  const r = 50
  const cx = 60
  const cy = 60
  const points = Array.from({ length: 7 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  })

  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32" aria-hidden>
      <polygon
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="currentColor"
        className="text-border"
        strokeWidth="0.5"
      />
      {points.map((p, i) => (
        <g key={i}>
          {points
            .filter((_, j) => j !== i)
            .map((p2, j) => (
              <line
                key={j}
                x1={p[0]}
                y1={p[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="currentColor"
                className="text-border/40"
                strokeWidth="0.3"
              />
            ))}
        </g>
      ))}
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" className="fill-accent" />
      ))}
      <circle cx={cx} cy={cy} r="4" className="fill-primary" />
      <text
        x={cx}
        y={cy + 2}
        textAnchor="middle"
        className="fill-primary-foreground font-mono"
        style={{ fontSize: "5px" }}
      >
        MD-X4
      </text>
    </svg>
  )
}
