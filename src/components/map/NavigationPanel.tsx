import { ArrowRight, Clock, Footprints, Navigation, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RouteData, RouteStep } from "@/hooks/useRouting";

interface NavigationPanelProps {
  route: RouteData;
  activeStepIndex: number;
  activeStep: RouteStep | null;
  loading: boolean;
  onCancel: () => void;
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

function formatDuration(s: number): string {
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}min`;
}

export function NavigationPanel({ route, activeStepIndex, activeStep, loading, onCancel }: NavigationPanelProps) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className="glass-dark rounded-2xl border border-cyan-500/30 p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300">
          <Navigation className="h-5 w-5" />
          <span className="text-sm font-semibold">Navegación activa</span>
        </div>
        <button
          onClick={onCancel}
          className="rounded-full p-1 hover:bg-white/10 text-silver-400 hover:text-red-400 transition"
          aria-label="Cancelar navegación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-xs text-silver-400">
        <span className="flex items-center gap-1">
          <Footprints className="h-3.5 w-3.5" />
          {formatDistance(route.distance)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(route.duration)} caminando
        </span>
      </div>

      {/* Active instruction */}
      <AnimatePresence mode="wait">
        {activeStep && (
          <motion.div
            key={activeStepIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="rounded-xl bg-cyan-500/15 border border-cyan-500/25 p-3"
          >
            <p className="text-sm font-medium text-cyan-200">{activeStep.instruction}</p>
            <p className="text-xs text-silver-400 mt-1">
              {formatDistance(activeStep.distance)} · {formatDuration(activeStep.duration)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps list */}
      <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
        {route.steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 rounded-lg p-2 text-xs transition ${
              i === activeStepIndex
                ? "bg-cyan-500/10 text-cyan-200"
                : i < activeStepIndex
                ? "text-silver-600 line-through"
                : "text-silver-400"
            }`}
          >
            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{step.instruction}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-cyan-400 rounded-full"
          animate={{ width: `${((activeStepIndex + 1) / Math.max(route.steps.length, 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
