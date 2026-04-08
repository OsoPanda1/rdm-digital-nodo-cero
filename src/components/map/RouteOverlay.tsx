import { Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import type { RouteData } from "@/hooks/useRouting";

interface RouteOverlayProps {
  route: RouteData;
  activeStepIndex: number;
}

const destinationIcon = L.divIcon({
  className: "route-destination-pin",
  html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:#f59e0b;box-shadow:0 0 0 6px rgba(245,158,11,0.25),0 0 20px rgba(245,158,11,0.5);border:2px solid rgba(255,255,255,0.9);font-size:14px;">📍</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export function RouteOverlay({ route, activeStepIndex }: RouteOverlayProps) {
  const walkedCoords = useMemo(
    () => route.coordinates.slice(0, Math.max(activeStepIndex + 1, 1)),
    [route.coordinates, activeStepIndex]
  );
  const remainingCoords = useMemo(
    () => route.coordinates.slice(Math.max(activeStepIndex, 0)),
    [route.coordinates, activeStepIndex]
  );

  const dest = route.coordinates[route.coordinates.length - 1];

  return (
    <>
      {/* Walked portion */}
      {walkedCoords.length > 1 && (
        <Polyline
          positions={walkedCoords}
          pathOptions={{
            color: "#6366f1",
            weight: 5,
            opacity: 0.5,
            dashArray: "8 6",
          }}
        />
      )}
      {/* Remaining route */}
      {remainingCoords.length > 1 && (
        <Polyline
          positions={remainingCoords}
          pathOptions={{
            color: "#22d3ee",
            weight: 5,
            opacity: 0.85,
          }}
        />
      )}
      {/* Destination marker */}
      {dest && (
        <Marker position={dest} icon={destinationIcon}>
          <Popup>
            <div className="p-1 text-sm font-semibold">🎯 Destino</div>
          </Popup>
        </Marker>
      )}
    </>
  );
}
