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

function toGeoPoint(position: GeolocationPosition): GeoPoint {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
    speed: position.coords.speed,
    heading: position.coords.heading,
    timestamp: position.timestamp,
  };
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

function mapGeoError(code?: number): string {
  if (code === 1) return "No autorizaste geolocalización. Puedes habilitarla desde permisos del navegador.";
  if (code === 2) return "No se pudo determinar tu ubicación. Verifica señal GPS/red.";
  if (code === 3) return "La geolocalización tardó demasiado. Intenta nuevamente.";
  return "No se pudo acceder a tu ubicación en vivo.";
}

export function useRealtimeGeoAI({ markers, onViewportChange }: UseRealtimeGeoAIParams) {
  const watchId = useRef<number | null>(null);
  const warmupTimeoutRef = useRef<number | null>(null);
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
      if (warmupTimeoutRef.current !== null) {
        window.clearTimeout(warmupTimeoutRef.current);
        warmupTimeoutRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setError("Este navegador no soporta geolocalización en tiempo real.");
      return;
    }

    warmupTimeoutRef.current = window.setTimeout(() => {
      setError("Tardamos más de lo esperado en obtener tu ubicación. Puedes seguir explorando el mapa manualmente.");
    }, 12000);

    const handlePosition = (position: GeolocationPosition) => {
      const nextPoint = toGeoPoint(position);
      setUserPosition(nextPoint);
      setError(null);

      if (warmupTimeoutRef.current !== null) {
        window.clearTimeout(warmupTimeoutRef.current);
        warmupTimeoutRef.current = null;
      }

      if (aiFollowEnabled) {
        onViewportChange({
          lat: nextPoint.lat,
          lng: nextPoint.lng,
          zoom: 16,
          bearing: nextPoint.heading ?? 0,
        });
      }
    };

    navigator.geolocation.getCurrentPosition(
      handlePosition,
      (geoError) => {
        setError(mapGeoError(geoError.code));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );

    watchId.current = navigator.geolocation.watchPosition(
      handlePosition,
      (geoError) => {
        setError(mapGeoError(geoError.code));
      },
      { enableHighAccuracy: true, maximumAge: 1500, timeout: 10000 },
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      if (warmupTimeoutRef.current !== null) {
        window.clearTimeout(warmupTimeoutRef.current);
        warmupTimeoutRef.current = null;
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
