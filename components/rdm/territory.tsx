import { Mountain, Waves, Building2, FileWarning } from "lucide-react"
import { SectionHeader } from "./section-header"

export function Territory() {
  return (
    <section id="territorio" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Módulo 4 · Resiliencia forense"
          number="04"
          title="RDM Digital — Sistema Operativo Urbano"
          subtitle="No es Smart City. Es Sovereign Fortress City. El gemelo digital 1:1 de Real del Monte como tercer testigo técnico, capaz de anclar evidencia inmutable frente a la negligencia en obra pública."
        />

        <div className="grid lg:grid-cols-12 gap-10 mt-16">
          {/* Map / coordinates panel */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-card sticky top-32">
              <div className="border-b border-border px-5 py-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Coordenadas operativas
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  GEO-LOCK
                </span>
              </div>

              <div className="aspect-square relative overflow-hidden grid-paper-fine">
                {/* Stylized topographic SVG */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full"
                  aria-hidden
                >
                  {/* Contour lines */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ellipse
                      key={i}
                      cx={200 + Math.sin(i) * 12}
                      cy={200 + Math.cos(i) * 8}
                      rx={170 - i * 16}
                      ry={130 - i * 12}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className={i % 3 === 0 ? "text-border" : "text-border/40"}
                      transform={`rotate(${10 + i * 3} 200 200)`}
                    />
                  ))}
                  {/* Grid */}
                  {[100, 200, 300].map((p) => (
                    <g key={p}>
                      <line x1={p} y1={0} x2={p} y2={400} stroke="currentColor" className="text-border/30" strokeWidth="0.3" strokeDasharray="2 4" />
                      <line x1={0} y1={p} x2={400} y2={p} stroke="currentColor" className="text-border/30" strokeWidth="0.3" strokeDasharray="2 4" />
                    </g>
                  ))}
                  {/* Center marker */}
                  <circle cx="200" cy="200" r="32" fill="none" stroke="currentColor" className="text-accent" strokeWidth="0.5" />
                  <circle cx="200" cy="200" r="6" className="fill-accent" />
                  <circle cx="200" cy="200" r="2" className="fill-background" />
                  {/* Crosshairs */}
                  <line x1="200" y1="160" x2="200" y2="240" stroke="currentColor" className="text-accent" strokeWidth="0.5" />
                  <line x1="160" y1="200" x2="240" y2="200" stroke="currentColor" className="text-accent" strokeWidth="0.5" />
                  {/* Other nodes */}
                  {[
                    [100, 120], [310, 95], [330, 280], [85, 290], [240, 320], [150, 80],
                  ].map(([x, y], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="3" className="fill-primary/60" />
                      <line x1={200} y1={200} x2={x} y2={y} stroke="currentColor" className="text-border" strokeWidth="0.3" strokeDasharray="2 2" />
                    </g>
                  ))}
                  {/* Labels */}
                  <text x="208" y="196" className="fill-foreground font-mono" style={{ fontSize: "8px" }}>
                    RDM-NODO-0
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Latitud</div>
                  <div className="font-mono text-sm mt-1">19.9655° N</div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Longitud</div>
                  <div className="font-mono text-sm mt-1">98.6753° W</div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Altitud</div>
                  <div className="font-mono text-sm mt-1">2,720 m</div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cinturón</div>
                  <div className="font-mono text-sm mt-1">Volc. Transmex.</div>
                </div>
              </div>

              <div className="border-t border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Real del Monte · Mineral del Monte · Hidalgo · MX
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            <Capability
              icon={Mountain}
              title="Gemelo Digital Forense 1:1"
              text="Cada tramo de carretera, cámara pluvial, colector y muro de contención modelado como entidad estructural versionada. Flujos hidráulicos y tensiones mecánicas como eventos físicos discretos. Auditoría reproducible sobre la reconstrucción de la carretera principal y el drenaje urbano."
            />
            <Capability
              icon={Waves}
              title="Inferencia de Borde · CFD + Monte Carlo"
              text="Escurrimiento superficial forzado sobre el modelo 3D del municipio. Predicción de socavones, saturaciones pluviales y puntos de fallo estructural mediante datos sintéticos validados por crowdsourcing ciudadano. Cada reporte: un sensor de borde."
            />
            <Capability
              icon={FileWarning}
              title="Cadena de Custodia Inmutable"
              text="Telemetría de eventos críticos firmada con esquemas PQC y árboles de Merkle. BookPI™ como ledger MSR (Multi-State Record). Sellos de tiempo robustos que dificultan la alteración a posteriori de registros de lluvias, daños o mantenimiento. RDM Digital como tercer testigo técnico."
            />
            <Capability
              icon={Building2}
              title="Modo Isla · Autarquía Territorial"
              text="Si la carretera colapsa o cae la fibra óptica, la malla local P2P sostiene el pulso económico y de emergencia. Acceso a mapas de riesgo, rutas de evacuación y directorio de servicios sin dependencia de infraestructuras transoceánicas."
            />
          </div>
        </div>

        {/* Quote band */}
        <div className="mt-20 border-t border-b border-border py-12">
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-balance max-w-5xl text-pretty">
            <span className="text-accent">&ldquo;</span>
            El control del borde, del silicio y de la trazabilidad permite a Real del Monte
            sobrevivir y adaptarse a la incompetencia o negligencia externa, elevando la
            gestión territorial desde la dependencia reactiva hacia una{" "}
            <span className="italic">soberanía técnica proactiva</span>.
            <span className="text-accent">&rdquo;</span>
          </blockquote>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            §4.4 · Soberanía Digital como Auditoría Permanente
          </div>
        </div>
      </div>
    </section>
  )
}

function Capability({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType
  title: string
  text: string
}) {
  return (
    <article className="border border-border bg-card p-6 md:p-7 group hover:border-accent transition-colors">
      <div className="flex items-start gap-5">
        <div className="border border-border p-3 group-hover:border-accent group-hover:text-accent transition-colors shrink-0">
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </div>
        <div>
          <h3 className="font-serif text-2xl mb-2 leading-tight">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{text}</p>
        </div>
      </div>
    </article>
  )
}
