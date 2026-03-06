import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Map, BookOpen, Utensils, Palette, TreePine, Ghost, Clock, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoRdm from "@/assets/logo-rdm.png";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Mapa", path: "/mapa", icon: Map },
];

const discoverItems = [
  { label: "Historia", path: "/historia", icon: Clock, desc: "460 años de minería" },
  { label: "Cultura", path: "/cultura", icon: BookOpen, desc: "Tradiciones vivas" },
  { label: "Relatos", path: "/relatos", icon: Ghost, desc: "Leyendas del pueblo" },
  { label: "Dichos", path: "/dichos", icon: Quote, desc: "Expresiones típicas" },
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
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logoRdm}
              alt="RDM Digital"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-lg font-bold leading-tight text-foreground">
                RDM Digital
              </span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground leading-none">
                Pueblo Mágico
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
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-gradient-warm shadow-warm"
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
              <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                Descubre
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "discover" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === "discover" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl glass shadow-elevated border border-border/50 overflow-hidden"
                  >
                    {discoverItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-warm flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
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
              <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                Experiencias
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "experience" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === "experience" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl glass shadow-elevated border border-border/50 overflow-hidden"
                  >
                    {experienceItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-forest flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
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
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-gradient-warm shadow-warm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl btn-glass"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive(item.path) ? "bg-gradient-warm text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-border">
                <p className="px-4 text-xs text-muted-foreground uppercase tracking-wider mb-2">Descubre</p>
                {discoverItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive(item.path) ? "bg-gradient-warm text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="px-4 text-xs text-muted-foreground uppercase tracking-wider mb-2">Experiencias</p>
                {experienceItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive(item.path) ? "bg-gradient-warm text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="px-4 text-xs text-muted-foreground uppercase tracking-wider mb-2">Comunidad</p>
                {communityItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl ${
                      isActive(item.path) ? "bg-gradient-warm text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
