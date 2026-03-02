import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Award, Navigation, ZoomIn, ZoomOut, Phone, Maximize2, Minimize2, LocateFixed, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

import pasteImg from "@/assets/paste.webp";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";
import mapaImg from "@/assets/Mapardm.png";

interface MapMarker {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  description: string;
  image: string;
  type: "place" | "business";
  isPremium?: boolean;
  rating?: number;
  phone?: string;
}

const markers: MapMarker[] = [
  { id: "1", name: "Mina de Acosta", category: "Mina", x: 35, y: 45, description: "Desciende 450 metros bajo tierra en esta mina del siglo XVIII. Recorre los túneles donde mineros ingleses y mexicanos forjaron la historia de la plata.", image: minaImg, type: "place", rating: 4.8 },
  { id: "2", name: "Panteón Inglés", category: "Museo", x: 28, y: 38, description: "Cementerio único con cruces celtas entre pinos y neblina. Testimonio viviente de la comunidad inglesa que llegó en el siglo XIX.", image: panteonImg, type: "place", rating: 4.7 },
  { id: "3", name: "Peñas Cargadas", category: "Naturaleza", x: 72, y: 25, description: "Formaciones rocosas gigantes en equilibrio imposible. Senderismo entre bosque de niebla con vistas panorámicas del valle de Real del Monte.", image: penasImg, type: "place", rating: 4.9 },
  { id: "4", name: "Plaza Principal", category: "Cultura", x: 48, y: 52, description: "El corazón del pueblo mágico. Kiosco histórico, jardín colonial y punto de encuentro de locales y visitantes.", image: callesImg, type: "place", rating: 4.5 },
  { id: "5", name: "Museo del Paste", category: "Museo", x: 45, y: 48, description: "Descubre la historia del paste, la tradición gastronómica que une a México con Cornualles, Inglaterra.", image: pasteImg, type: "place", rating: 4.6 },
  { id: "6", name: "Parroquia de Nuestra Señora de la Asunción", category: "Iglesia", x: 50, y: 55, description: "Templo del siglo XVIII con arquitectura colonial e importancia histórica para la comunidad minera.", image: callesImg, type: "place", rating: 4.7 },
  { id: "7", name: "Pastes El Portal", category: "Pastes", x: 46, y: 50, description: "Los pastes más tradicionales de Real del Monte desde 1985. Receta auténtica de la comunidad cornish-mexicana.", image: pasteImg, type: "business", isPremium: true, rating: 4.9, phone: "771 123 4567" },
  { id: "8", name: "Hotel Real de Minas", category: "Hospedaje", x: 42, y: 46, description: "Hotel boutique en casona colonial restaurada con vista panorámica a la montaña y ambiente histórico.", image: callesImg, type: "business", isPremium: true, rating: 4.7, phone: "771 234 5678" },
  { id: "9", name: "Artesanías del Monte", category: "Souvenir", x: 52, y: 54, description: "Artesanías locales hechas a mano por artesanos de Real del Monte. Minerales, textiles y productos típicos.", image: callesImg, type: "business", isPremium: true, rating: 4.6, phone: "771 345 6789" },
  { id: "10", name: "Café La Neblina", category: "Restaurante", x: 49, y: 51, description: "Café artesanal de altura cultivado en la región, con los mejores postres y vista al bosque de oyamel.", image: panteonImg, type: "business", isPremium: false, rating: 4.4 },
  { id: "11", name: "Tours Mineros RDM", category: "Tours", x: 36, y: 44, description: "Recorridos guiados por las minas históricas con expertos en historia local e ingeniería minera.", image: minaImg, type: "business", isPremium: true, rating: 4.8, phone: "771 456 7890" },
  { id: "12", name: "Casa de la Cultura", category: "Cultura", x: 47, y: 53, description: "Espacio cultural con exposiciones, talleres y eventos que preservan las tradiciones mineras y cornish.", image: callesImg, type: "place", rating: 4.5 },
];

const MapaPage = () => {
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [filter, setFilter] = useState<"all" | "place" | "business">("all");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const filtered = markers.filter((m) =>
    filter === "all" ? true : m.type === filter
  );

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.25, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === mapRef.current || (e.target as HTMLElement).closest('.map-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    handleReset();
  };

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
                Explora los sitios turísticos y negocios premium del Pueblo Mágico. Navega el mapa interactivo para descubrir cada rincón.
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

            {/* Map container */}
            <div className={`grid ${isFullscreen ? '' : 'lg:grid-cols-3'} gap-6`}>
              {/* Map */}
              <div className={`${isFullscreen ? 'col-span-full fixed inset-0 z-50 bg-background' : 'lg:col-span-2'} relative rounded-2xl overflow-hidden shadow-elevated border border-border`} 
                style={{ minHeight: isFullscreen ? '100vh' : 600 }}
                ref={mapContainerRef}
              >
                {/* Map Controls */}
                <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-background/90 transition-colors shadow-card"
                    title="Acercar"
                  >
                    <ZoomIn className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-background/90 transition-colors shadow-card"
                    title="Alejar"
                  >
                    <ZoomOut className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-background/90 transition-colors shadow-card"
                    title="Centrar mapa"
                  >
                    <LocateFixed className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Fullscreen toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-16 z-30 w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-background/90 transition-colors shadow-card"
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5 text-foreground" /> : <Maximize2 className="w-5 h-5 text-foreground" />}
                </button>

                {/* Close fullscreen */}
                {isFullscreen && (
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-card"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Compass */}
                <div className="absolute bottom-4 right-4 z-30 w-14 h-14 rounded-full glass flex items-center justify-center shadow-card">
                  <div className="relative">
                    <Navigation className="w-6 h-6 text-terracotta" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-foreground">N</span>
                  </div>
                </div>

                {/* Zoom level indicator */}
                <div className="absolute bottom-4 left-4 z-30 px-3 py-1.5 rounded-lg glass text-xs font-medium text-muted-foreground">
                  Zoom: {Math.round(zoom * 100)}%
                </div>

                {/* Map Title */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl glass">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                    Real del Monte · Pueblo Mágico · Hidalgo, México
                  </span>
                </div>

                {/* Draggable Map Area */}
                <div
                  ref={mapRef}
                  className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing map-background"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: zoom,
                      x: pan.x,
                      y: pan.y,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Map Image */}
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                      <img
                        src={mapaImg}
                        alt="Mapa de Real del Monte"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        draggable={false}
                        style={{ 
                          filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.15))',
                        }}
                      />
                      
                      {/* Interactive Markers Layer */}
                      <div className="absolute inset-0 pointer-events-none">
                        {filtered.map((marker) => {
                          const isSelected = selected?.id === marker.id;
                          return (
                            <motion.button
                              key={marker.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(isSelected ? null : marker);
                              }}
                              className="absolute pointer-events-auto group"
                              style={{ 
                                left: `${marker.x}%`, 
                                top: `${marker.y}%`, 
                                transform: "translate(-50%, -50%)" 
                              }}
                            >
                              {/* Pulse animation for selected */}
                              {isSelected && (
                                <motion.div
                                  className={`absolute inset-0 rounded-full ${marker.isPremium ? 'bg-gold' : 'bg-primary'}`}
                                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                              )}
                              
                              {/* Glow ring */}
                              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                isSelected ? "scale-[2.5] opacity-100" : "scale-[1.8] opacity-0 group-hover:opacity-60"
                              } ${
                                marker.isPremium ? "bg-gold/20" : marker.type === "place" ? "bg-primary/15" : "bg-forest/15"
                              }`} />

                              {/* Pin */}
                              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
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
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                                isSelected ? "opacity-100 glass shadow-card translate-y-0" : "opacity-0 group-hover:opacity-100 glass translate-y-1"
                              } text-foreground`}>
                                {marker.name}
                                {marker.rating && (
                                  <span className="ml-1.5 text-gold">★ {marker.rating}</span>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Sidebar / detail */}
              {!isFullscreen && (
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
                          <div className="absolute inset-0 bg-gradient-card" />
                          {selected.isPremium && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gold/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                              <Award className="w-3 h-3" /> Premium
                            </div>
                          )}
                          <div className="absolute top-3 left-3 px-2 py-1 rounded-full glass text-[10px] font-medium text-foreground">
                            {selected.category}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif text-xl font-bold text-foreground">{selected.name}</h3>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selected.description}</p>
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                            {selected.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-gold fill-gold" />
                                <span className="text-sm font-medium text-foreground">{selected.rating}</span>
                                <span className="text-xs text-muted-foreground">/ 5</span>
                              </div>
                            )}
                            {selected.phone && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                                <span className="text-xs">{selected.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button 
                              onClick={() => setSelected(null)}
                              className="flex-1 px-4 py-2 rounded-xl text-sm font-medium bg-muted hover:bg-muted/80 transition-colors text-foreground"
                            >
                              Cerrar
                            </button>
                            <button className="flex-1 px-4 py-2 rounded-xl text-sm font-medium btn-premium">
                              Ver más
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl glass p-8 text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Explora el mapa</h3>
                        <p className="text-sm text-muted-foreground">
                          Selecciona un marcador en el mapa para ver los detalles del lugar o negocio. Arrastra para navegar y usa los controles para hacer zoom.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick Stats */}
                  <div className="rounded-2xl glass p-5">
                    <h4 className="font-serif text-sm font-semibold text-foreground mb-4">Estadísticas del Mapa</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-xl bg-primary/5">
                        <div className="text-2xl font-bold text-primary">{markers.filter(m => m.type === "place").length}</div>
                        <div className="text-xs text-muted-foreground">Sitios turísticos</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-forest/5">
                        <div className="text-2xl font-bold text-forest">{markers.filter(m => m.type === "business").length}</div>
                        <div className="text-xs text-muted-foreground">Negocios</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gold/10 col-span-2">
                        <div className="text-2xl font-bold text-gold">{markers.filter(m => m.isPremium).length}</div>
                        <div className="text-xs text-muted-foreground">Negocios Premium</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="rounded-2xl glass p-5">
                    <h4 className="font-serif text-sm font-semibold text-foreground mb-3">Leyenda</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">Sitio turístico</span>
                          <p className="text-xs text-muted-foreground">Atractivos culturales y naturales</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">Negocio</span>
                          <p className="text-xs text-muted-foreground">Comercios y servicios locales</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center">
                          <Award className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">Negocio Premium</span>
                          <p className="text-xs text-muted-foreground">Recomendados por la comunidad</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories list */}
                  <div className="rounded-2xl glass p-5">
                    <h4 className="font-serif text-sm font-semibold text-foreground mb-3">Categorías</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(markers.map(m => m.category))).sort().map(cat => (
                        <span key={cat} className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default MapaPage;
