import { motion } from "framer-motion";
import { MapPin, ArrowDown } from "lucide-react";
import heroImg from "@/assets/hero-real-del-monte.webp";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background image */}
      <img
        src={heroImg}
        alt="Vista aérea de Real del Monte, Pueblo Mágico de Hidalgo, México"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-2 mb-4"
        >
          <MapPin className="w-4 h-4 text-gold" />
          <span className="text-sm tracking-[0.3em] uppercase text-gold font-medium">
            Hidalgo, México
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
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-primary-foreground/80 max-w-lg mb-2 font-sans"
        >
          Pueblo Mágico — Historia, aventura y tradición entre la neblina
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="text-sm text-primary-foreground/50 max-w-md mb-10 font-sans"
        >
          Tu guía comunitaria digital para descubrir cada rincón de Real del Monte
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="animate-bounce"
        >
          <ArrowDown className="w-5 h-5 text-primary-foreground/50" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
