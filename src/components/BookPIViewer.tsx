import React from "react";
import { Hash, ShieldCheck } from "lucide-react";
import type { BookPIRecord } from "@/services/isabella-bridge";

interface Props {
  records: BookPIRecord[];
}

export const BookPIViewer: React.FC<Props> = ({ records }) => {
  if (!records.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-xs text-zinc-400">
        BookPI aún no tiene registros para mostrar.
      </div>
    );
  }

  return (
    <div className="custom-scrollbar max-h-[420px] space-y-3 overflow-y-auto pr-2">
      {records.map((record, index) => (
        <div
          key={`${record.hash}-${index}`}
          className="rounded-r-lg border-l-2 border-cyan-500 bg-white/5 p-3"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <ShieldCheck size={12} /> Record #{index} · Verified
            </span>
            <span className="text-[9px] text-zinc-500">{new Date(record.timestamp).toLocaleString()}</span>
          </div>
          <p className="mb-1 text-xs italic text-white">“{record.prompt}”</p>
          {record.route?.length > 0 && (
            <p className="mb-2 text-[10px] text-emerald-300">Ruta: {record.route.join(" → ")}</p>
          )}
          <div className="space-y-1 break-all rounded bg-black/60 p-2 font-mono text-[8px] text-zinc-400">
            <p className="flex items-center gap-1">
              <span className="flex items-center gap-1 text-cyan-400">
                <Hash size={10} /> HASH:
              </span>
              <span>{record.hash}</span>
            </p>
            <p>
              <span className="text-zinc-500">PREV:</span> {record.previousHash}
            </p>
            <p>
              <span className="text-zinc-500">USER:</span> {record.userId}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
