export type TourismCategory = "historia" | "cultura" | "gastronomia" | "naturaleza" | "negocios"

export type TourismSpot = {
  id: string
  name: string
  category: TourismCategory
  summary: string
  description: string
  imageUrl: string
  address: string
  schedule: string
  tags: string[]
}

export const tourismSpots: TourismSpot[] = [
  {
    id: "mina-acosta",
    name: "Museo de Sitio Mina de Acosta",
    category: "historia",
    summary: "Recorrido minero con tiro, máquinas originales y narrativas del patrimonio de Real del Monte.",
    description: "Punto clave para entender la historia minera local y su impacto social y urbano.",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    address: "Zona Histórica Minera, Real del Monte",
    schedule: "10:00 - 18:00",
    tags: ["patrimonio", "minería", "museo"],
  },
  {
    id: "panteon-ingles",
    name: "Panteón Inglés",
    category: "historia",
    summary: "Memoria de la comunidad cornish y arquitectura funeraria única en México.",
    description: "Visita cultural y de identidad histórica, ideal para rutas guiadas.",
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    address: "Cerro del Judío, Real del Monte",
    schedule: "09:00 - 17:00",
    tags: ["cornish", "arquitectura", "historia"],
  },
  {
    id: "parroquia-rosario",
    name: "Parroquia de Nuestra Señora del Rosario",
    category: "cultura",
    summary: "Templo central con gran valor artístico y tradición comunitaria.",
    description: "Nodo de actividades cívicas y festividades locales.",
    imageUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80",
    address: "Centro Histórico, Real del Monte",
    schedule: "08:00 - 20:00",
    tags: ["religión", "arte", "tradición"],
  },
  {
    id: "pastes-tradicionales",
    name: "Corredor de Pastes Tradicionales",
    category: "gastronomia",
    summary: "Ruta gastronómica local para degustar pastes y cocina hidalguense.",
    description: "Experiencia turística de alta demanda con identidad regional.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    address: "Primer Cuadro de la Ciudad",
    schedule: "08:00 - 22:00",
    tags: ["pastes", "comida", "familia"],
  },
  {
    id: "mirador-pena",
    name: "Mirador Peña del Zumate",
    category: "naturaleza",
    summary: "Vista panorámica para fotografía, senderismo y observación de paisaje.",
    description: "Ideal para turismo de naturaleza y rutas outdoor.",
    imageUrl: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=1200&q=80",
    address: "Acceso Norte, Real del Monte",
    schedule: "06:00 - 19:00",
    tags: ["mirador", "fotografía", "senderismo"],
  },
  {
    id: "mercado-artesanal",
    name: "Mercado Artesanal TAMV",
    category: "negocios",
    summary: "Comercios locales con productos artesanales y trazabilidad digital.",
    description: "Plataforma de impulso económico local para visitantes y creadores.",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    address: "Plaza Cívica, Real del Monte",
    schedule: "09:00 - 21:00",
    tags: ["artesanías", "economía local", "comercio"],
  },
]
