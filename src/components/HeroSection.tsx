import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero-real-del-monte.webp";
import logoRdm from "@/assets/logo-rdm.png";
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
];

const HeroSection = () => {
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
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

        {/* Gradientes cinematográficos */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

        {/* Neblina y líneas sutiles */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        }} />

        {/* Fog overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
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
            <div className="absolute -inset-2 rounded-full bg-white/5 backdrop-blur-xl" />
            <img
              src={logoRdm}
              alt="RDM Digital"
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-1 ring-white/15"
            />
          </div>
        </motion.div>

        {/* Location tag */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
        >
          <MapPin className="w-3 h-3 text-gold" />
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/60 font-light">
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
                    <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-white tracking-tight whitespace-nowrap">
                      {slide.title}
                    </h1>
                    <span className="hidden sm:block w-px h-8 bg-gold/50" />
                    <p className="hidden sm:block text-xs md:text-sm text-gold tracking-[0.3em] uppercase font-light">
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
                  ? "w-8 bg-gold shadow-[0_0_12px_hsla(43,65%,52%,0.8)]"
                  : "w-1.5 bg-white/35"
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button className="btn-hero-primary">
            Diseñar mi visita
          </button>
          <button className="btn-hero-glass">
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
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-light">
            Desliza para entrar
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Fade inferior hacia el contenido */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
