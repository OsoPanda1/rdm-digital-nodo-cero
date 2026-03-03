import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Award, Phone, X, Filter } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

import pasteImg from "@/assets/paste.webp";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

interface MapMarkerData {
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

const markers: MapMarkerData[] = [
  { id: "1", name: "Mina de Acosta", category: "Mina", lat: 20.1410, lng: -98.6720, description: "Desciende 450 metros bajo tierra en esta mina del siglo XVIII.", image: minaImg, type: "place", rating: 4.8 },
  { id: "2", name: "Panteón Inglés", category: "Museo", lat: 20.1445, lng: -98.6780, description: "Cementerio único con cruces celtas entre pinos y neblina.", image: panteonImg, type: "place", rating: 4.7 },
  { id: "3", name: "Peñas Cargadas", category: "Naturaleza", lat: 20.1500, lng: -98.6600, description: "Formaciones rocosas gigantes en equilibrio imposible.", image: penasImg, type: "place", rating: 4.9 },
  { id: "4", name: "Plaza Principal", category: "Cultura", lat: 20.1380, lng: -98.6735, description: "El corazón del pueblo mágico.", image: callesImg, type: "place", rating: 4.5 },
  { id: "5", name: "Museo del Paste", category: "Museo", lat: 20.1375, lng: -98.6740, description: "Descubre la historia del paste.", image: pasteImg, type: "place", rating: 4.6 },
  { id: "6", name: "Parroquia de la Asunción", category: "Iglesia", lat: 20.1370, lng: -98.6730, description: "Templo del siglo XVIII con arquitectura colonial.", image: callesImg, type: "place", rating: 4.7 },
  { id: "7", name: "Pastes El Portal", category: "Pastes", lat: 20.1378, lng: -98.6738, description: "Los pastes más tradicionales desde 1985.", image: pasteImg, type: "business", isPremium: true, rating: 4.9, phone: "771 123 4567" },
  { id: "8", name: "Hotel Real de Minas", category: "Hospedaje", lat: 20.1395, lng: -98.6750, description: "Hotel boutique en casona colonial restaurada.", image: callesImg, type: "business", isPremium: true, rating: 4.7, phone: "771 234 5678" },
  { id: "9", name: "Artesanías del Monte", category: "Souvenir", lat: 20.1365, lng: -98.6725, description: "Artesanías locales hechas a mano.", image: callesImg, type: "business", isPremium: true, rating: 4.6, phone: "771 345 6789" },
  { id: "10", name: "Café La Neblina", category: "Restaurante", lat: 20.1382, lng: -98.6742, description: "Café artesanal de altura con vista al bosque.", image: panteonImg, type: "business", isPremium: false, rating: 4.4 },
  { id: "11", name: "Tours Mineros RDM", category: "Tours", lat: 20.1415, lng: -98.6715, description: "Recorridos guiados por las minas históricas.", image: minaImg, type: "business", isPremium: true, rating: 4.8, phone: "771 456 7890" },
  { id: "12", name: "Casa de la Cultura", category: "Cultura", lat: 20.1372, lng: -98.6732, description: "Espacio cultural con exposiciones y talleres.", image: callesImg, type: "place", rating: 4.5 },
];

// Custom icon factory
const createIcon = (type: "place" | "business", isPremium?: boolean) => {
  const color = isPremium ? "#C4882F" : type === "place" ? "#B85C3C" : "#4A7C59";
  const size = isPremium ? 36 : 30;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <svg style="transform:rotate(45deg); width:${size * 0.45}px; height:${size * 0.45}px;" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${isPremium
          ? '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>'
          : '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'}
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Component to fit map bounds
function FitBounds({ markers }: { markers: MapMarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

const MapaPage = () => {
  const [selected, setSelected] = useState<MapMarkerData | null>(null);
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
                Explora los sitios turísticos y negocios del Pueblo Mágico sobre el mapa real.
              </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: "all", label: "Todo", count: markers.length },
                { key: "place", label: "Sitios turísticos", count: markers.filter(m => m.type === "place").length },
                { key: "business", label: "Negocios", count: markers.filter(m => m.type === "business").length },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as typeof filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filter === f.key
                      ? "btn-premium"
                      : "btn-glass hover:bg-foreground/5"
                  }`}
                >
                  {f.label}
                  <span className="text-xs opacity-70">({f.count})</span>
                </button>
              ))}
            </div>

            {/* Map + Sidebar */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Leaflet Map */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-elevated border border-border" style={{ minHeight: 550 }}>
                <MapContainer
                  center={[20.1395, -98.6735]}
                  zoom={15}
                  scrollWheelZoom={true}
                  style={{ width: "100%", height: "100%", minHeight: 550 }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <FitBounds markers={filtered} />
                  {filtered.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={[marker.lat, marker.lng]}
                      icon={createIcon(marker.type, marker.isPremium)}
                      eventHandlers={{
                        click: () => setSelected(marker),
                      }}
                    >
                      <Popup>
                        <div className="text-center min-w-[160px]">
                          <strong className="block text-sm">{marker.name}</strong>
                          <span className="text-xs text-gray-500">{marker.category}</span>
                          {marker.rating && (
                            <span className="block text-xs text-amber-600 mt-1">★ {marker.rating}</span>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="rounded-2xl overflow-hidden glass shadow-elevated"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {selected.isPremium && (
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gold/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                            <Award className="w-3 h-3" /> Premium
                          </div>
                        )}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full glass text-[10px] font-medium text-foreground">
                          {selected.category}
                        </div>
                        <button
                          onClick={() => setSelected(null)}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                          style={selected.isPremium ? { right: 90 } : {}}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-xl font-bold text-foreground mb-1">{selected.name}</h3>
                        {selected.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 fill-gold text-gold" />
                            <span className="text-sm font-medium text-foreground">{selected.rating}</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {selected.description}
                        </p>
                        {selected.phone && (
                          <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Phone className="w-4 h-4" /> {selected.phone}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl glass shadow-card p-6 text-center"
                    >
                      <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Selecciona un marcador en el mapa para ver los detalles del lugar o negocio.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick list */}
                <div className="rounded-2xl glass shadow-card p-4 max-h-[320px] overflow-y-auto space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    <Filter className="w-3 h-3 inline mr-1" />
                    {filter === "all" ? "Todos" : filter === "place" ? "Sitios turísticos" : "Negocios"} ({filtered.length})
                  </h4>
                  {filtered.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-150 flex items-center gap-2 ${
                        selected?.id === m.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-foreground/5 text-foreground"
                      }`}
                    >
                      {m.isPremium ? (
                        <Award className="w-4 h-4 text-gold flex-shrink-0" />
                      ) : (
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="truncate">{m.name}</span>
                      {m.rating && (
                        <span className="ml-auto text-xs text-gold flex-shrink-0">★ {m.rating}</span>
                      )}
                    </button>
                  ))}
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
