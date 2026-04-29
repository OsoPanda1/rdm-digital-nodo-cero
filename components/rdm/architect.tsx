import { ExternalLink, Globe, BookOpen, Github } from "lucide-react"
import { SectionHeader } from "./section-header"

export function Architect() {
  return (
    <section id="arquitecto" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="Módulo 1 · Marco Civilizatorio"
          number="01"
          title="Declaración del Arquitecto"
          subtitle="No nací en un laboratorio; mi punto de partida fue una situación de riesgo sostenido."
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-16">
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-pretty">
            <p>
              Durante cinco años fui objeto de acoso, extorsión, robo de identidad y violencia
              digital amplificada por plataformas que, en su discurso público, se presentan como
              garantes de seguridad y comunidad. Esa experiencia me permitió constatar que la
              mayoría de los sistemas tecnológicos vigentes están optimizados para escalar
              contenido y capturar atención, no para proteger a las personas.
            </p>
            <p className="text-muted-foreground">
              Busqué apoyo en todos los niveles que, en teoría, deberían ofrecer respuesta:
              soporte de redes sociales, policía cibernética, organizaciones de derechos
              digitales, instancias internacionales. Las respuestas oscilaron entre la
              indiferencia y la tramitación burocrática.
            </p>
            <p>
              Tomé entonces una decisión que reorientó de manera definitiva mi trabajo: dejar
              de solicitar correcciones a un sistema que no estaba diseñado para responder y
              desarrollar una arquitectura propia desde un territorio específico:{" "}
              <span className="font-serif italic text-primary">
                Real del Monte, Hidalgo, México
              </span>
              .
            </p>
            <p className="text-muted-foreground">
              Lo que hoy se presenta bajo los nombres TAMV MD-X4, RDM-TOS y kernel
              heptafederado no es el resultado de especulaciones aisladas, sino de la
              conversión deliberada de la experiencia de supervivencia digital en arquitectura
              reproducible y auditable.
            </p>

            <blockquote className="border-l-2 border-accent pl-6 my-10 font-serif text-2xl md:text-3xl italic text-balance leading-snug">
              &ldquo;La ciberseguridad sin una base moral es solo otra forma de control.&rdquo;
              <footer className="font-sans text-sm not-italic text-muted-foreground mt-3 tracking-wide">
                — Anubis Villaseñor, abril 2026
              </footer>
            </blockquote>

            <p>
              Firmo este documento no como víctima ni como héroe, sino como{" "}
              <span className="text-foreground">Arquitecto Responsable</span> de una
              infraestructura que asume un riesgo claro y medible: demostrar que desde un
              pueblo minero de México se puede construir, con precisión, disciplina y
              evidencia, un sistema que no imita a los gigantes tecnológicos, sino que
              dialoga y compite con ellos desde una propuesta propia y soberana.
            </p>
          </div>

          {/* Identity card */}
          <aside className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="border border-border bg-card">
                {/* Header */}
                <div className="border-b border-border px-5 py-4 flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Identidad Soberana · F1
                  </div>
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse-soft" aria-hidden />
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Nombre legal
                    </div>
                    <div className="font-serif text-2xl leading-tight">
                      Edwin Oswaldo Castillo Trejo
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Criptónimo operativo
                    </div>
                    <div className="font-serif text-xl italic text-accent">
                      Anubis Villaseñor
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Rol
                      </div>
                      <div className="text-sm mt-1">Arquitecto Primario</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Posición
                      </div>
                      <div className="text-sm mt-1">Operador del Borde</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Disciplinas
                      </div>
                      <div className="text-sm mt-1">Sistemas distribuidos · IA agéntica · DDHH digitales</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Modelo
                      </div>
                      <div className="text-sm mt-1">Bootstrapping artesanal</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <a
                      href="https://orcid.org/0009-0008-5050-1539"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border hover:border-accent hover:bg-card transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-accent">iD</span>
                        <span className="text-sm">orcid.org/0009-0008-5050-1539</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent" />
                    </a>
                    <a
                      href="https://tamvonline-oficial.odoo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border hover:border-accent hover:bg-card transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Globe className="h-4 w-4 text-accent" />
                        <span className="text-sm">tamvonline-oficial.odoo.com</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent" />
                    </a>
                    <a
                      href="https://tamvonlinenetwork.blogspot.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border hover:border-accent hover:bg-card transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-accent" />
                        <span className="text-sm">tamvonlinenetwork.blogspot.com</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent" />
                    </a>
                    <a
                      href="https://github.com/OsoPanda1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border hover:border-accent hover:bg-card transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Github className="h-4 w-4 text-accent" />
                        <span className="text-sm">github.com/OsoPanda1</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent" />
                    </a>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between">
                  <span>Firma digital</span>
                  <span className="text-accent">verificada</span>
                </div>
              </div>

              {/* Trinchera stat */}
              <div className="mt-4 border border-border bg-card p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Ingeniería de trinchera
                </div>
                <div className="font-serif text-4xl">≈ 21,600 h</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Investigación y desarrollo independiente, sin capital de riesgo. Financiado
                  con artesanías &ldquo;El Rosario&rdquo;, música independiente y trabajo
                  físico. <span className="italic">La soberanía digital comienza con la soberanía del bolsillo.</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
