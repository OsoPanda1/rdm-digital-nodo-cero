import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-real-del-monte.webp";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-night-900 text-silver-300">
      <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${heroImg})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-night-900/75 via-night-900/70 to-night-900" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            <MapPin className="h-3.5 w-3.5 text-gold-400" />
            Real del Monte · Hidalgo
          </div>

          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Explora la magia de
            <span className="block text-gold-400">Real del Monte</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm text-silver-400 md:text-base">
            Historia minera, gastronomía local, eventos vivos y rutas culturales en una sola plataforma.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/lugares" className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-night-900">
              Ver lugares
            </Link>
            <Link to="/rutas" className="rounded-full border border-white/20 px-6 py-3 text-sm">
              Ver rutas
            </Link>
          </div>
        </motion.div>

        <ChevronDown className="absolute bottom-8 h-6 w-6 animate-bounce text-silver-500" />
      </div>
    </section>
  );
}
