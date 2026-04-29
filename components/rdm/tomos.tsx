import { Book } from "lucide-react"
import { SectionHeader } from "./section-header"

const tomos = [
  {
    n: "I",
    title: "Fundamentos",
    layer: "Capas 0–1",
    chapters: [
      "Definición formal de TAMV (jurídica · matemática · técnica)",
      "Alcance civilizatorio y límites explícitos",
      "Axiomas fundacionales · Principios no negociables",
      "Ontología del ciudadano digital soberano",
      "Carta de derechos digitales · Memoria como vector de poder",
    ],
  },
  {
    n: "II",
    title: "Filosofía",
    layer: "Capa Ontológica extendida",
    chapters: [
      "Epistemología de sistemas civilizatorios",
      "Identidad persistente y muerte digital",
      "Teoría de dignidad digital",
      "Crítica al capitalismo de vigilancia",
      "IA como instrumento jurídico",
    ],
  },
  {
    n: "III",
    title: "Política y Gobernanza",
    layer: "Capa 3",
    chapters: [
      "Modelo constitucional algorítmico",
      "Representación fractal · Derecho a la opacidad",
      "Anticaptura institucional",
      "Estados de excepción digitales",
    ],
  },
  {
    n: "IV",
    title: "Marco Legal",
    layer: "Capas 2–3",
    chapters: [
      "Personalidad jurídica digital",
      "Jurisdicción distribuida · Contratos máquina-máquina",
      "Contratos XR · Evidencia computacional",
      "Herencia digital · Crímenes soberanos",
    ],
  },
  {
    n: "V",
    title: "Arquitectura Técnica",
    layer: "Capas 4–6",
    chapters: [
      "Modelo federado de capas · F1 Identidad soberana",
      "F2 Memoria · F3 Servicios · F4 XR",
      "F5 Gobernanza técnica · F6 Economía · F7 Presencia física",
      "Protocolos de red · Criptografía post-cuántica",
      "Auditoría de sesgos",
    ],
  },
  {
    n: "VI",
    title: "Seguridad Total",
    layer: "Threat model civilizatorio",
    chapters: [
      "STRIDE cognitivo · Seguridad perceptual",
      "Antigolpe institucional · Resiliencia geopolítica",
      "Escenarios de colapso · Reconstrucción",
    ],
  },
  {
    n: "VII",
    title: "Economía y Recursos",
    layer: "Capa 4",
    chapters: [
      "Economía no extractiva · Token ético",
      "Fondo Fénix · Tributación algorítmica",
      "Redistribución verificable · Antifraude",
    ],
  },
  {
    n: "VIII",
    title: "Operación",
    layer: "DevOps civilizatorio",
    chapters: [
      "Enmiendas constitucionales · Rollback temporal",
      "Forks legítimos · Gestión de crisis",
      "Certificación de operadores",
    ],
  },
  {
    n: "IX",
    title: "Ciencia y Educación",
    layer: "UTAMV",
    chapters: [
      "Certificación de conocimiento",
      "Ciencia reproducible",
      "Archivo histórico",
    ],
  },
  {
    n: "X",
    title: "Bibliografía",
    layer: "Referencias canónicas",
    chapters: ["Marcos internacionales · GDPR · NIST · UNESCO IA · GAIA-X"],
  },
  {
    n: "XI",
    title: "Apéndices Técnicos",
    layer: "Especificaciones",
    chapters: ["Esquemas BookPI™ · Protocolos PQC · Diagramas de despliegue"],
  },
]

export function Tomos() {
  return (
    <section id="tomos" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Libro Génesis · Canon federado de 7 capas"
          number="06"
          title="Tomos del Compendio"
          subtitle="Once tomos canónicos. Cada capa civilizatoria gobierna estrictamente a las inferiores. Ninguna ejecución técnica puede violar el marco ontológico, constitucional o memorial."
        />

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {tomos.map((t) => (
            <article
              key={t.n}
              className="bg-background p-6 hover:bg-card transition-colors group"
            >
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-border">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                    Tomo
                  </div>
                  <div className="font-serif text-5xl leading-none">{t.n}</div>
                </div>
                <Book
                  className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </div>
              <h3 className="font-serif text-2xl leading-tight">{t.title}</h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mt-1 mb-4">
                {t.layer}
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {t.chapters.map((c, i) => (
                  <li key={i} className="flex gap-2 leading-snug">
                    <span className="text-border shrink-0" aria-hidden>
                      ·
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Licensing */}
        <div className="mt-12 grid md:grid-cols-2 gap-px bg-border border border-border">
          <div className="bg-background p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Licenciamiento · marco filosófico
            </div>
            <div className="font-serif text-2xl">Creative Commons BY-NC-SA 4.0</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Núcleo filosófico-político, narrativa y memoria institucional bajo reglas de
              preservación, atribución y no captura.
            </p>
          </div>
          <div className="bg-background p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Licenciamiento · especificaciones
            </div>
            <div className="font-serif text-2xl">Open Specification + Apache 2.0</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Protocolos, módulos ejecutables y software bajo Apache 2.0 cuando aplique. Sin
              vendor lock-in.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
