import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type IsabellaStatus = "checking" | "online" | "degraded";

const IsabellaAura = () => {
  const [status, setStatus] = useState<IsabellaStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const check = async () => {
      try {
        const response = await fetch("/api/v1/isabella/context?q=isabella", {
          signal: controller.signal,
        });

        if (cancelled) return;
        setStatus(response.ok ? "online" : "degraded");
      } catch {
        if (!cancelled) {
          setStatus("degraded");
        }
      }
    };

    void check();
    const interval = setInterval(check, 30000);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const label = useMemo(() => {
    if (status === "online") return "Isabella conectada";
    if (status === "degraded") return "Isabella en sincronización";
    return "Sincronizando Isabella";
  }, [status]);

  return (
    <motion.div
      className="fixed left-4 bottom-28 z-[65] flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-3 py-2 backdrop-blur-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          status === "online" && "bg-emerald-400 shadow-[0_0_15px_rgba(74,222,128,0.9)]",
          status === "degraded" && "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)]",
          status === "checking" && "bg-sky-400 animate-pulse"
        )}
      />
      <span className="text-[11px] tracking-[0.08em] uppercase text-slate-200/95">{label}</span>
    </motion.div>
  );
};

export default IsabellaAura;
