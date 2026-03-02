import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ChevronDown, Mountain, Wind, Thermometer, Clock, Compass } from "lucide-react";
import heroImg from "@/assets/hero-real-del-monte.webp";
import logoRdm from "@/assets/logo-rdm.png";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const slides = [
    {
      title: "Real del Monte",
      subtitle: "Donde la plata forjó una nación",
      description: "Pueblo Mágico con herencia Cornish-Mexicana"
    },
    {
      title: "Mineral del Monte",
      subtitle: "2,700 metros más cerca de las estrellas",
      description: "Entre la neblina y el bosque de oyamel"
    },
    {
      title: "Cuna del Paste",
      subtitle: "El sabor de Cornualles en México",
      description: "500 años de tradición gastronómica"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[800px] w-full overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        
        {/* Fog animation layers */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(ellipse at 30% 100%, rgba(255,255,255,0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse at 70% 100%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(ellipse at 30% 100%, rgba(255,255,255,0.15) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Mist layer */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent"
          style={{ opacity }}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
        style={{ opacity }}
      >
        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-sm text-white/90">
            <MapPin className="w-4 h-4 text-gold" />
            Mineral del Monte, Hidalgo, México
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <img
            src={logoRdm}
            alt="RDM Digital"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-2 border-white/30 shadow-2xl"
          />
        </motion.div>

        {/* Animated Title */}
        <div className="relative h-48 md:h-56">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 20,
                scale: currentSlide === index ? 1 : 0.95
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-none drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-gold font-medium mb-2 tracking-wide">
                {slide.subtitle}
              </p>
              <p className="text-sm md:text-base text-white/70 max-w-md">
                {slide.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Info Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {[
            { icon: Mountain, label: "2,700 msnm", desc: "Altitud" },
            { icon: Thermometer, label: "10-18°C", desc: "Clima" },
            { icon: Wind, label: "Neblina", desc: "Ambiente" },
            { icon: Clock, label: "1560", desc: "Fundación" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <item.icon className="w-4 h-4 text-gold" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">{item.label}</div>
                <div className="text-[10px] text-white/60 uppercase tracking-wider">{item.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Slide Indicators */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? "w-8 bg-gold" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/50 uppercase tracking-widest">Explorar</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/50" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Side Navigation Hints */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20">
        {["Historia", "Cultura", "Gastronomía", "Ecoturismo"].map((item, i) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <span className="w-8 h-[1px] bg-current transition-all group-hover:w-12" />
            <span className="text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              {item}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
