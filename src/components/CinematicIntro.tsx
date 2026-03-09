import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoRdm from "@/assets/logo-rdm-digital.png";
import introAudio from "@/assets/intro_off.mp3";

interface CinematicIntroProps {
  onComplete: () => void;
}

// Animated equalizer bars driven by real AnalyserNode data
const AudioEqualizer = ({ analyser }: { analyser: AnalyserNode | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BAR_COUNT = 48;
    const dataArr = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArr);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const barW = (w / BAR_COUNT) * 0.6;
      const gap = (w / BAR_COUNT) * 0.4;

      for (let i = 0; i < BAR_COUNT; i++) {
        // Sample frequency bins — weight towards mids
        const binIndex = Math.floor((i / BAR_COUNT) * (analyser.frequencyBinCount * 0.75));
        const rawVal = dataArr[binIndex] / 255;
        const barH = Math.max(4, rawVal * h * 0.9);

        const x = i * (barW + gap);
        const y = h - barH;

        // Gradient per bar: gold bottom → blue top
        const grad = ctx.createLinearGradient(x, h, x, y);
        grad.addColorStop(0, `hsla(43, 90%, 55%, ${0.5 + rawVal * 0.5})`);
        grad.addColorStop(0.5, `hsla(210, 80%, 65%, ${0.5 + rawVal * 0.4})`);
        grad.addColorStop(1, `hsla(280, 60%, 70%, ${0.3 + rawVal * 0.5})`);

        ctx.fillStyle = grad;
        ctx.shadowBlur = rawVal > 0.5 ? 12 : 4;
        ctx.shadowColor = `hsla(210, 100%, 65%, ${rawVal * 0.8})`;

        // Rounded top bar
        const radius = Math.min(barW / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barW - radius, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
        ctx.lineTo(x + barW, h);
        ctx.lineTo(x, h);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Reflection (mirror, dimmed)
        ctx.globalAlpha = 0.15;
        ctx.save();
        ctx.scale(1, -0.4);
        ctx.translate(0, -h * 2 - 4);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barW - radius, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
        ctx.lineTo(x + barW, h);
        ctx.lineTo(x, h);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={72}
      className="w-[280px] md:w-[420px] h-[50px] md:h-[72px]"
    />
  );
};

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleSkip = useCallback(() => {
    audioRef.current?.pause();
    audioCtxRef.current?.close().catch(() => {});
    onComplete();
  }, [onComplete]);

  // Escape key support
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, handleSkip]);

  const startIntro = () => {
    setStarted(true);

    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const audio = new Audio(introAudio);
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;

      const source = ctx.createMediaElementSource(audio);

      // ── Analyser for visualizer ──
      const anal = ctx.createAnalyser();
      anal.fftSize = 256;
      anal.smoothingTimeConstant = 0.8;
      setAnalyser(anal);

      // ── FX chain ──
      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.4;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.35;
      const wet = ctx.createGain();
      wet.gain.value = 0.3;
      const dry = ctx.createGain();
      dry.gain.value = 1.0;

      const bass = ctx.createBiquadFilter();
      bass.type = "lowshelf";
      bass.frequency.value = 200;
      bass.gain.value = 6;

      const high = ctx.createBiquadFilter();
      high.type = "highshelf";
      high.frequency.value = 8000;
      high.gain.value = 3;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.ratio.value = 4;

      // Dry path → analyser → destination
      source.connect(bass).connect(high).connect(dry).connect(compressor);
      compressor.connect(anal);
      anal.connect(ctx.destination);

      // Wet (echo) path
      source.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(compressor);

      // Fade in
      audio.volume = 0;
      audio.play().then(() => {
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(vol + 0.05, 1);
          audio.volume = vol;
          if (vol >= 1) clearInterval(fadeIn);
        }, 80);
      });

      // Fade out
      setTimeout(() => {
        if (audioRef.current) {
          let vol = audioRef.current.volume;
          const fadeOut = setInterval(() => {
            vol = Math.max(vol - 0.05, 0);
            if (audioRef.current) audioRef.current.volume = vol;
            if (vol <= 0) {
              clearInterval(fadeOut);
              audioRef.current?.pause();
            }
          }, 60);
        }
      }, 6000);
    } catch (e) {
      console.warn("Audio init failed:", e);
    }
  };

  useEffect(() => {
    if (!started) return;
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 5600),
      setTimeout(() => setPhase(5), 6800),
      setTimeout(() => {
        audioRef.current?.pause();
        audioCtxRef.current?.close().catch(() => {});
        onComplete();
      }, 7600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started, onComplete]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <AnimatePresence>
      {(!started || phase < 5) && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, hsl(220 25% 6%) 0%, hsl(220 35% 2%) 100%)",
            cursor: !started ? "pointer" : "default",
          }}
          onClick={!started ? startIntro : undefined}
        >
          {/* ── Click to start ── */}
          {!started && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={logoRdm} alt="RDM Digital" className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-60" />
              <p className="text-xs md:text-sm tracking-[0.35em] uppercase" style={{ color: "hsl(210 60% 65%)" }}>
                Toca para iniciar
              </p>
              <motion.div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "hsla(210, 80%, 60%, 0.5)" }}
                animate={{ scale: [1, 1.12, 1], boxShadow: ["0 0 0px hsla(210,80%,60%,0)", "0 0 20px hsla(210,80%,60%,0.3)", "0 0 0px hsla(210,80%,60%,0)"] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <div className="w-0 h-0 ml-1 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px]"
                  style={{ borderLeftColor: "hsl(210 80% 65%)" }} />
              </motion.div>
            </motion.div>
          )}

          {started && (
            <>
              {/* Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(60)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: `${1 + Math.random() * 2}px`,
                      height: `${1 + Math.random() * 2}px`,
                      background: i % 4 === 0 ? "hsla(210,100%,70%,0.7)"
                        : i % 4 === 1 ? "hsla(43,90%,60%,0.6)"
                        : i % 4 === 2 ? "hsla(280,60%,70%,0.4)"
                        : "hsla(0,0%,90%,0.3)",
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0.2, 1.8, 0.2],
                      y: [0, -80 - Math.random() * 60, 0],
                      x: [0, (Math.random() - 0.5) * 40, 0],
                    }}
                    transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2.5, ease: "easeInOut" }}
                  />
                ))}
              </div>

              {/* Orbital rings */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
              >
                {[0, 1, 2].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full"
                    style={{
                      width: `${400 + ring * 150}px`,
                      height: `${400 + ring * 150}px`,
                      border: `1px solid ${ring === 1 ? "hsla(43,80%,55%,0.2)" : "hsla(210,100%,70%,0.2)"}`,
                    }}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={phase >= 1 ? { opacity: [0, 0.3, 0.1], scale: [0.3, 1, 1.15], rotate: ring % 2 === 0 ? [0, 180] : [45, -135] } : {}}
                    transition={{ duration: 3 + ring * 0.5, ease: "easeOut", delay: ring * 0.3 }}
                  />
                ))}
              </motion.div>

              {/* Light sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: [0, 0.15, 0], background: ["linear-gradient(90deg,transparent 0%,hsla(210,80%,60%,0.2) 50%,transparent 100%)", "linear-gradient(90deg,transparent 0%,hsla(43,80%,55%,0.2) 50%,transparent 100%)", "linear-gradient(90deg,transparent 100%,transparent 100%)"] } : {}}
                transition={{ duration: 3, ease: "easeInOut" }}
              />

              {/* Scan lines */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,hsla(0,0%,100%,0.04) 2px,hsla(0,0%,100%,0.04) 4px)" }} />

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.4, filter: "blur(40px)" }}
                animate={phase >= 1 ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-6 z-10"
              >
                <motion.div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{ background: "radial-gradient(circle,hsla(210,100%,60%,0.3) 0%,hsla(43,80%,50%,0.2) 50%,transparent 80%)", transform: "scale(2.5)" }}
                  animate={phase >= 1 ? { opacity: [0.3, 0.7, 0.3] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <img src={logoRdm} alt="RDM Digital" className="relative w-36 h-36 md:w-52 md:h-52 object-contain"
                  style={{ filter: "drop-shadow(0 0 40px hsla(210,100%,60%,0.5))" }} />
              </motion.div>

              {/* Era badge */}
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.9 }}
                animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mb-4"
              >
                <span
                  className="inline-block px-6 py-2 rounded-full text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium"
                  style={{
                    background: "linear-gradient(135deg,hsla(210,100%,60%,0.12),hsla(43,80%,50%,0.08))",
                    border: "1px solid hsla(210,100%,70%,0.25)",
                    color: "hsl(210 80% 75%)",
                    boxShadow: "0 0 30px hsla(210,100%,60%,0.15)",
                  }}
                >
                  2026 · Nueva Era Digital
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-center relative z-10 px-6 mb-2"
              >
                <h1
                  className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-3"
                  style={{
                    background: "linear-gradient(135deg,hsl(0 0% 97%),hsl(43 70% 78%),hsl(210 60% 85%),hsl(0 0% 90%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Real del Monte
                </h1>
                <motion.div
                  className="h-[2px] mx-auto mb-4"
                  style={{ background: "linear-gradient(90deg,transparent,hsl(210 80% 65%),hsl(43 80% 55%),transparent)" }}
                  initial={{ width: 0 }}
                  animate={phase >= 2 ? { width: "10rem" } : {}}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                />
                <motion.p
                  className="text-sm md:text-base tracking-[0.3em] uppercase font-light"
                  style={{ color: "hsl(210 30% 60%)" }}
                  initial={{ opacity: 0 }}
                  animate={phase >= 2 ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Inicia su Digitalización
                </motion.p>
              </motion.div>

              {/* ── Audio Equalizer Visualizer ── */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0.3 }}
                animate={phase >= 2 ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="relative z-10 mb-4 flex flex-col items-center gap-1"
              >
                <AudioEqualizer analyser={analyser} />
                {/* Label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={phase >= 2 ? { opacity: 0.45 } : {}}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="text-[9px] tracking-[0.35em] uppercase"
                  style={{ color: "hsl(210 40% 55%)" }}
                >
                  ▶ Reproduciendo
                </motion.p>
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-center relative z-10 max-w-2xl px-6"
              >
                <p className="text-base md:text-lg font-light leading-relaxed mb-1" style={{ color: "hsl(43 55% 72%)" }}>
                  "Servicios de altura para sus visitantes"
                </p>
                <p className="text-sm italic tracking-wide" style={{ color: "hsl(0 0% 50%)" }}>
                  Bienvenidos a RDM Digital
                </p>
              </motion.div>

              {/* Bottom tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-20 z-10 text-center"
              >
                <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase" style={{ color: "hsl(210 40% 50%)" }}>
                  Innovación Turística Inteligente
                </p>
              </motion.div>

              {/* Progress bar */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                <motion.div
                  className="h-[3px] rounded-full overflow-hidden"
                  style={{ width: "160px", background: "hsla(210,50%,25%,0.3)" }}
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6.8, ease: "easeInOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg,hsl(210 80% 60%),hsl(43 70% 55%),hsl(280 50% 60%),hsl(210 80% 60%))",
                      boxShadow: "0 0 25px hsla(210,100%,60%,0.7)",
                    }}
                  />
                </motion.div>
              </div>

              {/* Skip button (mouse + Esc hint) */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 0.45 } : {}}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                className="absolute top-5 right-5 z-50 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full"
                style={{
                  color: "hsl(210 30% 60%)",
                  border: "1px solid hsla(210,50%,50%,0.2)",
                  background: "hsla(210,30%,10%,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="hidden md:inline px-1.5 py-0.5 rounded text-[9px]"
                  style={{ border: "1px solid hsla(210,50%,50%,0.25)", background: "hsla(210,30%,15%,0.5)" }}>
                  ESC
                </span>
                Saltar
              </motion.button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;
