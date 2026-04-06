import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { type LeafletEventHandlerFnMap, type Map as LeafletMap } from "leaflet";
import Supercluster from "supercluster";
import "leaflet/dist/leaflet.css";
import type { MapMarkerData, MapViewportState } from "@/features/places/mapTypes";

// Definición estricta de tipos para evitar errores de propiedades inexistentes
type ClusterProps = { cluster: true; cluster_id: number; point_count: number };
type PointProps = { cluster: false; markerId: string };

type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, ClusterProps>;
type PointFeature = GeoJSON.Feature<GeoJSON.Point, PointProps>;

type ClusterItem = ClusterFeature | PointFeature;

interface Map2DPanelProps {
  markers: MapMarkerData[];
  userPosition?: { lat: number; lng: number } | null;
  selected: MapMarkerData | null;
  viewport: MapViewportState;
  onSelect: (marker: MapMarkerData) => void;
  onViewportChange: (next: Partial<MapViewportState>) => void;
}

// Estética Platinum & Obsidian Mist para marcadores
const createPinIcon = (type: MapMarkerData["type"], isPremium?: boolean) => {
  const color = isPremium ? "#E5E7EB" : type === "place" ? "#60a5fa" : "#34d399";
  const glow = isPremium ? "0 0 15px rgba(229, 231, 235, 0.8)" : `0 0 12px ${color}`;
  
  return L.divIcon({
    className: "custom-map-pin",
    html: `<span style="display:flex;width:${isPremium ? 26 : 20}px;height:${isPremium ? 26 : 20}px;border-radius:999px;background:${color};box-shadow:0 0 0 4px rgba(10,15,27,.8), ${glow};border:1px solid rgba(255,255,255,0.9);backdrop-filter: blur(2px);"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createClusterIcon = (count: number) =>
  L.divIcon({
    className: "custom-cluster-pin",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:999px;background:radial-gradient(circle at top left, rgba(229,231,235,0.95), rgba(75,85,99,0.9));color:#0b1020;font-size:12px;font-weight:700;box-shadow:0 0 0 6px rgba(15,23,42,0.55),0 0 22px rgba(229,231,235,0.4);border:1px solid rgba(255,255,255,0.85)">${count}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

function MapEventBridge({ onViewportChange }: { onViewportChange: (next: Partial<MapViewportState>) => void }) {
  const map = useMap();

  useEffect(() => {
    const handler: LeafletEventHandlerFnMap = {
      moveend: () => {
        const center = map.getCenter();
        onViewportChange({ lat: center.lat, lng: center.lng, zoom: map.getZoom() });
      },
      zoomend: () => {
        const center = map.getCenter();
        onViewportChange({ lat: center.lat, lng: center.lng, zoom: map.getZoom() });
      },
    };

    map.on(handler);
    return () => { map.off(handler); };
  }, [map, onViewportChange]);

  return null;
}

function MapFocus({ selected }: { selected: MapMarkerData | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 15), { duration: 0.75 });
  }, [map, selected]);

  return null;
}

function buildClusterIndex(points: PointFeature[]) {
  return new Supercluster<PointProps, ClusterProps>({
    radius: 58,
    maxZoom: 18,
    minZoom: 0,
  }).load(points);
}

function getBounds(map: LeafletMap): [number, number, number, number] {
  const bounds = map.getBounds();
  return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
}

function ClusterLayer({ markers, onSelect }: { markers: MapMarkerData[]; onSelect: (marker: MapMarkerData) => void }) {
  const map = useMap();
  const markerLookup = useMemo(() => new Map(markers.map((m) => [m.id, m])), [markers]);

  const points = useMemo<PointFeature[]>(
    () =>
      markers.map((marker) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [marker.lng, marker.lat] },
        properties: { cluster: false, markerId: marker.id },
      })),
    [markers],
  );

  const index = useMemo(() => buildClusterIndex(points), [points]);
  const [version, setVersion] = useState(0);

  const clusterItems = useMemo<ClusterItem[]>(() => {
    const bbox = getBounds(map);
    const zoom = Math.floor(map.getZoom());
    return index.getClusters(bbox, zoom) as ClusterItem[];
  }, [index, map, version]);

  useEffect(() => {
    const refresh = () => setVersion((v) => v + 1);
    map.on("zoomend", refresh);
    map.on("moveend", refresh);
    return () => {
      map.off("zoomend", refresh);
      map.off("moveend", refresh);
    };
  }, [map]);

  return (
    <>
      {clusterItems.map((item, idx) => {
        const [lng, lat] = item.geometry.coordinates;
        const { properties } = item;

        // Type Guard para diferenciar entre Cluster y Punto Individual
        if (properties.cluster) {
          return (
            <Marker
              key={`cluster-${properties.cluster_id}-${idx}`}
              position={[lat, lng]}
              icon={createClusterIcon(properties.point_count)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = index.getClusterExpansionZoom(properties.cluster_id);
                  map.flyTo([lat, lng], Math.min(expansionZoom, 18), { duration: 0.6 });
                },
              }}
            />
          );
        }

        const marker = markerLookup.get((properties as PointProps).markerId);
        if (!marker) return null;

        return (
          <Marker
            key={`marker-${marker.id}`}
            position={[marker.lat, marker.lng]}
            icon={createPinIcon(marker.type, marker.isPremium)}
            eventHandlers={{ click: () => onSelect(marker) }}
          >
            <Popup>
              <div className="p-1">
                <strong className="text-slate-900 block border-b pb-1 mb-1">{marker.name}</strong>
                <p className="text-xs text-slate-600 leading-tight">{marker.description}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export function Map2DPanel({ markers, userPosition, selected, viewport, onSelect, onViewportChange }: Map2DPanelProps) {
  const userLocationIcon = useMemo(
    () =>
      L.divIcon({
        className: "user-location-pin",
        html: `<span style="display:flex;width:20px;height:20px;border-radius:999px;background:#22d3ee;box-shadow:0 0 0 6px rgba(34,211,238,0.25), 0 0 20px rgba(34,211,238,0.65);border:2px solid rgba(255,255,255,0.95);"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    [],
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl" role="region" aria-label="Mapa interactivo de Real del Monte">
      <p className="sr-only">Usa el teclado: R centra Real del Monte y M centra tu ubicación si está activa.</p>
      <MapContainer
        center={[viewport.lat, viewport.lng]}
        zoom={viewport.zoom}
        className="h-[420px] w-full md:h-[640px]"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapEventBridge onViewportChange={onViewportChange} />
        <MapFocus selected={selected} />
        <ClusterLayer markers={markers} onSelect={onSelect} />
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userLocationIcon}>
            <Popup>
              <p className="text-xs font-medium text-slate-800">Tu ubicación en tiempo real</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Overlay de diseño Crystal Glow en los bordes */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 ring-1 ring-inset ring-white/10" />
    </div>
  );
}
