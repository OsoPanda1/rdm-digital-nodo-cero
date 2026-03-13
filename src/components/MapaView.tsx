import { Map, Navigation, Compass, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function MapaView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-light italic">Gemelo Digital: Mapa</h2>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/10 px-4 py-2 text-xs transition-all hover:bg-white/20">2D View</button>
          <button className="rounded-full bg-brand-amber px-4 py-2 text-xs font-bold text-black">3D Mesh</button>
        </div>
      </div>

      <div className="glass group relative aspect-video overflow-hidden rounded-3xl">
        <img
          src="https://picsum.photos/seed/map-rdm/1920/1080?blur=2"
          className="h-full w-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-brand-amber/30"
          >
            <div className="flex h-48 w-48 items-center justify-center rounded-full border border-brand-amber/20">
              <Compass className="h-12 w-12 animate-pulse text-brand-amber" />
            </div>
          </motion.div>
        </div>

        <div className="absolute left-1/3 top-1/4">
          <div className="relative">
            <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-brand-amber" />
            <div className="relative h-3 w-3 rounded-full bg-brand-amber" />
            <div className="glass absolute left-6 top-0 whitespace-nowrap rounded-lg px-3 py-1">
              <p className="text-[10px] font-bold">Parroquia de Nuestra Señora del Rosario</p>
              <p className="text-[8px] text-brand-amber">Active Node</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4">
          <div className="relative">
            <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-brand-amber" />
            <div className="relative h-3 w-3 rounded-full bg-brand-amber" />
            <div className="glass absolute left-6 top-0 whitespace-nowrap rounded-lg px-3 py-1">
              <p className="text-[10px] font-bold">Mina de Acosta</p>
              <p className="text-[8px] text-brand-amber">Digital Twin Synced</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 flex gap-4">
          <div className="glass flex items-center gap-4 rounded-2xl p-4">
            <div className="rounded-lg bg-brand-amber/20 p-2">
              <Navigation className="h-4 w-4 text-brand-amber" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500">Current Geolocation</p>
              <p className="font-mono text-xs">20.1389° N, 98.6733° W</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Nodes Active", value: "124", icon: Layers },
          { label: "Real-time Traffic", value: "Low", icon: Navigation },
          { label: "Digital Coverage", value: "98.2%", icon: Map },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/5 p-3">
                <stat.icon className="h-5 w-5 text-brand-amber" />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
