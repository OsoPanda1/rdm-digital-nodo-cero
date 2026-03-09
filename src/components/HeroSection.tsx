import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Compass, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-real-del-monte.webp";
import logoRdm from "@/assets/logo-rdm-digital.png";
import heroVideo from "@/assets/hero-video.mp4";

const slides = [
  {
    title: "Real del Monte",
    subtitle: "Pueblo Mágico entre niebla y plata",
  },
  {
    title: "Mineral del Monte",
    subtitle: "Hidalgo · México · 2,700 msnm",
  },
  {
    title: "Cuna del Paste",
    subtitle: "Tradición inglesa desde el siglo XIX",
  },
  {
    title: "RDM Digital 2026",
    subtitle: "Innovación Turística Inteligente",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDesignVisit = () => {
    navigate("/rutas");
  };

  const handleViewMap = () => {
    navigate("/mapa");
  };

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background: imagen + video + overlays */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImg})` }}
        />

        <video
          src={heroVideo}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gradientes cinematográficos - Navy theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,45%,18%)]/40 via-transparent to-[hsl(220,45%,18%)]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,45%,18%)]/50 via-transparent to-[hsl(220,45%,18%)]/30" />

        {/* Neblina y líneas sutiles */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        }} />

        {/* Fog overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[hsl(220,45%,18%)]/70 to-transparent" />
      </motion.div>

      {/* Contenido principal */}
      <motion.div
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect */}
            <div 
              className="absolute -inset-4 rounded-full blur-2xl opacity-40"
              style={{
                background: "radial-gradient(circle, hsla(210,100%,55%,0.4) 0%, hsla(43,80%,55%,0.2) 50%, transparent 70%)"
              }}
            />
            <img
              src={logoRdm}
              alt="RDM Digital"
              className="relative w-28 h-28 md:w-36 md:h-36 object-contain"
              style={{
                filter: "drop-shadow(0 0 20px hsla(210,100%,55%,0.3))"
              }}
            />
          </div>
        </motion.div>

        {/* Location tag */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-2 mb-8 px-5 py-2 rounded-full"
          style={{
            background: "hsla(210,100%,55%,0.1)",
            border: "1px solid hsla(210,100%,55%,0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <MapPin className="w-3 h-3" style={{ color: "hsl(43,80%,55%)" }} />
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-light" style={{ color: "hsla(210,30%,85%,0.8)" }}>
            Mineral del Monte · Hidalgo · México
          </span>
        </motion.div>

        {/* Títulos rotatorios */}
        <div className="relative h-24 md:h-28 mb-6 w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {slides.map(
              (slide, index) =>
                index === currentSlide && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center gap-4"
                  >
                    <h1 
                      className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight whitespace-nowrap font-bold"
                      style={{
                        background: "linear-gradient(135deg, hsl(0,0%,98%), hsl(43,60%,75%), hsl(0,0%,90%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {slide.title}
                    </h1>
                    <span className="hidden sm:block w-px h-8" style={{ background: "hsla(43,80%,55%,0.5)" }} />
                    <p className="hidden sm:block text-xs md:text-sm tracking-[0.3em] uppercase font-light" style={{ color: "hsl(43,70%,65%)" }}>
                      {slide.subtitle}
                    </p>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>

        {/* Indicadores */}
        <div className="flex gap-2 mb-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                currentSlide === i
                  ? "w-8"
                  : "w-1.5"
              }`}
              style={{
                background: currentSlide === i 
                  ? "linear-gradient(90deg, hsl(210,100%,55%), hsl(43,80%,55%))"
                  : "hsla(210,30%,70%,0.35)",
                boxShadow: currentSlide === i ? "0 0 15px hsla(210,100%,55%,0.6)" : "none",
              }}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Botones de acción - FUNCIONALES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button 
            onClick={handleDesignVisit}
            className="btn-hero-primary flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Diseñar mi visita
          </button>
          <button 
            onClick={handleViewMap}
            className="btn-hero-glass flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            Ver mapa vivo del pueblo
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-light" style={{ color: "hsla(210,30%,70%,0.4)" }}>
            Desliza para entrar
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: "hsla(210,30%,70%,0.4)" }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Fade inferior hacia el contenido */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
