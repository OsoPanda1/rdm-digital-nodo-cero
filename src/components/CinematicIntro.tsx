import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoRdm from "@/assets/logo-rdm.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState(0); // 0=dark, 1=logo, 2=text, 3=fade-out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3400),
      setTimeout(() => onComplete(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at center, hsl(0 0% 6%) 0%, hsl(0 0% 2%) 100%)" }}
        >
          {/* Ambient fog */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 30% 50%, hsla(36,40%,40%,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, hsla(210,20%,50%,0.1) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(0,0%,100%,0.03) 2px, hsla(0,0%,100%,0.03) 4px)" }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
            animate={phase >= 1 ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, hsla(36,50%,50%,0.4), transparent)" }} />
            <img src={logoRdm} alt="RDM Digital" className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-2xl" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10"
          >
            <h1
              className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-3"
              style={{ color: "hsl(36 30% 75%)", textShadow: "0 0 40px hsla(36,40%,50%,0.3)" }}
            >
              Real del Monte
            </h1>
            <div className="h-[1px] w-24 mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, hsl(36 30% 60%), transparent)" }} />
            <p className="text-sm md:text-base tracking-[0.3em] uppercase" style={{ color: "hsl(0 0% 55%)" }}>
              Pueblo Mágico · Hidalgo · México
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-10 text-sm md:text-base italic tracking-wide relative z-10"
            style={{ color: "hsl(0 0% 45%)" }}
          >
            Donde la niebla guarda historias de plata
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 h-[2px] rounded-full overflow-hidden"
            style={{ width: "120px", background: "hsl(0 0% 15%)" }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.8, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(36 40% 50%), hsl(36 30% 70%))" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
