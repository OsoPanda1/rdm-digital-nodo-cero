import Image from "next/image"
import { ArrowDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      id="manifiesto"
      className="relative overflow-hidden border-b border-border"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/real-del-monte-hero.jpg"
          alt="Real del Monte, Hidalgo, México"
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        <div className="absolute inset-0 grid-paper opacity-30" aria-hidden />
      </div>

      {/* Scan line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-scan" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        {/* Header tags */}
        <div className="flex flex-wrap items-center gap-2 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="border border-border bg-card/60 px-2.5 py-1">
            TAMV-RDM-2026-THESIS-MANIFESTO-001-EXT
          </span>
          <span className="text-border" aria-hidden>
            ◆
          </span>
          <span className="text-accent">Compendio de Soberanía Tecnológica</span>
          <span className="text-border" aria-hidden>
            ◆
          </span>
          <span>Edición v1 · Real del Monte</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-balance mb-8">
          <span className="block text-muted-foreground/70 text-lg md:text-xl font-mono uppercase tracking-[0.4em] mb-6">
            RDM Digital
          </span>
          Donde la memoria
          <br />
          <span className="italic text-primary">limita al poder</span>,
          <br />
          la dignidad dicta
          <br />
          lo que la tecnología
          <br />
          <span className="italic text-accent">puede hacer.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 text-pretty">
          Sistema operativo urbano soberano de Real del Monte, Hidalgo. Primer despliegue
          territorial del <span className="text-foreground">Kernel Heptafederado TAMV MD-X4</span>:
          una arquitectura civilizatoria diseñada y operada desde el Cinturón Volcánico
          Transmexicano para impugnar el modelo extractivo de la nube global.
        </p>

        {/* Author block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border max-w-3xl border border-border mb-12">
          <div className="bg-background p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Arquitecto Primario
            </div>
            <div className="font-serif text-lg leading-tight">
              Edwin Oswaldo
              <br />
              Castillo Trejo
            </div>
            <div className="text-sm text-accent italic mt-1">Anubis Villaseñor</div>
          </div>
          <div className="bg-background p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              ORCID
            </div>
            <div className="font-mono text-sm leading-tight break-all">
              0009-0008-
              <br />
              5050-1539
            </div>
            <div className="text-xs text-muted-foreground mt-1">verificado</div>
          </div>
          <div className="bg-background p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Localización Operativa
            </div>
            <div className="font-serif text-lg leading-tight">
              Real del Monte
              <br />
              Hidalgo
            </div>
            <div className="text-xs text-muted-foreground mt-1">Pueblo Mágico · MX</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-none font-mono text-xs uppercase tracking-[0.2em]">
            <a href="/federaciones">
              Entrar a las 7 Federaciones
              <ArrowDown className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none font-mono text-xs uppercase tracking-[0.2em] bg-transparent"
          >
            <a href="/manuscrito">
              <FileText className="mr-2 h-4 w-4" />
              Leer el Manuscrito
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-none font-mono text-xs uppercase tracking-[0.2em]"
          >
            <a href="/mercado">Tributar al Nodo Cero →</a>
          </Button>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { k: "Federaciones", v: "7", sub: "soberanas" },
            { k: "Horas R&D", v: "21,600", sub: "ingeniería de trinchera" },
            { k: "Año cero", v: "2026", sub: "despliegue territorial" },
            { k: "SLA", v: "Supervivencia", sub: "territorial · vida" },
          ].map((s) => (
            <div key={s.k} className="px-4 py-5 md:px-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {s.k}
              </div>
              <div className="font-serif text-3xl md:text-4xl mt-1">{s.v}</div>
              <div className="text-xs text-muted-foreground italic">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
