import { Radio } from "lucide-react"

export function TopBar() {
  const ticker = [
    "TAMV-RDM-2026-THESIS-MANIFESTO-001-EXT",
    "ORCID 0009-0008-5050-1539",
    "Kernel MD-X4 · v1.0.0-soberano",
    "Real del Monte · Hidalgo · México",
    "Modo Isla: standby",
    "Federaciones activas: 7/7",
    "Temperatura de integridad: nominal",
    "BookPI™ ledger: sincronizado",
    "Isabella IA™ · HITL ON",
    "Cinturón Volcánico Transmexicano · 19.97°N 98.67°W",
  ]

  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
        <span className="flex items-center gap-1.5 text-accent shrink-0">
          <Radio className="h-3 w-3 animate-pulse-soft" aria-hidden />
          <span>EN VIVO</span>
        </span>
        <span className="text-border" aria-hidden>
          //
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex gap-8 animate-ticker whitespace-nowrap">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="shrink-0">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
