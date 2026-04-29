import { Layers3 } from "lucide-react"

export function CITEMESH() {
  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-5 flex items-center gap-3">
              <Layers3 className="h-4 w-4" aria-hidden />
              Reality Operating System
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              CITEMESH:
              <br />
              <span className="italic text-primary">no un metaverso</span>,
              <br />
              un sistema operativo
              <br />
              de la realidad.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-7 text-lg leading-relaxed text-muted-foreground">
            <p>
              <span className="text-foreground">
                CITEMESH (Civilizational Technological Metaverse Serving Humanity)
              </span>{" "}
              es un entramado tecnológico que fusiona identidad soberana, economía
              programable y gobernanza ética en una capa inmersiva de realidad extendida
              (XR) nativa, al servicio de comunidades reales —no de mercados de atención.
            </p>
            <p>
              A diferencia de los metaversos comerciales orientados al consumo, la
              especulación y la evasión, CITEMESH se configura como un{" "}
              <span className="text-foreground italic">
                Sistema Operativo de la Realidad
              </span>
              . El kernel TAMV MD-X4 es su motor; las siete federaciones, sus subsistemas.
            </p>
            <p>
              Es una tercera vía: rechaza tanto el extractivismo de datos de plataformas
              privadas como los modelos de vigilancia masiva de regímenes autoritarios.
              Propone una arquitectura donde el cómputo se desplaza al borde, devolviendo
              agencia y control a las comunidades en el lugar donde ocurren los fenómenos
              físicos, sociales y económicos.
            </p>

            <div className="grid grid-cols-2 gap-px bg-border border border-border mt-8">
              {[
                ["Identidad", "soberana"],
                ["Economía", "programable"],
                ["Gobernanza", "ética"],
                ["XR", "nativa"],
              ].map(([k, v]) => (
                <div key={k} className="bg-background p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {k}
                  </div>
                  <div className="font-serif text-xl mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
