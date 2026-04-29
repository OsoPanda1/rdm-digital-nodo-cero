import { SectionHeader } from "./section-header"

const layers = [
  {
    n: 7,
    name: "Histórica · Memorial",
    desc: "Conserva el registro, la versión, la procedencia y la verdad de lo ocurrido. Impide el borrado, la reescritura oportunista y la amnesia institucional.",
  },
  {
    n: 6,
    name: "Técnica · Infraestructural",
    desc: "Convierte principios en sistemas, redes, software, dispositivos, sensores y servicios. Capa material de implementación.",
  },
  {
    n: 5,
    name: "Cognitiva · Algorítmica",
    desc: "Delimita lo que las máquinas pueden decidir, sugerir, inferir y ejecutar. Trazabilidad, auditoría, límites éticos y control humano responsable.",
  },
  {
    n: 4,
    name: "Económica",
    desc: "Regula circulación de valor, financiamiento, sostenibilidad y redistribución. Se opone a la extracción depredadora.",
  },
  {
    n: 3,
    name: "Política · Jurisdiccional",
    desc: "Ordena el ejercicio del poder, la legitimidad, la representación y la resolución de conflictos. Anti-captura institucional.",
  },
  {
    n: 2,
    name: "Constitucional",
    desc: "Reconoce derechos, deberes, soberanía y reglas de permanencia. Arquitectura normativa que impide la arbitrariedad.",
  },
  {
    n: 1,
    name: "Ontológica",
    desc: "Define qué existe, qué no existe y qué jamás debe normalizarse. Naturaleza del sujeto, del territorio, de la memoria y del límite.",
  },
]

export function Layers() {
  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Marco maestro · Canon federado"
          number="08"
          title="Siete capas civilizatorias"
          subtitle="Cada capa gobierna estrictamente a las inferiores. Ninguna capa inferior puede contradecir una superior. Ninguna ejecución técnica puede violar el marco ontológico, constitucional o memorial."
        />

        <div className="mt-16 grid lg:grid-cols-7 gap-px bg-border border border-border lg:items-stretch">
          {layers.map((l, i) => (
            <article
              key={l.n}
              className="bg-background p-5 lg:p-6 group hover:bg-card transition-colors flex flex-col"
              style={{
                opacity: 0.55 + (l.n / 7) * 0.45,
              }}
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif text-5xl leading-none text-muted-foreground/40 group-hover:text-accent transition-colors">
                  L{l.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {l.n === 7 ? "↑ rige" : i === layers.length - 1 ? "núcleo" : "↓ obedece"}
                </span>
              </div>
              <h3 className="font-serif text-lg leading-tight mb-2">{l.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{l.desc}</p>
            </article>
          ))}
        </div>

        {/* Six principles */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {[
            ["I", "La memoria es soberanía", "Sin memoria no hay continuidad. Sin continuidad no hay identidad. Sin identidad no hay decisión legítima."],
            ["II", "La dignidad no se negocia", "Ningún sistema puede exigir sumisión a cambio de acceso, visibilidad o pertenencia."],
            ["III", "La tecnología obedece al territorio", "La infraestructura existe para servir a la comunidad y no para sustituir su criterio."],
            ["IV", "El poder debe ser trazable", "Toda decisión relevante debe poder revisarse, auditarse y justificarse."],
            ["V", "La historia no es decorado", "Es un activo civilizatorio que debe preservarse con rigor, no instrumentalizarse de forma superficial."],
            ["VI", "Innovación sin ética = deterioro", "TAMV rechaza toda modernización que borre el origen o degrade el tejido social."],
          ].map(([n, title, text]) => (
            <article key={n as string} className="bg-background p-6">
              <div className="font-serif text-3xl text-accent mb-2">{n}</div>
              <h3 className="font-serif text-lg leading-tight mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
