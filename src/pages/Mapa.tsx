import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Award, Filter, MapPin, Phone, Star } from "lucide-react";
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
}

const markers: MapMarkerData[] = [
  { id: "1", name: "Mina de Acosta", category: "Mina", lat: 20.141, lng: -98.672, description: "Museo y túneles históricos de minería.", image: minaImg, type: "place", rating: 4.8 },
  { id: "2", name: "Panteón Inglés", category: "Museo", lat: 20.08, lng: -98.7, description: "Patrimonio británico en el bosque.", image: panteonImg, type: "place", rating: 4.7 },
  { id: "3", name: "Peñas Cargadas", category: "Naturaleza", lat: 20.15, lng: -98.66, description: "Formaciones rocosas y senderismo panorámico.", image: penasImg, type: "place", rating: 4.9 },
  { id: "4", name: "Plaza Principal", category: "Cultura", lat: 20.138, lng: -98.6735, description: "Centro social y turístico del pueblo.", image: callesImg, type: "place", rating: 4.5 },
  { id: "5", name: "Museo del Paste", category: "Museo", lat: 20.1375, lng: -98.674, description: "Historia del paste y su herencia cornish.", image: pasteImg, type: "place", rating: 4.6 },
  { id: "6", name: "Pastes El Portal", category: "Pastes", lat: 20.1378, lng: -98.6738, description: "Pastes tradicionales en el centro histórico.", image: pasteImg, type: "business", isPremium: true, rating: 4.9, phone: "771 123 4567" },
  { id: "7", name: "Hotel Real de Minas", category: "Hospedaje", lat: 20.1395, lng: -98.675, description: "Hospedaje boutique en casona colonial.", image: callesImg, type: "business", isPremium: true, rating: 4.7, phone: "771 234 5678" },
  { id: "8", name: "Café La Neblina", category: "Restaurante", lat: 20.1382, lng: -98.6742, description: "Café de altura con ambiente local.", image: panteonImg, type: "business", rating: 4.4 },
];

const createIcon = (type: MarkerType, isPremium?: boolean) => {
  const color = isPremium ? "#f59e0b" : type === "place" ? "#60a5fa" : "#34d399";
  return L.divIcon({
    className: "custom-map-pin",
    html: `<span style="display:flex;width:${isPremium ? 30 : 24}px;height:${isPremium ? 30 : 24}px;border-radius:999px;background:${color};box-shadow:0 0 0 4px rgba(15,23,42,.65),0 0 14px ${color};"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function MapaPage() {
  const [filter, setFilter] = useState<"all" | MarkerType>("all");
  const [selected, setSelected] = useState<MapMarkerData | null>(markers[0]);

  const filtered = useMemo(
    () => markers.filter((item) => filter === "all" || item.type === filter),
    [filter],
  );

  return (
    <PageTransition>
      <SEOMeta {...PAGE_SEO.mapa} />
      <div className="min-h-screen bg-night-900 text-silver-300">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 md:px-6">
          <header className="mb-6 rounded-2xl border border-white/10 bg-night-800/70 p-5">
            <h1 className="font-serif text-3xl text-gold-400">Mapa inteligente de Real del Monte</h1>
            <p className="mt-2 text-sm text-silver-500">Visualiza puntos turísticos y comercios verificados sin elementos encimados.</p>
          </header>

          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todo" },
              { key: "place", label: "Lugares" },
              { key: "business", label: "Comercios" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as "all" | MarkerType)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  filter === item.key
                    ? "border-gold-500 bg-gold-500/20 text-gold-300"
                    : "border-white/10 bg-white/5 text-silver-400 hover:bg-white/10"
                }`}
              >
                <Filter className="mr-1 inline h-3.5 w-3.5" /> {item.label}
              </button>
            ))}
          </div>

          <section className="grid gap-4 lg:grid-cols-12">
            <div className="overflow-hidden rounded-2xl border border-white/10 lg:col-span-8">
              <MapContainer center={[20.1374, -98.6732]} zoom={14} className="h-[420px] w-full md:h-[640px]" zoomControl>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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

            <aside className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-white/10 bg-night-800/70 p-4">
                {selected ? (
                  <>
                    <img src={selected.image} alt={selected.name} className="mb-3 h-36 w-full rounded-lg object-cover" />
                    <h2 className="text-lg font-semibold text-silver-200">{selected.name}</h2>
                    <p className="mt-2 text-sm text-silver-500">{selected.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-silver-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1"><MapPin className="h-3.5 w-3.5" /> {selected.category}</span>
                      {selected.rating && <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-gold-400" /> {selected.rating}</span>}
                      {selected.isPremium && <span className="inline-flex items-center gap-1 text-gold-400"><Award className="h-3.5 w-3.5" /> Premium</span>}
                    </div>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-3 py-2 text-sm font-medium text-night-900">
                        <Phone className="h-4 w-4" /> Llamar
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-silver-500">Selecciona un punto del mapa para ver detalles.</p>
                )}
              </div>

              <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4">
                <h3 className="font-semibold text-gold-300">¿Tienes negocio?</h3>
                <p className="mt-2 text-sm text-silver-400">Regístralo en el catálogo y activa tu plan mensual para aparecer como comercio destacado.</p>
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
