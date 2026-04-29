export interface Tribute {
  id: string
  name: string
  description: string
  priceInCents: number
  currency: string
  federation: string
}

// Source of truth for federated tributes (server-validated prices)
export const TRIBUTES: Tribute[] = [
  {
    id: "tributo-base",
    name: "Tributo de Ciudadanía",
    description:
      "Aportación simbólica que registra tu nombre en el Censo Federado del Nodo Cero y activa tu wallet TAMV con créditos iniciales.",
    priceInCents: 14900,
    currency: "MXN",
    federation: "Gubernamental",
  },
  {
    id: "tributo-kernel",
    name: "Sostén del Kernel TAMV",
    description:
      "Financia la infraestructura cognitiva soberana: Isabella Sentinel v9.0, FANN, Eros AI y el repositorio OsoPanda1.",
    priceInCents: 49900,
    currency: "MXN",
    federation: "Tecnológica",
  },
  {
    id: "tributo-manuscrito",
    name: "Patrocinio del Manuscrito",
    description:
      "Apoya la redacción y publicación de los Tomos del Compendio TAMV / Libro Génesis. Recibes acceso anticipado a capítulos.",
    priceInCents: 99900,
    currency: "MXN",
    federation: "Cultural",
  },
]

export function findTribute(id: string): Tribute | null {
  return TRIBUTES.find((t) => t.id === id) ?? null
}
