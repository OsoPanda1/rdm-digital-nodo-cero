import { Hexagon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Identity */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Hexagon className="h-7 w-7 text-primary" strokeWidth={1.25} aria-hidden />
              <div>
                <div className="font-serif text-lg leading-tight">RDM Digital</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Kernel Heptafederado · TAMV MD-X4
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Sistema operativo urbano soberano de Real del Monte, Hidalgo. Compendio de
              Soberanía Tecnológica y Arquitectura Civilizatoria. Una infraestructura que
              dialoga y compite con los gigantes desde el Sur Global.
            </p>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterColumn
              title="Documento"
              links={[
                { label: "Manifiesto", href: "#manifiesto" },
                { label: "Heptafederado", href: "#federaciones" },
                { label: "Kernel MD-X4", href: "#kernel" },
                { label: "Tomos", href: "#tomos" },
                { label: "Evidencia", href: "#evidencia" },
              ]}
            />
            <FooterColumn
              title="Ecosistema"
              links={[
                { label: "TAMV Online", href: "https://tamvonline-oficial.odoo.com", external: true },
                { label: "Blog", href: "https://tamvonlinenetwork.blogspot.com", external: true },
                { label: "GitHub · OsoPanda1", href: "https://github.com/OsoPanda1", external: true },
                { label: "Repo nodo-cero", href: "https://github.com/OsoPanda1/rdm-digital-nodo-cero.git", external: true },
              ]}
            />
            <FooterColumn
              title="Identidad"
              links={[
                { label: "ORCID 0009-0008-5050-1539", href: "https://orcid.org/0009-0008-5050-1539", external: true },
                { label: "Real del Monte · MX", href: "#territorio" },
                { label: "Cinturón Volc. Transmex.", href: "#territorio" },
              ]}
            />
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-14 pt-6 border-t border-border grid md:grid-cols-3 gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div>© 2026 TAMV Online Network</div>
          <div className="md:text-center">
            <span className="text-foreground">Edwin Oswaldo Castillo Trejo</span>{" "}
            <span className="text-accent italic">· Anubis Villaseñor</span>
          </div>
          <div className="md:text-right">
            CC BY-NC-SA 4.0 · Apache 2.0 · Open Specification
          </div>
        </div>

        {/* Final mantra */}
        <div className="mt-10 pt-10 border-t border-border">
          <p className="font-serif text-xl md:text-2xl italic text-muted-foreground leading-relaxed text-balance text-center max-w-4xl mx-auto">
            &ldquo;Donde la memoria limita al poder, la dignidad define el alcance de la
            tecnología y el territorio recupera su capacidad de decidir sobre su propio
            destino.&rdquo;
          </p>
          <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
            Lema canónico · Libro Génesis
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors leading-snug"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
