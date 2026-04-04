"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Map as MapIcon, Navigation, Layers, Activity, Hexagon } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import "leaflet/dist/leaflet.css";

const CENTER = { lat: 20.1389, lng: -98.6733 };

const CATEGORY_COLORS: Record<string, string> = {
  GASTRONOMIA: "#f59e0b",
  HOSPEDAJE: "#3b82f6",
  PLATERIA: "#a855f7",
  ARTESANIA: "#ec4899",
  TURISMO: "#10b981",
  BAR: "#f97316",
  COMERCIO: "#6366f1",
  SERVICIOS: "#14b8a6",
  OTROS: "#64748b",
};

function createCategoryIcon(category: string, isPremium: boolean) {
  const color = CATEGORY_COLORS[category] || "#64748b";
  const size = isPremium ? 14 : 10;
  return L.divIcon({
    className: "",
    iconSize: [size * 2 + 8, size * 2 + 8],
    iconAnchor: [size + 4, size + 4],
    html: `<div style="
      width:${size * 2}px;height:${size * 2}px;
      border-radius:50%;
      background:${color};
      border:3px solid ${isPremium ? '#fbbf24' : 'rgba(255,255,255,0.3)'};
      box-shadow:0 0 ${isPremium ? '12' : '6'}px ${color}80;
      display:flex;align-items:center;justify-content:center;
    "></div>`,
  });
}

interface BusinessMarker {
  id: string;
  name: string;
  category: string;
  short_description: string | null;
  latitude: number;
  longitude: number;
  is_premium: boolean;
  status: string;
}

function ViewModeController({ viewMode }: { viewMode: "2d" | "3d" }) {
  const map = useMap();
  useEffect(() => {
    if (viewMode === "3d") {
      map.flyTo([CENTER.lat, CENTER.lng], 16, { duration: 1.5 });
    } else {
      map.flyTo([CENTER.lat, CENTER.lng], 15, { duration: 1.5 });
    }
  }, [viewMode, map]);
  return null;
}

function MapEvents() {
  const map = useMap();
  useEffect(() => {
    const handler = () => {
      const c = map.getCenter();
      trackEvent("map_interaction", {
        lat: c.lat,
        lng: c.lng,
        zoom: map.getZoom(),
      });
    };
    map.on("moveend", handler);
    return () => { map.off("moveend", handler); };
  }, [map]);
  return null;
}

export default function MapaView() {
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [businesses, setBusinesses] = useState<BusinessMarker[]>([]);
  const [stats, setStats] = useState({ active: 0, total: 0 });

  useEffect(() => {
    async function load() {
      const { data, count } = await supabase
        .from("businesses")
        .select("id, name, category, short_description, latitude, longitude, is_premium, status", { count: "exact" })
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (data) {
        const active = data.filter((b) => b.status === "active");
        setBusinesses(active as BusinessMarker[]);
        setStats({ active: active.length, total: count ?? data.length });
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-2">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-light tracking-tighter text-foreground">
            Gemelo Digital <span className="italic text-muted-foreground">RDM</span>
          </h2>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Hexagon className="w-3 h-3 text-primary" />
            <span>{businesses.length} negocios activos · Sincronización en vivo</span>
          </div>
        </div>

        <nav className="flex bg-muted/50 backdrop-blur-xl p-1 rounded-full border border-border">
          {(["2d", "3d"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                viewMode === mode
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode} View
            </button>
          ))}
        </nav>
      </header>

      <section className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
        <MapContainer
          center={[CENTER.lat, CENTER.lng]}
          zoom={15}
          className="h-full w-full"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ViewModeController viewMode={viewMode} />
          <MapEvents />

          {businesses.map((biz) => (
            <Marker
              key={biz.id}
              position={[biz.latitude, biz.longitude]}
              icon={createCategoryIcon(biz.category, biz.is_premium)}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h3 className="font-bold text-sm">{biz.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{biz.category}</p>
                  {biz.short_description && (
                    <p className="text-xs mt-1">{biz.short_description}</p>
                  )}
                  {biz.is_premium && (
                    <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      ⭐ Premium
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Crystal Glow Pulse Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="h-[40rem] w-[40rem] rounded-full border border-border/20 shadow-[inset_0_0_100px_rgba(255,255,255,0.05)]"
          />
        </div>

        {/* Telemetry Panel */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="pointer-events-auto flex items-center gap-5 rounded-3xl border border-border/30 bg-background/60 p-5 backdrop-blur-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Navigation className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Node Location</p>
              <p className="font-mono text-sm font-bold text-foreground tracking-widest">20.1389° N | 98.6733° W</p>
            </div>
          </motion.div>

          <div className="text-right hidden md:block">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.4em]">Digital Sovereignty Protocol</p>
            <p className="text-xs font-serif italic text-muted-foreground">Real del Monte, Hidalgo</p>
          </div>
        </div>
      </section>

      {/* Stats Engine Grid */}
      <footer className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Negocios Activos", value: String(stats.active), icon: Layers, color: "text-primary" },
          { label: "Total Registrados", value: String(stats.total), icon: Activity, color: "text-emerald-500" },
          { label: "Cobertura del Mapa", value: "98.2%", icon: MapIcon, color: "text-muted-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="group overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 transition-all hover:bg-card">
            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-muted/50 p-4 text-muted-foreground group-hover:scale-110 transition-transform">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-light text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}
