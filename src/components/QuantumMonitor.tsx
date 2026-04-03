import React from "react";
import type { FederatedNode } from "@/services/isabella-bridge";

interface Props {
  nodes: FederatedNode[];
}

export const QuantumMonitor: React.FC<Props> = ({ nodes }) => {
  if (!nodes.length) {
    return (
      <div className="rounded-xl border border-cyan-500/20 bg-black/40 p-4 text-xs text-zinc-400">
        Sin nodos reportando en este momento.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl border border-cyan-500/20 bg-black/40 p-3 font-mono text-[9px] md:grid-cols-6">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="flex flex-col items-center rounded border border-white/5 bg-white/5 p-2"
        >
          <div
            className={`mb-1 h-2 w-2 rounded-full ${
              node.status === "active"
                ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                : node.status === "degraded"
                  ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                  : node.status === "planned"
                    ? "bg-purple-400"
                    : "bg-zinc-600"
            }`}
          />
          <span className="w-full truncate text-center text-zinc-200">{node.name}</span>
          <span className="text-cyan-500/70">{node.latency}ms</span>
        </div>
      ))}
    </div>
  );
};
