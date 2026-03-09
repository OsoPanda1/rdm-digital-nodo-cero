import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Award, Phone, X, Filter, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";

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

// Futuristic glowing icon factory
const createIcon = (type: "place" | "business", isPremium?: boolean) => {
  const color = isPremium ? "#fbbf24" : type === "place" ? "#60a5fa" : "#34d399";
  const glow = isPremium ? "0 0 20px #fbbf24, 0 0 40px #fbbf24" : `0 0 15px ${color}`;
  const size = isPremium ? 42 : 32;
  return L.divIcon({
    className: "custom-marker-futuristic",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: rgba(15, 23, 42, 0.8);
      border-radius: 50%;
      border: 2px solid ${color};
      box-shadow: ${glow};
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
    ">
      <div style="
        width: ${size * 0.4}px; height: ${size * 0.4}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 10px ${color};
      "></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Component to handle drone flight animation
function MapController({ selected, markers }: { selected: MapMarkerData | null, markers: MapMarkerData[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selected) {
      // Fly to selected marker (Drone effect)
      map.flyTo([selected.lat, selected.lng], 17, {
        duration: 2,
        easeLinearity: 0.25
      });
    } else if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.flyToBounds(bounds, { padding: [40, 40], duration: 1.5 });
    }
  }, [selected, markers, map]);
  
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
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <SEOMeta {...PAGE_SEO.mapa} />
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
                <Navigation className="w-3 h-3" />
                Sistema de Navegación 3.0
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Mapa Interactivo
              </h1>
              <p className="text-slate-400 max-w-lg">
                Explora Real del Monte a través de nuestra interfaz holográfica. Selecciona puntos para iniciar el vuelo táctico.
              </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { key: "all", label: "Señal Global", count: markers.length },
                { key: "place", label: "Puntos Históricos", count: markers.filter(m => m.type === "place").length },
                { key: "business", label: "Sector Comercial", count: markers.filter(m => m.type === "business").length },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setFilter(f.key as typeof filter);
                    setSelected(null);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-mono tracking-wide transition-all duration-300 flex items-center gap-2 border ${
                    filter === f.key
                      ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700"
                  }`}
                >
                  {f.label}
                  <span className="text-xs opacity-50">[{f.count}]</span>
                </button>
              ))}
            </div>

            {/* Map + HUD Sidebar */}
            <div className="grid lg:grid-cols-12 gap-6 h-[70vh] min-h-[600px]">
              {/* HUD Map Container */}
              <div className="lg:col-span-8 lg:col-start-1 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                {/* HUD Elements */}
                <div className="absolute inset-0 pointer-events-none z-[400] rounded-2xl border-[1px] border-blue-500/20" />
                <div className="absolute top-4 left-4 pointer-events-none z-[400]">
                  <div className="w-16 h-16 border-t-2 border-l-2 border-blue-500/40 rounded-tl-xl" />
                </div>
                <div className="absolute bottom-4 right-4 pointer-events-none z-[400]">
                  <div className="w-16 h-16 border-b-2 border-r-2 border-blue-500/40 rounded-br-xl" />
                </div>
                <div className="absolute top-4 right-4 pointer-events-none z-[400] text-blue-500/40 font-mono text-[10px] text-right">
                  <p>LAT: 20.1395° N</p>
                  <p>LNG: 98.6735° W</p>
                  <p>ALT: 2,660m</p>
                </div>
                <div className="absolute inset-0 pointer-events-none z-[400] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]" />

                <MapContainer
                  center={[20.1395, -98.6735]}
                  zoom={15}
                  scrollWheelZoom={true}
                  style={{ width: "100%", height: "100%", background: "#020617" }}
                  zoomControl={false}
                >
                  {/* Dark matter tileset for futuristic look */}
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <MapController selected={selected} markers={filtered} />
                  
                  {filtered.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={[marker.lat, marker.lng]}
                      icon={createIcon(marker.type, marker.isPremium)}
                      eventHandlers={{
                        click: () => setSelected(marker),
                      }}
                    >
                      {/* Hidden popup as we use sidebar */}
                      <Popup className="hidden-popup">
                        <span className="hidden"></span>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* HUD Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="rounded-2xl overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex-shrink-0"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10" />
                        <img src={selected.image} alt={selected.name} className="w-full h-full object-cover filter contrast-125 saturate-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent z-10" />
                        
                        {/* Scanline effect on image */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(59,130,246,0.1)_2px,rgba(59,130,246,0.1)_4px)] z-20 pointer-events-none" />

                        {selected.isPremium && (
                          <div className="absolute top-3 right-3 z-30 px-3 py-1 rounded border border-amber-500/50 bg-amber-500/20 text-amber-300 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                            <Award className="w-3 h-3" /> Verificado
                          </div>
                        )}
                        <div className="absolute top-3 left-3 z-30 px-3 py-1 rounded border border-blue-500/50 bg-blue-500/20 text-blue-300 text-[10px] font-mono uppercase tracking-widest backdrop-blur-md">
                          {selected.category}
                        </div>
                        <button
                          onClick={() => setSelected(null)}
                          className="absolute top-3 right-3 z-30 w-8 h-8 rounded border border-slate-500/50 bg-slate-900/50 flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-md"
                          style={selected.isPremium ? { right: 120 } : {}}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-6 relative z-30">
                        <h3 className="font-serif text-2xl font-bold text-white mb-2 tracking-tight">{selected.name}</h3>
                        {selected.rating && (
                          <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-mono text-amber-400">{selected.rating}</span>
                            <span className="text-xs text-slate-500 font-mono">/ 5.0</span>
                          </div>
                        )}
                        <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
                          {selected.description}
                        </p>
                        {selected.phone && (
                          <a href={`tel:${selected.phone}`} className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500/50 hover:text-blue-300 transition-all font-mono text-sm tracking-wide">
                            <Phone className="w-4 h-4" /> 
                            <span>{selected.phone}</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md p-8 text-center flex flex-col items-center justify-center h-full min-h-[250px]"
                    >
                      <div className="w-16 h-16 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center mb-4 relative">
                        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping" />
                        <MapPin className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-mono text-white mb-2 uppercase tracking-widest">Radar Activo</h3>
                      <p className="text-sm text-slate-400 font-light">
                        Selecciona un objetivo en el mapa para establecer conexión y ver detalles.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Data List */}
                <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden flex flex-col min-h-[200px]">
                  <div className="p-4 border-b border-slate-800 bg-slate-900">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 flex items-center">
                      <Filter className="w-3 h-3 inline mr-2" />
                      Directorio de Puntos ({filtered.length})
                    </h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {filtered.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelected(m)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group ${
                          selected?.id === m.id
                            ? "bg-blue-600/20 border border-blue-500/30 text-blue-300"
                            : "hover:bg-slate-800/80 text-slate-300 border border-transparent"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${m.isPremium ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'} group-hover:scale-150 transition-transform`} />
                        <span className="truncate font-medium">{m.name}</span>
                        {m.rating && (
                          <span className="ml-auto text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500/50" />
                            {m.rating}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hidden-popup .leaflet-popup-content-wrapper, 
        .hidden-popup .leaflet-popup-tip {
          display: none !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}} />
    </PageTransition>
  );
};

export default MapaPage;
