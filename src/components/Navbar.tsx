import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Map, BookOpen, Utensils, Palette, TreePine, Ghost, Clock, Quote, Compass, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoRdm from "@/assets/logo-rdm-digital.png";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Mapa", path: "/mapa", icon: Map },
  { label: "Rutas", path: "/rutas", icon: Compass },
];

const discoverItems = [
  { label: "Historia", path: "/historia", icon: Clock, desc: "460 años de minería" },
  { label: "Cultura", path: "/cultura", icon: BookOpen, desc: "Tradiciones vivas" },
  { label: "Relatos", path: "/relatos", icon: Ghost, desc: "Leyendas del pueblo" },
  { label: "Dichos Mineros", path: "/dichos-mineros", icon: Quote, desc: "Expresiones típicas" },
];

const experienceItems = [
  { label: "Ecoturismo", path: "/ecoturismo", icon: TreePine, desc: "Naturaleza y aventura" },
  { label: "Gastronomía", path: "/gastronomia", icon: Utensils, desc: "Cuna del paste" },
  { label: "Arte", path: "/arte", icon: Palette, desc: "Artesanías locales" },
];

const communityItems = [
  { label: "Lugares", path: "/lugares" },
  { label: "Directorio", path: "/directorio" },
  { label: "Eventos", path: "/eventos" },
  { label: "Comunidad", path: "/comunidad" },
  { label: "Negocios", path: "/negocios" },
  { label: "Validación", path: "/validacion-tecnica" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Track scroll for enhanced navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-elevated" : "glass-dark"
      }`}
      style={{ borderBottom: `1px solid hsla(210,100%,55%,${scrolled ? 0.2 : 0.1})` }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div 
                className="absolute -inset-1 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: "hsla(210,100%,55%,0.3)" }}
              />
              <img
                src={logoRdm}
                alt="RDM Digital"
                className="relative w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ filter: "drop-shadow(0 0 8px hsla(210,100%,55%,0.3))" }}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span 
                className="font-serif text-lg font-bold leading-tight"
                style={{ color: "hsl(0,0%,95%)" }}
              >
                RDM Digital
              </span>
              <span 
                className="text-[9px] tracking-[0.2em] uppercase leading-none"
                style={{ color: "hsl(43,70%,55%)" }}
              >
                Innovación Turística 2026
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="desktop-nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))",
                      boxShadow: "0 0 20px -4px hsla(210,100%,55%,0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Discover Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("discover")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Descubre
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "discover" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === "discover" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden"
                    style={{
                      background: "hsl(220,45%,10%)",
                      border: "1px solid hsla(210,100%,55%,0.2)",
                      boxShadow: "0 20px 60px -15px hsla(0,0%,0%,0.6)"
                    }}
                  >
                    {discoverItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))" }}
                        >
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{item.label}</div>
                          <div className="text-xs text-white/50">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Experience Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("experience")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Experiencias
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "experience" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === "experience" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden"
                    style={{
                      background: "hsl(220,45%,10%)",
                      border: "1px solid hsla(43,80%,55%,0.2)",
                      boxShadow: "0 20px 60px -15px hsla(0,0%,0%,0.6)"
                    }}
                  >
                    {experienceItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, hsl(43,80%,55%), hsl(35,70%,45%))" }}
                        >
                          <item.icon className="w-5 h-5" style={{ color: "hsl(220,45%,15%)" }} />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{item.label}</div>
                          <div className="text-xs text-white/50">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Community Items */}
            {communityItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="desktop-nav-community"
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))",
                      boxShadow: "0 0 20px -4px hsla(210,100%,55%,0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}

            <Link
              to="/apoya"
              className="ml-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, hsl(43,85%,55%), hsl(16,90%,55%))",
                boxShadow: "0 10px 30px -16px hsla(16,90%,55%,0.9)",
              }}
            >
              <Heart className="w-4 h-4 fill-white" />
              Apoya el proyecto
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "hsl(220,45%,8%)", borderTop: "1px solid hsla(210,100%,55%,0.1)" }}
            className="overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path) 
                      ? "text-white" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={isActive(item.path) ? { 
                    background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))" 
                  } : {}}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              ))}

              <div className="pt-4" style={{ borderTop: "1px solid hsla(210,100%,55%,0.1)" }}>
                <p className="px-4 text-xs text-white/40 uppercase tracking-wider mb-2">Descubre</p>
                {discoverItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path) 
                        ? "text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    style={isActive(item.path) ? { 
                      background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))" 
                    } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <span>{item.label}</span>
                      <span className="block text-[10px] text-white/30">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-4" style={{ borderTop: "1px solid hsla(43,80%,55%,0.1)" }}>
                <p className="px-4 text-xs text-white/40 uppercase tracking-wider mb-2">Experiencias</p>
                {experienceItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path) 
                        ? "text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    style={isActive(item.path) ? { 
                      background: "linear-gradient(135deg, hsl(43,80%,55%), hsl(35,70%,45%))" 
                    } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <span>{item.label}</span>
                      <span className="block text-[10px] text-white/30">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-4" style={{ borderTop: "1px solid hsla(210,100%,55%,0.1)" }}>
                <p className="px-4 text-xs text-white/40 uppercase tracking-wider mb-2">Comunidad</p>
                {communityItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path) 
                        ? "text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    style={isActive(item.path) ? { 
                      background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))" 
                    } : {}}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                to="/apoya"
                className="mx-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, hsl(43,85%,55%), hsl(16,90%,55%))",
                }}
              >
                <Heart className="w-4 h-4 fill-white" />
                Apoya el proyecto
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
