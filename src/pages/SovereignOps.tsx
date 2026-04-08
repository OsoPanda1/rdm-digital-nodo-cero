import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";

type MapState = {
  territory: string;
  mode: string;
  lastSync: string;
  layers: Array<{ id: string; enabled: boolean; entities: number }>;
  sensorNodes: Array<{ id: string; status: string; trust: number }>;
  alerts: Array<{ id: string; severity: string; type: string; acknowledged: boolean }>;
};

type QuantumStatus = {
  layer: string;
  runtime: "stable" | "degraded";
  faultToleranceIndex: number;
  passRate: number;
  maxResidualError: number;
  updatedAt: string;
};

type SessionState = {
  active: boolean;
  session: null | { identityId: string; trustScore: number; createdAt: string };
};

const SovereignOps = () => {
  const [mapState, setMapState] = useState<MapState | null>(null);
  const [quantumStatus, setQuantumStatus] = useState<QuantumStatus | null>(null);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [map, quantum, session] = await Promise.allSettled([
        apiClient.get<MapState>("/territory/map-state"),
        apiClient.get<QuantumStatus>("/quantum/status"),
        apiClient.get<SessionState>("/identity/session"),
      ]);

      if (!mounted) return;
      if (map.status === "fulfilled") setMapState(map.value);
      if (quantum.status === "fulfilled") setQuantumStatus(quantum.value);
      if (session.status === "fulfilled") setSessionState(session.value);
    };

    load();
    const timer = setInterval(load, 5000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const alertCount = useMemo(
    () => mapState?.alerts.filter((alert) => !alert.acknowledged).length ?? 0,
    [mapState],
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Centro Soberano TAMV × RDM</h1>
        <p className="text-slate-300 mt-2">
          Estado operativo en vivo: territorio, identidad, telemetría cuántica y resiliencia.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4 mb-6">
        <Card title="Territorio" value={mapState?.territory ?? "Cargando..."} subtitle={mapState?.mode ?? "-"} />
        <Card title="Quantum Runtime" value={quantumStatus?.runtime ?? "Cargando..."} subtitle={quantumStatus?.layer ?? "-"} />
        <Card title="Alertas activas" value={String(alertCount)} subtitle="sin reconocer" />
        <Card title="Identidad" value={sessionState?.active ? "Sesión soberana activa" : "Sin sesión"} subtitle={sessionState?.session?.identityId ?? "visitante"} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Mapa soberano (capas activas)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {mapState?.layers?.map((layer) => (
              <div key={layer.id} className="rounded-lg border border-slate-700 p-3">
                <p className="font-medium capitalize">{layer.id}</p>
                <p className="text-sm text-slate-300">Entidades: {layer.entities}</p>
                <p className="text-xs text-emerald-300">{layer.enabled ? "Activa" : "Inactiva"}</p>
              </div>
            )) ?? <p className="text-slate-400">Sin datos de mapa.</p>}
          </div>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xl font-semibold mb-3">Panel cuántico</h2>
          <ul className="space-y-2 text-sm">
            <li>Fault Tolerance Index: <strong>{quantumStatus?.faultToleranceIndex ?? "-"}</strong></li>
            <li>Pass Rate: <strong>{quantumStatus ? `${(quantumStatus.passRate * 100).toFixed(1)}%` : "-"}</strong></li>
            <li>Error Máx. Residual: <strong>{quantumStatus?.maxResidualError ?? "-"}</strong></li>
            <li>Última actualización: <strong>{quantumStatus?.updatedAt ? new Date(quantumStatus.updatedAt).toLocaleTimeString() : "-"}</strong></li>
          </ul>
        </article>
      </section>
    </main>
  );
};

const Card = ({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) => (
  <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
    <p className="text-xs uppercase text-slate-400">{title}</p>
    <p className="text-lg font-semibold mt-1">{value}</p>
    {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
  </article>
);

export default SovereignOps;
