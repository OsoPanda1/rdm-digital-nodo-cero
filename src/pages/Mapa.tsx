import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Award, Filter, Layers, LocateFixed, MapPin, Navigation, Phone, Radar, Search, Star, Zap, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import GradientSeparator from "@/components/GradientSeparator";
import { PAGE_SEO, SEOMeta } from "@/components/SEOMeta";
import { AuroraBackground } from "@/components/VisualEffects";
import { Link } from "react-router-dom";
import { Map2DPanel } from "@/components/map/Map2DPanel";
import { MapSyncProvider, useMapSync } from "@/hooks/useMapSync";
import type { MapMarkerData, MarkerType } from "@/features/places/mapTypes";
import { useRealtimeGeoAI } from "@/hooks/useRealtimeGeoAI";
import { useRouting } from "@/hooks/useRouting";
import { NavigationPanel } from "@/components/map/NavigationPanel";

import pasteImg from "@/assets/paste.webp";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

const Map3DTwin = lazy(() => import("@/components/map/Map3DTwin").then((module) => ({ default: module.Map3DTwin })));

const markers: MapMarkerData[] = [
  { id: "1", name: "Mina de Acosta", category: "Mina", lat: 20.141, lng: -98.672, description: "Museo y túneles históricos de minería con experiencias guiadas inmersivas.", image: minaImg, type: "place", rating: 4.8, status: "Verificado" },
  { id: "2", name: "Panteón Inglés", category: "Museo", lat: 20.08, lng: -98.7, description: "Patrimonio británico en el bosque con recorridos narrados por audio-guía.", image: panteonImg, type: "place", rating: 4.7, status: "Activo" },
  { id: "3", name: "Peñas Cargadas", category: "Naturaleza", lat: 20.15, lng: -98.66, description: "Formaciones rocosas y senderismo panorámico para ecoturismo de aventura.", image: penasImg, type: "place", rating: 4.9, status: "En alta demanda" },
  { id: "4", name: "Plaza Principal", category: "Cultura", lat: 20.138, lng: -98.6735, description: "Centro social y turístico del pueblo con eventos culturales diarios.", image: callesImg, type: "place", rating: 4.5, status: "Activo" },
  { id: "5", name: "Museo del Paste", category: "Museo", lat: 20.1375, lng: -98.674, description: "Historia del paste y su herencia cornish con talleres gastronómicos.", image: pasteImg, type: "place", rating: 4.6, status: "Verificado" },
  { id: "6", name: "Pastes El Portal", category: "Pastes", lat: 20.1378, lng: -98.6738, description: "Pastes tradicionales en el centro histórico y menú digital actualizado.", image: pasteImg, type: "business", isPremium: true, rating: 4.9, phone: "771 123 4567", status: "En alta demanda" },
  { id: "7", name: "Hotel Real de Minas", category: "Hospedaje", lat: 20.1395, lng: -98.675, description: "Hospedaje boutique en casona colonial con check-in inteligente.", image: callesImg, type: "business", isPremium: true, rating: 4.7, phone: "771 234 5678", status: "Verificado" },
  { id: "8", name: "Café La Neblina", category: "Restaurante", lat: 20.1382, lng: -98.6742, description: "Café de altura con ambiente local y reservación express.", image: panteonImg, type: "business", rating: 4.4, status: "Activo" },
];

function MapaPageContent() {
  const [filter, setFilter] = useState<"all" | MarkerType>("all");
  const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>(markers);
  const [selected, setSelected] = useState<MapMarkerData | null>(markers[0]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [poiStatus, setPoiStatus] = useState<{ loading: boolean; message: string | null }>({ loading: false, message: null });
  const [navigationTarget, setNavigationTarget] = useState<MapMarkerData | null>(null);
  const { viewport, syncFrom2D, syncFrom3D } = useMapSync();

  const handleFilterChange = (nextFilter: MarkerType | "all") => {
    setFilter(nextFilter);
    setSelected((current) => {
      if (!current) return null;
      if (nextFilter === "all") return current;
      return current.type === nextFilter ? current : null;
    });
  };

  const filtered = useMemo(
    () =>
      mapMarkers.filter((item) => {
        const byType = filter === "all" || item.type === filter;
        const byQuery = `${item.name} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase().trim());
        return byType && byQuery;
      }),
    [filter, mapMarkers, query],
  );
  const {
    userPosition,
    trackingEnabled,
    setTrackingEnabled,
    aiFollowEnabled,
    setAiFollowEnabled,
    nearestMarker,
    error: geoError,
    centerOnUser,
  } = useRealtimeGeoAI({ markers: filtered, onViewportChange: syncFrom2D });

  const {
    route,
    loading: routeLoading,
    error: routeError,
    activeStepIndex,
    activeStep,
    advanceStep,
    cancelRoute,
  } = useRouting({
    origin: userPosition ? { lat: userPosition.lat, lng: userPosition.lng } : null,
    destination: navigationTarget ? { lat: navigationTarget.lat, lng: navigationTarget.lng } : null,
    enabled: !!navigationTarget && !!userPosition,
  });

  // Auto-advance routing steps when user moves
  useEffect(() => {
    if (userPosition && route) {
      advanceStep(userPosition.lat, userPosition.lng);
    }
  }, [userPosition, route, advanceStep]);

  useEffect(() => {
    const controller = new AbortController();

    const loadPois = async () => {
      setPoiStatus({ loading: true, message: null });
      try {
        const response = await fetch('/api/v1/pois?zone=real-del-monte&limit=80', { signal: controller.signal });
        if (!response.ok) throw new Error('No se pudieron cargar POIs');
        const payload = await response.json();

        const fromApi: MapMarkerData[] = (payload.features ?? []).map((feature: {
          geometry: { coordinates: [number, number] };
          properties: {
            id: string;
            name: string;
            category: string;
            description: string;
            type: string;
            priority: number;
          };
        }) => ({
          id: feature.properties.id,
          name: feature.properties.name,
          category: feature.properties.category,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          description: feature.properties.description,
          image: callesImg,
          type: feature.properties.type === 'servicio' ? 'business' : 'place',
          isPremium: feature.properties.priority >= 9,
          status: feature.properties.priority >= 9 ? 'En alta demanda' : 'Activo',
          rating: 4.5,
          phone: undefined,
        }));

        if (fromApi.length > 0) {
          setMapMarkers(fromApi);
          setSelected((current) => current ?? fromApi[0]);
        }

        setPoiStatus({ loading: false, message: null });
      } catch {
        setPoiStatus({ loading: false, message: 'Usando datos locales por conectividad limitada.' });
      }
    };

    void loadPois();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'r') {
        syncFrom2D({ lat: 20.138, lng: -98.6737, zoom: 14 });
      }
      if (event.key.toLowerCase() === 'm') {
        centerOnUser();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [centerOnUser, syncFrom2D]);

  const emitMapEvent = async (eventType: 'MAP_POI_SELECTED' | 'MAP_PAGE_VIEW', poi?: MapMarkerData) => {
    try {
      await fetch('/api/v1/pois/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          poiId: poi?.id,
          type: poi?.category,
          userProfile: 'guest',
        }),
      });
    } catch {
      // no-op en modo resiliente
    }
  };

  useEffect(() => {
    void emitMapEvent('MAP_PAGE_VIEW');
  }, []);

  const stats = useMemo(
    () => [
      { label: "Nodos activos", value: filtered.length.toString(), icon: Radar },
      {
        label: "Comercios premium",
        value: filtered.filter((item) => item.isPremium).length.toString(),
        icon: Zap,
      },
      {
        label: "Calificación promedio",
        value: `${(
          filtered.reduce((sum, current) => sum + (current.rating ?? 0), 0) /
          Math.max(filtered.length, 1)
        ).toFixed(1)}`,
        icon: Star,
      },
    ],
    [filtered],
  );

  return (
    <PageTransition>
      <SEOMeta {...PAGE_SEO.mapa} />
      <div className="min-h-screen bg-night-900 text-silver-300 cinematic-gradient">
        <Navbar />

        {/* Immersive Hero */}
        <section className="relative overflow-hidden pt-24 pb-10">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${callesImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/70 to-night-900" />
          <AuroraBackground />
          <div className="dust-particles" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] backdrop-blur-sm">
                  <Compass className="h-3.5 w-3.5 text-gold-400" />
                  <span>Gemelo Digital en Tiempo Real</span>
                </div>
                <h1 className="font-serif text-4xl md:text-6xl leading-tight">
                  <span className="block">Mapa</span>
                  <span
                    className="block animate-gradient-text text-glow-gold"
                    style={{
                      backgroundImage: "linear-gradient(135deg, hsl(43,80%,55%) 0%, hsl(35,70%,65%) 25%, hsl(43,80%,55%) 50%, hsl(25,60%,50%) 75%, hsl(43,80%,55%) 100%)",
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Inteligente
                  </span>
                </h1>
                <p className="max-w-2xl text-base text-silver-400 md:text-lg leading-relaxed">
                  Infraestructura cartografica con clustering dinamico, sincronizacion 2D/3D y visual neblinoso cinematografico.
                </p>
              </div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-xs">
                <button
                  onClick={() => setMode("2d")}
                  className={`rounded-full px-4 py-2 transition ${mode === "2d" ? "bg-gold-500 text-night-900" : "text-silver-300 hover:bg-white/10"}`}
                >
                  Vista 2D
                </button>
                <button
                  onClick={() => setMode("3d")}
                  className={`rounded-full px-4 py-2 transition ${mode === "3d" ? "bg-gold-500 text-night-900" : "text-silver-300 hover:bg-white/10"}`}
                >
                  Gemelo 3D
                </button>
              </div>
              <button
                onClick={() => setLowBandwidthMode((current) => !current)}
                className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-wide text-silver-300 hover:bg-white/10"
              >
                {lowBandwidthMode ? 'Modo Ligero ON' : 'Modo Ligero OFF'}
              </button>
            </motion.div>
          </div>
        </section>

        <GradientSeparator animated />

        <main className="mx-auto max-w-7xl space-y-5 px-4 pb-12 md:px-6">

          <section className="grid gap-4 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="glass-dark rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/5 p-2">
                    <item.icon className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-silver-500">{item.label}</p>
                    <p className="text-xl font-semibold text-silver-200">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="glass-dark rounded-2xl border border-white/10 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-night-800/80 px-3 py-2">
                    <Search className="h-4 w-4 text-silver-500" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar lugares, comercios o experiencias..."
                      className="w-full bg-transparent text-sm text-silver-200 outline-none placeholder:text-silver-500"
                    />
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-silver-300"
                    onClick={() => handleFilterChange("place")}
                  >
                    <Filter className="h-4 w-4" /> Lugares
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-silver-300"
                    onClick={() => handleFilterChange("business")}
                  >
                    <Layers className="h-4 w-4" /> Negocios
                  </button>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setTrackingEnabled((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 px-3 py-2 text-xs text-gold-300"
                  >
                    <LocateFixed className="h-4 w-4" />
                    {trackingEnabled ? "Detener geolocalización AI" : "Activar geolocalización AI"}
                  </button>
                  {userPosition && (
                    <button
                      onClick={centerOnUser}
                      className="ml-2 inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-300"
                    >
                      Centrar en mi posición
                    </button>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {["all", "place", "business"].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleFilterChange(item as "all" | MarkerType)}
                      className={`rounded-full border px-3 py-1.5 ${
                        filter === item
                          ? "border-gold-500/60 bg-gold-500/20 text-gold-300"
                          : "border-white/10 bg-white/5 text-silver-400 hover:border-white/20"
                      }`}
                    >
                      {item === "all" ? "Todo" : item === "place" ? "Lugares" : "Negocios"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                {mode === "2d" || lowBandwidthMode ? (
                  <Map2DPanel
                    markers={filtered}
                    userPosition={userPosition}
                    selected={selected}
                    viewport={viewport}
                    onSelect={(marker) => { setSelected(marker); void emitMapEvent('MAP_POI_SELECTED', marker); }}
                    onViewportChange={syncFrom2D}
                    route={route}
                    activeStepIndex={activeStepIndex}
                  />
                ) : (
                  <Suspense
                    fallback={
                      <div className="flex h-[420px] items-center justify-center bg-night-900/70 text-sm text-silver-400 md:h-[640px]">
                        Cargando Gemelo Digital 3D...
                      </div>
                    }
                  >
                    <Map3DTwin
                      viewport={viewport}
                      markers={filtered}
                      userPosition={userPosition}
                      aiPilotEnabled={aiFollowEnabled}
                      onViewportChange={syncFrom3D}
                    />
                  </Suspense>
                )}
              </div>
            </div>

            <aside className="space-y-4 lg:col-span-4">
              <div className="glass-dark rounded-2xl border border-white/10 p-4">
                {selected ? (
                  <>
                    <img src={selected.image} alt={selected.name} className="mb-3 h-40 w-full rounded-xl object-cover" />
                    <h2 className="text-xl font-semibold text-silver-200">{selected.name}</h2>
                    <p className="mt-2 text-sm text-silver-400">{selected.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-silver-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">
                        <MapPin className="h-3.5 w-3.5" /> {selected.category}
                      </span>
                      {selected.rating && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/10 px-2 py-1 text-gold-300">
                          <Star className="h-3.5 w-3.5" /> {selected.rating}
                        </span>
                      )}
                      {selected.isPremium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-electric-500/10 px-2 py-1 text-gold-300">
                          <Award className="h-3.5 w-3.5" /> Premium
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">
                        <Layers className="h-3.5 w-3.5" /> {selected.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      {selected.phone && (
                        <a
                          href={`tel:${selected.phone}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-3 py-2 text-sm font-medium text-night-900"
                        >
                          <Phone className="h-4 w-4" /> Llamar
                        </a>
                      )}
                      {userPosition && trackingEnabled && (
                        <button
                          onClick={() => {
                            setNavigationTarget(selected);
                            setMode("2d");
                          }}
                          disabled={routeLoading}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/30 transition disabled:opacity-50"
                        >
                          <Navigation className="h-4 w-4" />
                          {routeLoading ? "Calculando ruta..." : "Cómo llegar caminando"}
                        </button>
                      )}
                      <button
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-silver-200 hover:bg-white/10"
                        onClick={() => setSelected(mapMarkers[0] ?? null)}
                      >
                        <LocateFixed className="h-4 w-4" /> Volver al nodo principal
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-silver-500">Selecciona un punto del mapa para ver detalles.</p>
                )}
              </div>

              {/* Turn-by-turn Navigation Panel */}
              <AnimatePresence>
                {route && activeStep && (
                  <NavigationPanel
                    route={route}
                    activeStepIndex={activeStepIndex}
                    activeStep={activeStep}
                    loading={routeLoading}
                    onCancel={() => { cancelRoute(); setNavigationTarget(null); }}
                  />
                )}
                {routeError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-dark rounded-2xl border border-red-500/30 p-4 text-xs text-red-300"
                  >
                    {routeError}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="glass-dark rounded-2xl border border-gold-500/30 p-4">
                <h3 className="font-semibold text-gold-300">Exploración rápida</h3>
                <p className="mt-1 text-xs text-silver-500">Atajos: R = centrar Real del Monte · M = mi ubicación.</p>
                <ul className="mt-3 space-y-2 text-sm text-silver-400">
                  {filtered.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => { setSelected(item); void emitMapEvent('MAP_POI_SELECTED', item); }}
                        className="flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-left transition hover:border-gold-500/40 hover:bg-white/5"
                      >
                        <span>{item.name}</span>
                        <span className="text-xs text-gold-300">Ver</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4">
                <h3 className="font-semibold text-gold-300">Capa Realito AI en producción</h3>
                <div className="mt-2 space-y-2 text-sm text-silver-300">
                  <p>
                    Estado geolocalización:{" "}
                    <span className={trackingEnabled ? "text-emerald-300" : "text-silver-500"}>
                      {trackingEnabled ? "Activa en tiempo real" : "Inactiva"}
                    </span>
                  </p>
                  <p>
                    Piloto automático IA:{" "}
                    <button
                      onClick={() => setAiFollowEnabled((current) => !current)}
                      className={`rounded px-2 py-1 text-xs ${
                        aiFollowEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-silver-300"
                      }`}
                    >
                      {aiFollowEnabled ? "Encendido" : "Apagado"}
                    </button>
                  </p>
                  {userPosition && (
                    <p className="text-xs text-cyan-300">
                      Posición: {userPosition.lat.toFixed(5)}, {userPosition.lng.toFixed(5)} · precisión ±
                      {Math.round(userPosition.accuracy)}m
                    </p>
                  )}
                  {nearestMarker && (
                    <p className="text-xs text-gold-200">
                      Nodo sugerido por IA: <strong>{nearestMarker.marker.name}</strong> a{" "}
                      {(nearestMarker.distanceKm * 1000).toFixed(0)}m.
                    </p>
                  )}
                  {geoError && <p className="text-xs text-red-300">{geoError}</p>}
                  {poiStatus.loading && <p className="text-xs text-sky-300">Sincronizando POIs desde backend...</p>}
                  {poiStatus.message && <p className="text-xs text-amber-300">{poiStatus.message}</p>}
                </div>
                <Link to="/negocios" className="mt-3 inline-block rounded-lg bg-gold-500 px-3 py-2 text-sm font-semibold text-night-900">
                  Ir al portal de comercios
                </Link>
              </div>
            </aside>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}


export default function MapaPage() {
  return (
    <MapSyncProvider>
      <MapaPageContent />
    </MapSyncProvider>
  );
}
