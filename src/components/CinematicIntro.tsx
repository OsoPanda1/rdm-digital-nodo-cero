import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoRdm from "@/assets/logo-rdm-digital.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState(0);
  // 0=dark, 1=logo, 2=text, 3=tagline, 4=fade-out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 5800),
      setTimeout(() => onComplete(), 6600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, hsl(220 25% 8%) 0%, hsl(220 30% 3%) 100%)"
          }}
        >
          {/* Particle field */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: i % 3 === 0 
                    ? "hsla(210, 100%, 70%, 0.6)" 
                    : i % 3 === 1 
                    ? "hsla(43, 80%, 60%, 0.5)" 
                    : "hsla(0, 0%, 80%, 0.4)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Orbital rings effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase >= 1 ? { opacity: 0.15, scale: 1 } : {}}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
              style={{
                border: "1px solid hsla(210, 100%, 70%, 0.3)",
                boxShadow: "0 0 60px hsla(210, 100%, 70%, 0.15), inset 0 0 60px hsla(210, 100%, 70%, 0.1)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: 45 }}
              animate={phase >= 1 ? { opacity: 0.2, scale: 1, rotate: 45 } : {}}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
              className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full"
              style={{
                border: "1px solid hsla(43, 80%, 55%, 0.25)",
                boxShadow: "0 0 40px hsla(43, 80%, 55%, 0.1)",
              }}
            />
          </div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(0,0%,100%,0.03) 2px, hsla(0,0%,100%,0.03) 4px)",
            }}
          />

          {/* Ambient fog */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 30% 50%, hsla(210,80%,50%,0.15) 0%, transparent 60%)",
                "radial-gradient(circle at 70% 50%, hsla(210,80%,50%,0.15) 0%, transparent 60%)",
                "radial-gradient(circle at 30% 50%, hsla(210,80%,50%,0.15) 0%, transparent 60%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: "blur(30px)" }}
            animate={
              phase >= 1
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : {}
            }
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-10 z-10"
          >
            {/* Glow behind logo */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, hsla(210,100%,60%,0.25) 0%, hsla(43,80%,50%,0.15) 50%, transparent 80%)",
                transform: "scale(2)",
              }}
            />
            <img
              src={logoRdm}
              alt="RDM Digital"
              className="relative w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 0 30px hsla(210,100%,60%,0.4))",
              }}
            />
          </motion.div>

          {/* Year badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mb-4"
          >
            <span
              className="inline-block px-5 py-1.5 rounded-full text-xs tracking-[0.4em] uppercase font-medium"
              style={{
                background: "linear-gradient(135deg, hsla(210,100%,60%,0.15), hsla(43,80%,50%,0.1))",
                border: "1px solid hsla(210,100%,70%,0.3)",
                color: "hsl(210 80% 75%)",
              }}
            >
              2026 · Nueva Era Digital
            </span>
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10 px-6"
          >
            <h1
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 95%), hsl(43 60% 75%), hsl(0 0% 85%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 60px hsla(43,80%,50%,0.3)",
              }}
            >
              Real del Monte
            </h1>
            <div
              className="h-[2px] w-32 mx-auto mb-4"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(210 80% 65%), hsl(43 80% 55%), transparent)",
              }}
            />
            <p
              className="text-sm md:text-base tracking-[0.25em] uppercase font-light"
              style={{ color: "hsl(210 30% 60%)" }}
            >
              Inicia su Digitalización
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mt-10 text-center relative z-10 max-w-2xl px-6"
          >
            <p
              className="text-base md:text-lg font-light leading-relaxed mb-2"
              style={{ color: "hsl(43 50% 70%)" }}
            >
              "Servicios de altura para sus visitantes"
            </p>
            <p
              className="text-sm md:text-base italic tracking-wide"
              style={{ color: "hsl(0 0% 50%)" }}
            >
              Bienvenidos a RDM Digital
            </p>
          </motion.div>

          {/* Innovation tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="absolute bottom-20 z-10"
          >
            <p
              className="text-[10px] md:text-xs tracking-[0.35em] uppercase"
              style={{ color: "hsl(210 40% 50%)" }}
            >
              Innovación Turística Inteligente
            </p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[3px] rounded-full overflow-hidden z-10"
            style={{
              width: "150px",
              background: "hsla(210, 50%, 30%, 0.3)",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5.8, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(210 80% 60%), hsl(43 70% 55%), hsl(210 80% 60%))",
                boxShadow: "0 0 20px hsla(210, 100%, 60%, 0.6)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
