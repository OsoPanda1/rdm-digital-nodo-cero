import { useEffect, useMemo, useRef, useState } from "react";
import type { MapMarkerData, MapViewportState } from "@/features/places/mapTypes";

interface GeoPoint {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

interface UseRealtimeGeoAIParams {
  markers: MapMarkerData[];
  onViewportChange: (next: Partial<MapViewportState>) => void;
}

function haversineKm(a: Pick<GeoPoint, "lat" | "lng">, b: Pick<MapMarkerData, "lat" | "lng">): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

export function useRealtimeGeoAI({ markers, onViewportChange }: UseRealtimeGeoAIParams) {
  const watchId = useRef<number | null>(null);
  const [userPosition, setUserPosition] = useState<GeoPoint | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [aiFollowEnabled, setAiFollowEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingEnabled) {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setError("Este navegador no soporta geolocalización en tiempo real.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextPoint: GeoPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        };
        setUserPosition(nextPoint);
        setError(null);

        if (aiFollowEnabled) {
          onViewportChange({
            lat: nextPoint.lat,
            lng: nextPoint.lng,
            zoom: 16,
            bearing: nextPoint.heading ?? 0,
          });
        }
      },
      () => {
        setError("No se pudo acceder a tu ubicación en vivo.");
      },
      { enableHighAccuracy: true, maximumAge: 1500, timeout: 10000 },
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [aiFollowEnabled, onViewportChange, trackingEnabled]);

  const nearestMarker = useMemo(() => {
    if (!userPosition || !markers.length) return null;

    let nearest: { marker: MapMarkerData; distanceKm: number } | null = null;
    for (const marker of markers) {
      const distanceKm = haversineKm(userPosition, marker);
      if (!nearest || distanceKm < nearest.distanceKm) {
        nearest = { marker, distanceKm };
      }
    }

    return nearest;
  }, [markers, userPosition]);

  const centerOnUser = () => {
    if (!userPosition) return;
    onViewportChange({ lat: userPosition.lat, lng: userPosition.lng, zoom: 16 });
  };

  return {
    userPosition,
    trackingEnabled,
    setTrackingEnabled,
    aiFollowEnabled,
    setAiFollowEnabled,
    nearestMarker,
    error,
    centerOnUser,
  };
}
