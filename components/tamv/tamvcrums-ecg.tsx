"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { aggregateLogsToEcgPoints } from "@/lib/tamv/ecgMapper";
import { EcgPoint, TamvcrumLog } from "@/types/tamv";

export default function TamvcrumsEcg() {
  const queryOptions = useMemo(
    () => ({
      table: "tamvcrums_logs",
      select: "id,created_at,ecg_rhythm,impact_score,emotional_state,federation_id",
      order: { column: "created_at", ascending: true },
      limit: 500,
      transform: (rows: unknown[]) => aggregateLogsToEcgPoints(rows as TamvcrumLog[], 60),
    }),
    []
  );

  const { data, status, error } = useSupabaseQuery<EcgPoint>(queryOptions);
  const ecgData = data ?? [];

  return <div>{status === "loading" ? "Cargando ECG..." : status === "error" ? `Error: ${error}` : <div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ecgData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)"/><XAxis dataKey="time"/><YAxis/><Tooltip/><Area type="monotone" dataKey="rhythm" stroke="#22d3ee" fillOpacity={0.2} fill="#22d3ee"/></AreaChart></ResponsiveContainer></div>}</div>;
}
