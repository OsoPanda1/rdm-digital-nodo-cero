import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import PageTransition from "@/components/PageTransition";
import GradientSeparator from "@/components/GradientSeparator";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";
import { AuroraBackground, TextReveal } from "@/components/VisualEffects";
import { motion } from "framer-motion";
import { Search, Store, Sparkles } from "lucide-react";
import { useBusinesses } from "@/features/businesses";
import { Link } from "react-router-dom";

import callesImg from "@/assets/calles-colonial.webp";

const categories = ["Todos", "GASTRONOMIA", "HOSPEDAJE", "PLATERIA", "ARTESANIA", "TURISMO", "BAR", "COMERCIO", "SERVICIOS"];

const DirectorioPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const { data: allBusinesses = [], isLoading } = useBusinesses({ limit: 50 });

  const filteredBusinesses = useMemo(() => {
    return allBusinesses.filter((biz) => {
      const matchesSearch = searchQuery === "" ||
        biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Todos" || biz.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, allBusinesses]);

  return (
    <PageTransition>
      <SEOMeta {...(PAGE_SEO.directorio ?? { title: "Directorio de Negocios | RDM Digital", description: "Comercios, hoteles, restaurantes y servicios de Real del Monte." })} />
      <div className="min-h-screen bg-night-900 text-silver-300">
        <Navbar />

        {/* Immersive Hero */}
        <section className="relative overflow-hidden pt-24 pb-16">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${callesImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/70 to-night-900" />
          <AuroraBackground />
          <div className="dust-particles" />

          <div className="relative mx-auto max-w-6xl px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] backdrop-blur-sm">
                <Store className="h-3.5 w-3.5 text-gold-400" />
                <span>Negocios Verificados</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl leading-tight">
                <span className="block">Directorio de</span>
                <span
                  className="block animate-gradient-text text-glow-gold"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(43,80%,55%) 0%, hsl(35,70%,65%) 25%, hsl(43,80%,55%) 50%, hsl(25,60%,50%) 75%, hsl(43,80%,55%) 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Negocios
                </span>
              </h1>
              <p className="max-w-2xl text-base text-silver-400 md:text-lg leading-relaxed">
                Comercios, hoteles, restaurantes y servicios recomendados por la comunidad de Real del Monte.
              </p>
            </motion.div>
          </div>
        </section>

        <GradientSeparator animated />

        {/* Search & Filters */}
        <section className="relative py-10">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-silver-500" />
                <input
                  type="text"
                  placeholder="Buscar negocios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-silver-200 placeholder:text-silver-500 backdrop-blur-sm focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all duration-300"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-gold-400/20 text-gold-400 border border-gold-400/30"
                        : "border border-white/10 bg-white/5 text-silver-400 hover:bg-white/10 hover:text-silver-200"
                    }`}
                  >
                    {cat === "Todos" ? "Todos" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex items-center gap-2 mb-6 text-sm text-silver-500">
            <Sparkles className="h-3.5 w-3.5 text-gold-400/60" />
            <span>{filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? "s" : ""} encontrado{filteredBusinesses.length !== 1 ? "s" : ""}</span>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
              <Store className="h-12 w-12 text-silver-500 mx-auto mb-4" />
              <p className="text-silver-400 text-lg">No se encontraron negocios.</p>
              <p className="text-silver-500 text-sm mt-2">Los negocios se registran directamente en la plataforma.</p>
              <Link to="/negocios" className="mt-4 inline-block rounded-full bg-gold-400/20 px-5 py-2 text-sm text-gold-400 border border-gold-400/30 hover:bg-gold-400/30 transition">
                Registra tu negocio
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredBusinesses.map((biz, i) => (
                <BusinessCard
                  key={biz.id}
                  name={biz.name}
                  category={biz.category}
                  description={biz.description}
                  image={biz.imageUrl || "/placeholder.svg"}
                  isPremium={biz.isPremium}
                  rating={biz.rating ?? 4.2}
                  phone={biz.phone ?? undefined}
                  index={i}
                />
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default DirectorioPage;
