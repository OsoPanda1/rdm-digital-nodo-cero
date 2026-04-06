import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, MapPin, Compass, Sparkles, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-real-del-monte.webp";
import presentacionVideo from "@/assets/presentacion.mp4";
import { AuroraBackground } from "@/components/VisualEffects";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-night-900 text-silver-300">
      {/* Parallax Background — static image only, no video overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})`, y: backgroundY, scale: 1.1, opacity: 0.5 }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/60 to-night-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-night-900/40 via-transparent to-night-900/40" />

      {/* Aurora Ambient */}
      <AuroraBackground />

      {/* Floating Dust Particles */}
      <div className="dust-particles" />

      {/* Main Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs uppercase tracking-[0.25em] backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-gold-400" />
            <span>Real del Monte</span>
            <span className="mx-1 h-3 w-px bg-white/20" />
            <span className="text-gold-400">Pueblo Mágico</span>
            <span className="mx-1 h-3 w-px bg-white/20" />
            <span>Hidalgo</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif text-5xl leading-tight md:text-7xl lg:text-8xl"
          >
            <span className="block">Explora la magia de</span>
            <span
              className="block animate-gradient-text text-glow-gold"
              style={{
                backgroundImage: "linear-gradient(135deg, hsl(43,80%,55%) 0%, hsl(35,70%,65%) 25%, hsl(43,80%,55%) 50%, hsl(25,60%,50%) 75%, hsl(43,80%,55%) 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Real del Monte
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mx-auto max-w-2xl text-base text-silver-400 md:text-lg leading-relaxed"
          >
            Historia minera, gastronomía local, eventos vivos y rutas culturales
            en una sola plataforma digital a 2,700 metros de altura.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-6 text-xs text-silver-500"
          >
            {[
              { label: "Altitud", value: "2,700 msnm" },
              { label: "Fundado", value: "1534" },
              { label: "Pueblo Mágico", value: "Desde 2004" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-gold-400/60" />
                <span className="text-silver-300 font-medium">{stat.value}</span>
                <span className="text-silver-500">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Link
              to="/mapa"
              className="btn-hero-primary group inline-flex items-center gap-2"
            >
              <Compass className="h-4 w-4 transition-transform group-hover:rotate-45" />
              Explorar mapa
            </Link>
            <Link
              to="/rutas"
              className="btn-hero-glass inline-flex items-center gap-2"
            >
              Ver rutas turísticas
            </Link>
            <button
              onClick={() => setShowVideo(true)}
              className="btn-hero-glass inline-flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Ver presentación oficial
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-silver-500">Descubre</span>
          <ChevronDown className="h-5 w-5 animate-bounce text-gold-400/60" />
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
              Cerrar
            </button>
            <video
              src={presentacionVideo}
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
