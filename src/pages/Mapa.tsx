import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Award, Navigation, ZoomIn, ZoomOut, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

import pasteImg from "@/assets/paste.webp";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

interface MapMarker {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  type: "place" | "business";
  isPremium?: boolean;
  rating?: number;
  phone?: string;
}

const markers: MapMarker[] = [
  { id: "1", name: "Mina de Acosta", category: "Mina", lat: 20.141, lng: -98.671, description: "Desciende 450 metros bajo tierra en esta mina del siglo XVIII.", image: minaImg, type: "place", rating: 4.8 },
  { id: "2", name: "Panteón Inglés", category: "Museo", lat: 20.139, lng: -98.675, description: "Cementerio único con cruces celtas entre pinos y neblina.", image: panteonImg, type: "place", rating: 4.7 },
  { id: "3", name: "Peñas Cargadas", category: "Naturaleza", lat: 20.145, lng: -98.668, description: "Formaciones rocosas gigantes en equilibrio imposible.", image: penasImg, type: "place", rating: 4.9 },
  { id: "4", name: "Plaza Principal", category: "Cultura", lat: 20.138, lng: -98.673, description: "El corazón del pueblo mágico.", image: callesImg, type: "place", rating: 4.5 },
  { id: "5", name: "Pastes El Portal", category: "Pastes", lat: 20.137, lng: -98.672, description: "Los pastes más tradicionales desde 1985.", image: pasteImg, type: "business", isPremium: true, rating: 4.9, phone: "771 123 4567" },
  { id: "6", name: "Hotel Real de Minas", category: "Hospedaje", lat: 20.140, lng: -98.670, description: "Hotel boutique en casona colonial restaurada.", image: callesImg, type: "business", isPremium: true, rating: 4.7, phone: "771 234 5678" },
  { id: "7", name: "Artesanías del Monte", category: "Souvenir", lat: 20.136, lng: -98.674, description: "Artesanías locales hechas a mano.", image: callesImg, type: "business", isPremium: true, rating: 4.6, phone: "771 345 6789" },
];

const MAP_CENTER = { x: 50, y: 50 };

const getMarkerPosition = (marker: MapMarker) => {
  const latCenter = 20.1395;
  const lngCenter = -98.6725;
  const scale = 2800;
  const x = MAP_CENTER.x + (marker.lng - lngCenter) * scale;
  const y = MAP_CENTER.y - (marker.lat - latCenter) * scale;
  return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
};

const MapaPage = () => {
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [filter, setFilter] = useState<"all" | "place" | "business">("all");

  const filtered = markers.filter((m) =>
    filter === "all" ? true : m.type === filter
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
                Mapa de Real del Monte
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Explora los sitios turísticos y negocios premium del Pueblo Mágico.
              </p>
            </motion.div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {[
                { key: "all", label: "Todo" },
                { key: "place", label: "Sitios turísticos" },
                { key: "business", label: "Negocios" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as typeof filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filter === f.key
                      ? "btn-premium"
                      : "btn-glass"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Map container */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2 relative rounded-2xl overflow-hidden glass" style={{ minHeight: 500 }}>
                {/* Stylized background */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest/10 via-accent/5 to-gold/10" />
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, hsl(var(--forest) / 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, hsl(var(--gold) / 0.1) 0%, transparent 50%),
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23666' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                  `
                }} />

                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Street labels */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-medium">
                  Real del Monte · Pueblo Mágico
                </div>

                {/* Compass */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>

                {/* Markers */}
                {filtered.map((marker) => {
                  const pos = getMarkerPosition(marker);
                  const isSelected = selected?.id === marker.id;
                  return (
                    <motion.button
                      key={marker.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      onClick={() => setSelected(isSelected ? null : marker)}
                      className="absolute z-20 group"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      {/* Glow ring */}
                      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        isSelected ? "scale-[2.5] opacity-100" : "scale-[1.8] opacity-0 group-hover:opacity-60"
                      } ${
                        marker.isPremium ? "bg-gold/20" : marker.type === "place" ? "bg-primary/15" : "bg-forest/15"
                      }`} />

                      {/* Pin */}
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSelected ? "scale-125" : "group-hover:scale-110"
                      } ${
                        marker.isPremium
                          ? "bg-gradient-warm shadow-premium"
                          : marker.type === "place"
                          ? "bg-primary shadow-warm"
                          : "bg-forest shadow-card"
                      }`}>
                        {marker.isPremium ? (
                          <Award className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <MapPin className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>

                      {/* Label */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-medium transition-opacity ${
                        isSelected ? "opacity-100 glass" : "opacity-0 group-hover:opacity-100 glass"
                      } text-foreground`}>
                        {marker.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Sidebar / detail */}
              <div className="space-y-4">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-2xl overflow-hidden glass shadow-elevated"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-card" />
                      {selected.isPremium && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gold/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                          <Award className="w-3 h-3" /> Premium
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-primary font-medium uppercase tracking-wide">{selected.category}</span>
                      <h3 className="font-serif text-xl font-bold text-foreground mt-1">{selected.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selected.description}</p>
                      <div className="flex items-center gap-3 mt-4">
                        {selected.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                            <span className="text-sm font-medium text-foreground">{selected.rating}</span>
                          </div>
                        )}
                        {selected.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-xs">{selected.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-2xl glass p-8 text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Selecciona un marcador en el mapa para ver los detalles del lugar o negocio.
                    </p>
                  </div>
                )}

                {/* Legend */}
                <div className="rounded-2xl glass p-5">
                  <h4 className="font-serif text-sm font-semibold text-foreground mb-3">Leyenda</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Sitio turístico</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-forest" />
                      <span className="text-xs text-muted-foreground">Negocio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-warm" />
                      <span className="text-xs text-muted-foreground">Negocio Premium ⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default MapaPage;
