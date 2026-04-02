import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LSMRenderProps {
  capaActiva: 'turismo' | 'economia' | 'plateria' | 'movilidad';
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
}

interface LSMNode {
  id: string;
  lat: number;
  lng: number;
  intensidadSaturacion?: number;
  ofertaActiva?: boolean;
}

export const LSMRenderEngine = ({ capaActiva, initialViewState }: LSMRenderProps) => {
  const [nodosLSM] = useState<LSMNode[]>([]);

  const visibleNodes = useMemo(() => {
    if (capaActiva === 'movilidad') return nodosLSM;
    if (capaActiva === 'economia' || capaActiva === 'plateria') return nodosLSM;
    return [];
  }, [nodosLSM, capaActiva]);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
      <MapContainer
        center={[initialViewState.latitude, initialViewState.longitude]}
        zoom={initialViewState.zoom}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {visibleNodes.map((node) => (
          <CircleMarker
            key={node.id}
            center={[node.lat, node.lng]}
            radius={node.ofertaActiva ? 12 : 6}
            pathOptions={{
              fillColor: node.ofertaActiva ? '#E5E7EB' : '#4B5563',
              fillOpacity: node.ofertaActiva ? 0.9 : 0.6,
              color: '#fff',
              weight: 1,
              opacity: 0.4,
            }}
          />
        ))}
      </MapContainer>

      {/* Indicador de Capa Activa - Glassmorphism */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-lg pointer-events-none">
        <span className="text-[10px] uppercase tracking-[2px] text-slate-400 block mb-1">Estatus LSM</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 capitalize">{capaActiva}</span>
        </div>
      </div>
    </div>
  );
};
