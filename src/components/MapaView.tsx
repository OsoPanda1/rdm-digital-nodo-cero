"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { Map, Navigation, Compass, Layers } from "lucide-react";
import { motion } from "framer-motion";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type ViewMode = "2d" | "3d";

export default function MapaView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("3d");

  // Coordenadas aproximadas de Real del Monte
  const CENTER = { lng: -98.6733, lat: 20.1389 };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [CENTER.lng, CENTER.lat],
      zoom: 14,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("load", () => {
      // Terreno 3D
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 });

      // Edificios 3D
      const layers = map.getStyle().layers || [];
      const labelLayerId = layers.find(
        (l: any) => l.type === "symbol" && l.layout && l.layout["text-field"]
      )?.id;

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#c9c9c9",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              16,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              16,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.7,
          },
        },
        labelLayerId
      );

      // Marcadores clave del gemelo digital
      addPOIMarker(map, {
        lng: -98.6733,
        lat: 20.1389,
        title: "Parroquia de Nuestra Señora del Rosario",
        subtitle: "Active Node",
      });

      addPOIMarker(map, {
        lng: -98.6772,
        lat: 20.1382,
        title: "Mina de Acosta",
        subtitle: "Digital Twin Synced",
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Cambiar entre 2D y 3D con baja latencia (sólo ajusta pitch/bearing/terrain)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (viewMode === "2d") {
      map.setTerrain(undefined);
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else {
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.3 });
      map.easeTo({ pitch: 60, bearing: -20, duration: 800 });
    }
  }, [viewMode]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-light italic">Gemelo Digital: Mapa</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("2d")}
            className={`rounded-full px-4 py-2 text-xs transition-all ${
              viewMode === "2d"
                ? "bg-brand-amber text-black font-bold"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            2D View
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`rounded-full px-4 py-2 text-xs transition-all ${
              viewMode === "3d"
                ? "bg-brand-amber text-black font-bold"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            3D Mesh
          </button>
        </div>
      </div>

      <div className="glass relative aspect-video overflow-hidden rounded-3xl">
        <div ref={mapContainerRef} className="map-container" />

        {/* Overlay minimalista: “pulso” del gemelo digital */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.35, 0.18] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="h-72 w-72 rounded-full border border-brand-amber/30"
          />
        </div>

        {/* Tarjeta de geolocalización actual */}
        <div className="pointer-events-none absolute bottom-8 left-8 flex gap-4">
          <div className="glass flex items-center gap-4 rounded-2xl p-4">
            <div className="rounded-lg bg-brand-amber/20 p-2">
              <Navigation className="h-4 w-4 text-brand-amber" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500">Current Geolocation</p>
              <p className="font-mono text-xs">
                {CENTER.lat.toFixed(4)}° N, {Math.abs(CENTER.lng).toFixed(4)}° W
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats del gemelo digital */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Nodes Active", value: "124", icon: Layers },
          { label: "Real-time Traffic", value: "Low", icon: Navigation },
          { label: "Digital Coverage", value: "98.2%", icon: Map },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/5 p-3">
                <stat.icon className="h-5 w-5 text-brand-amber" />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type POIConfig = {
  lng: number;
  lat: number;
  title: string;
  subtitle: string;
};

function addPOIMarker(map: MapboxMap, { lng, lat, title, subtitle }: POIConfig) {
  const el = document.createElement("div");
  el.className = "relative";

  const ping = document.createElement("div");
  ping.className =
    "absolute inset-0 h-3 w-3 animate-ping rounded-full bg-brand-amber opacity-75";
  const dot = document.createElement("div");
  dot.className = "relative h-3 w-3 rounded-full bg-brand-amber";

  const card = document.createElement("div");
  card.className =
    "glass absolute left-6 top-0 whitespace-nowrap rounded-lg px-3 py-1 shadow-lg";
  card.innerHTML = `
    <p class="text-[10px] font-bold">${title}</p>
    <p class="text-[8px] text-brand-amber">${subtitle}</p>
  `;

  el.appendChild(ping);
  el.appendChild(dot);
  el.appendChild(card);

  new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
}
