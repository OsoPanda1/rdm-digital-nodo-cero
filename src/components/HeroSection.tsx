import { motion } from "framer-motion";
import { MapPin, ArrowDown, Mountain, Wind, Thermometer } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import heroImg from "@/assets/hero-real-del-monte.webp";
import logoRdm from "@/assets/logo-rdm.png";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background video with fallback */}
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={heroImg}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Fallback image layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
      </div>

      {/* Atmospheric overlay - simulating Real del Monte's fog */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Neblina/mist effect layers */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 px-4 text-center">
        {/* Badge with location info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground/90 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-gold" />
            2,700 msnm
          </span>
          <span className="px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground/90 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-gold" />
            10-18°C promedio
          </span>
          <span className="px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground/90 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-gold" />
            Niebla frecuente
          </span>
        </motion.div>

        <motion.img
          src={logoRdm}
          alt="RDM Digital logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-6 shadow-elevated border-2 border-white/20"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-2 mb-4"
        >
          <MapPin className="w-4 h-4 text-gold" />
          <span className="text-sm tracking-[0.3em] uppercase text-gold font-medium">
            Mineral del Monte, Hidalgo, México
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-4 leading-[0.95]"
        >
          Real del Monte
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mb-3 font-sans"
        >
          Pueblo Mágico — Donde la tradición minera se encuentra con Cornualles
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-sm md:text-base text-primary-foreground/70 max-w-xl mb-8 font-sans leading-relaxed"
        >
          Descubre el único Pueblo Mágico de Hidalgo con herencia inglesa. 
          Minas de plata del siglo XVIII, el Panteón Inglés más alto del mundo, 
          y el origen del paste en México te esperan entre la neblina de la Sierra.
        </motion.p>

        {/* Real del Monte specific highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10 text-xs text-primary-foreground/50"
        >
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Mina de Acosta
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Panteón Inglés
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Museo del Paste
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Peñas Cargadas
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="animate-bounce"
        >
          <ArrowDown className="w-5 h-5 text-primary-foreground/50" />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
