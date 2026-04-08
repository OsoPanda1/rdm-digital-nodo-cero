import { useCallback, useEffect, useRef, useState } from "react";

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuver: { type: string; modifier?: string };
  name: string;
}

export interface RouteData {
  coordinates: [number, number][]; // [lat, lng] pairs
  distance: number; // total meters
  duration: number; // total seconds
  steps: RouteStep[];
}

interface UseRoutingParams {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  enabled: boolean;
}

function translateManeuver(type: string, modifier?: string, name?: string): string {
  const road = name ? ` por ${name}` : "";
  const map: Record<string, string> = {
    depart: `Inicia el recorrido${road}`,
    arrive: `Has llegado a tu destino${road}`,
    "turn-left": `Gira a la izquierda${road}`,
    "turn-right": `Gira a la derecha${road}`,
    "turn-slight left": `Gira ligeramente a la izquierda${road}`,
    "turn-slight right": `Gira ligeramente a la derecha${road}`,
    "turn-sharp left": `Gira pronunciadamente a la izquierda${road}`,
    "turn-sharp right": `Gira pronunciadamente a la derecha${road}`,
    "turn-uturn": `Da vuelta en U${road}`,
    "continue-straight": `Continúa derecho${road}`,
    "fork-left": `Toma el camino de la izquierda${road}`,
    "fork-right": `Toma el camino de la derecha${road}`,
    "roundabout-": `En la glorieta${road}`,
    "new name-": `Continúa${road}`,
    merge: `Incorpórate${road}`,
  };

  const key = modifier ? `${type}-${modifier}` : type;
  return map[key] ?? map[type] ?? `Continúa${road}`;
}

export function useRouting({ origin, destination, enabled }: UseRoutingParams) {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const fetchRoute = useCallback(async () => {
    if (!origin || !destination || !enabled) {
      setRoute(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setActiveStepIndex(0);

    try {
      // OSRM public demo server — free, no API key needed
      const url = `https://router.project-osrm.org/route/v1/foot/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true&language=es`;

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("No se pudo calcular la ruta");

      const json = await res.json();
      if (json.code !== "Ok" || !json.routes?.[0]) {
        throw new Error("No se encontró ruta disponible entre estos puntos");
      }

      const osrmRoute = json.routes[0];
      const coords: [number, number][] = osrmRoute.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] // GeoJSON [lng,lat] → [lat,lng]
      );

      const steps: RouteStep[] = osrmRoute.legs[0].steps.map(
        (s: { distance: number; duration: number; maneuver: { type: string; modifier?: string }; name: string }) => ({
          instruction: translateManeuver(s.maneuver.type, s.maneuver.modifier, s.name),
          distance: s.distance,
          duration: s.duration,
          maneuver: s.maneuver,
          name: s.name,
        })
      );

      setRoute({
        coordinates: coords,
        distance: osrmRoute.distance,
        duration: osrmRoute.duration,
        steps,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Error calculando ruta");
    } finally {
      setLoading(false);
    }
  }, [origin, destination, enabled]);

  useEffect(() => {
    void fetchRoute();
    return () => abortRef.current?.abort();
  }, [fetchRoute]);

  // Auto-advance step based on user proximity
  const advanceStep = useCallback(
    (userLat: number, userLng: number) => {
      if (!route || activeStepIndex >= route.steps.length - 1) return;

      // Check if user is within ~30m of next step waypoint
      const nextCoord = route.coordinates[Math.min(activeStepIndex + 1, route.coordinates.length - 1)];
      if (!nextCoord) return;

      const dLat = (nextCoord[0] - userLat) * 111320;
      const dLng = (nextCoord[1] - userLng) * 111320 * Math.cos((userLat * Math.PI) / 180);
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);

      if (dist < 30) {
        setActiveStepIndex((i) => Math.min(i + 1, route.steps.length - 1));
      }
    },
    [route, activeStepIndex]
  );

  const cancelRoute = useCallback(() => {
    abortRef.current?.abort();
    setRoute(null);
    setError(null);
    setActiveStepIndex(0);
  }, []);

  return {
    route,
    loading,
    error,
    activeStepIndex,
    activeStep: route?.steps[activeStepIndex] ?? null,
    advanceStep,
    cancelRoute,
    refetch: fetchRoute,
  };
}
