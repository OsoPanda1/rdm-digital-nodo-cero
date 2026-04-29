export type NomenclatureEntry = {
  symbolic: string
  technical: string
  externalLabel: string
  description: string
}

export const TAMV_NOMENCLATURE: NomenclatureEntry[] = [
  {
    symbolic: "DEKATEOTL",
    technical: "Security Resilience Layer 11",
    externalLabel: "Policy & Resilience Engine",
    description: "Evalúa políticas ABAC, resiliencia de servicios y cumplimiento operativo.",
  },
  {
    symbolic: "Ojo de Ra",
    technical: "Internal East-West Radar",
    externalLabel: "Internal Traffic Radar",
    description: "Monitorea tráfico entre servicios internos y anomalías de latencia.",
  },
  {
    symbolic: "Ojo de Quetzalcóatl",
    technical: "Public Ingress Radar",
    externalLabel: "Public Ingress Radar",
    description: "Monitorea tráfico público, saturación y amenazas de entrada.",
  },
]
