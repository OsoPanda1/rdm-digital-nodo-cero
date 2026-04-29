import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export function ClosingCTA() {
  return (
    <section className="border-b border-border relative overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-30" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent mb-8">
          Invitación al escrutinio
        </div>
        <h2 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-5xl mx-auto text-balance">
          TAMV no solicita
          <br />
          <span className="italic text-primary">confianza ciega.</span>
          <br />
          Ofrece <span className="italic text-accent">trabajo verificable.</span>
        </h2>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto text-pretty">
          Auditores, funcionarios públicos, especialistas jurídicos, investigadoras,
          inversionistas o habitantes de Real del Monte: pongan a prueba cada afirmación,
          cada métrica y cada esquema de este kernel.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-none font-mono text-xs uppercase tracking-[0.2em]"
          >
            <a
              href="https://tamvonline-oficial.odoo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visitar TAMV Online
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none font-mono text-xs uppercase tracking-[0.2em] bg-transparent"
          >
            <a
              href="https://tamvonlinenetwork.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leer el blog
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none font-mono text-xs uppercase tracking-[0.2em] bg-transparent"
          >
            <a
              href="https://orcid.org/0009-0008-5050-1539"
              target="_blank"
              rel="noopener noreferrer"
            >
              Validar ORCID
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
