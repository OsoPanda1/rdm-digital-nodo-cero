"use client";

import { useMemo, useState } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { FederationNode } from "@/types/eoct";

const TOTAL_NODES = 195;

function statusColor(node: FederationNode) {
  const status = node.status || (node.ecg_rhythm > 85 ? "SATURATING" : "OK");
  switch (status) {
    case "SATURATING":
      return "bg-rose-500";
    case "OFFLINE":
      return "bg-slate-600";
    case "BOOTSTRAP":
      return "bg-amber-400";
    default:
      return "bg-cyan-400";
  }
}

export default function FederationRing() {
  const [selectedFederation, setSelectedFederation] = useState<number | "ALL">("ALL");
  const queryOptions = useMemo(
    () => ({
      table: "tamv_federation_ring",
      select: "id,created_at,federation_id,ecg_rhythm,quantum_hash,status",
      order: { column: "created_at", ascending: true },
      limit: TOTAL_NODES,
    }),
    []
  );
  const { data, status, error } = useSupabaseQuery<FederationNode>(queryOptions);
  const nodes = data ?? [];

  const filteredNodes = useMemo(() => (selectedFederation === "ALL" ? nodes : nodes.filter((n) => n.federation_id === selectedFederation)), [nodes, selectedFederation]);

  if (status === "loading") return <div>Cargando anillo EOCT…</div>;
  if (status === "error") return <div>Error: {error}</div>;

  return <div className="space-y-3"><select value={selectedFederation} onChange={(e) => setSelectedFederation(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}><option value="ALL">Todas</option>{Array.from({ length: 7 }).map((_, i) => <option key={i} value={i + 1}>Federación {i + 1}</option>)}</select><div className="relative w-[320px] h-[320px]">{filteredNodes.map((node, i) => {const angle = (i / filteredNodes.length) * 2 * Math.PI; const radius = 120; const x = radius * Math.cos(angle); const y = radius * Math.sin(angle); return <div key={node.id} className={`absolute w-2.5 h-2.5 rounded-full ${statusColor(node)}`} style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }} title={`Nodo ${node.id}`} />;})}</div></div>;
}
