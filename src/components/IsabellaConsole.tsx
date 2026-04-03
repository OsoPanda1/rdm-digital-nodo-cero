import React, { useEffect, useState } from "react";
import {
  IsabellaBridge,
  type BookPIRecord,
  type FederatedNode,
} from "@/services/isabella-bridge";
import { BookPIViewer } from "@/components/BookPIViewer";
import { QuantumMonitor } from "@/components/QuantumMonitor";
import { isPromptSensitive } from "@/utils/isabellaGuard";

interface Props {
  userId: string;
}

export const IsabellaConsole: React.FC<Props> = ({ userId }) => {
  const [prompt, setPrompt] = useState("");
  const [processing, setProcessing] = useState(false);
  const [nodes, setNodes] = useState<FederatedNode[]>([]);
  const [ledger, setLedger] = useState<BookPIRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const syncPulse = async () => {
      try {
        const catalog = await IsabellaBridge.getFederatedPulse();
        if (mounted) setNodes(catalog);
      } catch (syncError) {
        console.error(syncError);
      }
    };

    const syncLedger = async () => {
      try {
        const records = await IsabellaBridge.getBookPILedger();
        if (mounted) setLedger(records);
      } catch (syncError) {
        console.error(syncError);
      }
    };

    void syncPulse();
    void syncLedger();

    const pulseId = setInterval(() => {
      void syncPulse();
    }, 5000);
    const ledgerId = setInterval(() => {
      void syncLedger();
    }, 8000);

    return () => {
      mounted = false;
      clearInterval(pulseId);
      clearInterval(ledgerId);
    };
  }, []);

  const handleSend = async () => {
    const clean = prompt.trim();
    if (!clean) return;

    if (isPromptSensitive(clean)) {
      setError(
        "Isabella ha bloqueado esta instrucción por intentar acceder a información sensible de las federaciones.",
      );
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      await IsabellaBridge.processPrompt(clean, userId);
      setPrompt("");
      const updated = await IsabellaBridge.getBookPILedger();
      setLedger(updated);
    } catch (processError) {
      const message = processError instanceof Error ? processError.message : "Error al procesar con Isabella";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 rounded-2xl border border-cyan-500/30 bg-black/70 p-4">
      <div className="col-span-12 space-y-3 lg:col-span-5">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Isabella Runtime · Quantum Federation
          </h2>
          <div className="mt-2 rounded-xl border border-white/5 bg-black/60 p-3">
            <textarea
              className="h-24 w-full resize-none bg-transparent text-sm text-white outline-none"
              placeholder="Envía una instrucción a Isabella…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Cada interacción queda registrada en BookPI.</span>
              <button
                onClick={handleSend}
                disabled={processing}
                className="rounded bg-cyan-500 px-3 py-1 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
              >
                {processing ? "Procesando…" : "Enviar"}
              </button>
            </div>
            {error && <p className="mt-1 text-[10px] leading-snug text-red-400">{error}</p>}
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-[0.23em] text-cyan-200">
            Pulso cuántico de federaciones
          </h3>
          <QuantumMonitor nodes={nodes} />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-cyan-200">
          BookPI · Ledger de transacciones
        </h3>
        <BookPIViewer records={ledger} />
      </div>
    </div>
  );
};
