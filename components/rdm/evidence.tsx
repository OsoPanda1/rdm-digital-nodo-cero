import { Hash, Clock, GitBranch, Database } from "lucide-react"
import { SectionHeader } from "./section-header"

export function Evidence() {
  return (
    <section id="evidencia" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader
          eyebrow="BookPI™ · Multi-State Record"
          number="07"
          title="Cadena de custodia inmutable"
          subtitle="El ledger soberano del kernel. Cada lote de telemetría firmado con criptografía post-cuántica y anclado en árboles de Merkle. Evidencia técnica reproducible, ofrecible en peritajes y procedimientos administrativos."
        />

        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          {/* Ledger preview */}
          <div className="lg:col-span-7">
            <div className="border border-border bg-background overflow-hidden">
              <div className="border-b border-border px-5 py-3 flex items-center justify-between bg-card">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-accent" aria-hidden />
                  <span className="font-mono text-xs uppercase tracking-[0.25em]">
                    BookPI™ · ledger.rdm
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  bloques · últimos 6
                </span>
              </div>
              <div className="divide-y divide-border font-mono text-xs">
                {ledger.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-5 py-3 hover:bg-card/60">
                    <div className="col-span-2 text-muted-foreground">
                      #{(998421 - i).toString()}
                    </div>
                    <div className="col-span-4 text-foreground truncate">{row.event}</div>
                    <div className="col-span-3 text-accent truncate">{row.hash}</div>
                    <div className="col-span-3 text-muted-foreground text-right">
                      {row.time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-5 py-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                <span>FIPS 204 · ML-DSA verificado</span>
                <span className="text-accent">● sincronizado</span>
              </div>
            </div>

            {/* Compliance */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mt-6">
              {[
                { label: "RGPD", state: "compatible" },
                { label: "NIST PQC", state: "FIPS 203/204" },
                { label: "GAIA-X", state: "alineado" },
                { label: "UNESCO IA", state: "alineado" },
              ].map((c) => (
                <div key={c.label} className="bg-background p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="text-sm mt-1">{c.state}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Side specs */}
          <div className="lg:col-span-5 space-y-4">
            <Spec
              icon={Hash}
              title="Hashes y firmas"
              detail="ML-DSA (FIPS 204) por defecto · ML-KEM (FIPS 203) para intercambio. Rotación de claves por dominios de confianza. Separación entre claves de operación y claves de auditoría."
            />
            <Spec
              icon={GitBranch}
              title="DataGit™"
              detail="Sistema de control de versiones para activos culturales y documentales. Cada cambio firmado con identidad soberana. Resistente a reescrituras unilaterales del histórico."
            />
            <Spec
              icon={Clock}
              title="Sellos de tiempo robustos"
              detail="Anclajes temporales redundantes. Coherencia interna en Modo Isla con reconciliación diferida. Resoluciones de conflictos basadas en reglas explícitas, no en confianza ciega."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const ledger = [
  {
    event: "geo.precip.rdm.0421T03",
    hash: "0x7a3f…b2e1",
    time: "2026-04-21 03:14:09 UTC",
  },
  {
    event: "civic.report.bach3.calle-cuarteles",
    hash: "0x91c2…8f04",
    time: "2026-04-20 22:48:51 UTC",
  },
  {
    event: "kernel.federation.F5.rotate-keys",
    hash: "0x4d8e…1a99",
    time: "2026-04-20 18:00:00 UTC",
  },
  {
    event: "isabella.decision.escalate-hitl",
    hash: "0xb6f1…3c2d",
    time: "2026-04-20 14:32:17 UTC",
  },
  {
    event: "economy.20-30-50.distribution",
    hash: "0x2e7a…ff5b",
    time: "2026-04-20 09:11:04 UTC",
  },
  {
    event: "twin.cfd.run.scenario-r17",
    hash: "0xa0d3…64e8",
    time: "2026-04-19 23:55:38 UTC",
  },
]

function Spec({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ElementType
  title: string
  detail: string
}) {
  return (
    <article className="border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-accent shrink-0 mt-1" strokeWidth={1.5} aria-hidden />
        <div>
          <h3 className="font-serif text-xl mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
        </div>
      </div>
    </article>
  )
}
