import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  Award,
  Compass,
  Filter,
  Layers,
  LocateFixed,
  MapPin,
  Phone,
  Radar,
  Search,
  Star,
  Zap,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { PAGE_SEO, SEOMeta } from "@/components/SEOMeta";
import { Link } from "react-router-dom";

import pasteImg from "@/assets/paste.webp";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

type MarkerType = "place" | "business";

interface MapMarkerData {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  type: MarkerType;
  isPremium?: boolean;
  rating?: number;
  phone?: string;
  status: "Activo" | "En alta demanda" | "Verificado";
}

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

const createIcon = (type: MarkerType, isPremium?: boolean) => {
  const color = isPremium ? "#f59e0b" : type === "place" ? "#60a5fa" : "#34d399";
  return L.divIcon({
    className: "custom-map-pin",
    html: `<span style="display:flex;width:${isPremium ? 32 : 24}px;height:${isPremium ? 32 : 24}px;border-radius:999px;background:${color};box-shadow:0 0 0 4px rgba(15,23,42,.75),0 0 14px ${color};border:1px solid rgba(255,255,255,.7);"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function MapFocus({ selected }: { selected: MapMarkerData | null }) {
  const map = useMap();

  if (selected) {
    map.flyTo([selected.lat, selected.lng], 15, { duration: 0.8 });
  }

  return null;
}

export default function MapaPage() {
  const [filter, setFilter] = useState<"all" | MarkerType>("all");
  const [selected, setSelected] = useState<MapMarkerData | null>(markers[0]);
  const [query, setQuery] = useState("");

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
      markers.filter((item) => {
        const byType = filter === "all" || item.type === filter;
        const byQuery = `${item.name} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase().trim());
        return byType && byQuery;
      }),
    [filter, query],
  );

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

        <main className="mx-auto max-w-7xl space-y-5 px-4 pb-12 pt-24 md:px-6">
          <header className="glass-dark neon-glow relative overflow-hidden rounded-3xl p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,163,86,.25),transparent_45%)]" />
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-gold-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold-300">
                  <Compass className="h-3.5 w-3.5" /> Gemelo Digital en Tiempo Real
                </p>
                <h1 className="font-serif text-3xl text-gold-400 md:text-4xl">Mapa inteligente de Real del Monte</h1>
                <p className="mt-2 max-w-2xl text-sm text-silver-400">
                  Explora lugares, negocios y experiencias con búsqueda dinámica, filtros avanzados y una vista
                  inmersiva diseñada para convertir cada visita en una ruta inolvidable.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 p-1 text-xs">
                <button className="rounded-full px-4 py-2 text-silver-300 transition hover:bg-white/10">2D</button>
                <button className="rounded-full bg-gold-500 px-4 py-2 font-semibold text-night-900">3D Mesh</button>
              </div>
            </div>
          </header>

          <section className="grid gap-3 md:grid-cols-3">
            {stats.map((item) => (
              <article key={item.label} className="glass-dark rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-gold-500/20 p-2 text-gold-300">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase text-silver-500">{item.label}</p>
                    <p className="text-xl font-semibold text-silver-200">{item.value}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="glass-dark flex flex-col gap-3 rounded-2xl border border-white/10 p-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por nombre, categoría o experiencia"
                    className="w-full rounded-xl border border-white/10 bg-night-700/80 py-2 pl-9 pr-3 text-sm text-silver-200 outline-none ring-gold-500/30 placeholder:text-silver-500 focus:ring"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "Todo" },
                    { key: "place", label: "Lugares" },
                    { key: "business", label: "Comercios" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleFilterChange(item.key as "all" | MarkerType)}
                      className={`rounded-full border px-3 py-2 text-xs ${
                        filter === item.key
                          ? "border-gold-500 bg-gold-500/20 text-gold-300"
                          : "border-white/10 bg-white/5 text-silver-400 hover:bg-white/10"
                      }`}
                    >
                      <Filter className="mr-1 inline h-3.5 w-3.5" /> {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <MapContainer center={[20.1374, -98.6732]} zoom={14} className="h-[420px] w-full md:h-[640px]" zoomControl>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapFocus selected={selected} />
                  {filtered.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={[marker.lat, marker.lng]}
                      icon={createIcon(marker.type, marker.isPremium)}
                      eventHandlers={{ click: () => setSelected(marker) }}
                    >
                      <Popup>
                        <strong>{marker.name}</strong>
                        <p>{marker.description}</p>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
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
                      <button
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-silver-200 hover:bg-white/10"
                        onClick={() => setSelected(markers[0])}
                      >
                        <LocateFixed className="h-4 w-4" /> Volver al nodo principal
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-silver-500">Selecciona un punto del mapa para ver detalles.</p>
                )}
              </div>

              <div className="glass-dark rounded-2xl border border-gold-500/30 p-4">
                <h3 className="font-semibold text-gold-300">Exploración rápida</h3>
                <ul className="mt-3 space-y-2 text-sm text-silver-400">
                  {filtered.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setSelected(item)}
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
                <h3 className="font-semibold text-gold-300">¿Tienes negocio?</h3>
                <p className="mt-2 text-sm text-silver-400">
                  Regístralo en el catálogo, activa tu plan mensual y destaca en el mapa con visibilidad premium.
                </p>
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
