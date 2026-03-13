import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Utensils } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { PAGE_SEO, SEOMeta } from "@/components/SEOMeta";
import pasteImg from "@/assets/paste.webp";

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

export default function GastronomiaPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/businesses?category=GASTRONOMIA`);
        if (!response.ok) {
          throw new Error("No se pudo cargar la categoría de gastronomía");
        }
        const data = await response.json();
        setBusinesses(data.data ?? []);
      } catch (error) {
        console.error("Error loading gastronomía:", error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <PageTransition>
      <SEOMeta {...PAGE_SEO.gastronomia} />
      <div className="min-h-screen bg-night-900 text-silver-300">
        <Navbar />

        <section className="relative overflow-hidden pt-24">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${pasteImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-night-900/70 to-night-900" />
          <div className="relative mx-auto max-w-6xl px-6 py-20">
            <h1 className="font-serif text-4xl text-gold-400">Gastronomía de Real del Monte</h1>
            <p className="mt-4 max-w-2xl text-silver-400">Descubre pastes, cafeterías y experiencias culinarias del Pueblo Mágico.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          {loading ? (
            <p className="text-silver-500">Cargando recomendaciones…</p>
          ) : businesses.length === 0 ? (
            <p className="text-silver-500">Aún no hay recomendaciones publicadas.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {businesses.map((business, index) => (
                <motion.article
                  key={business.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-silver-200">
                    <Utensils className="h-4 w-4 text-gold-400" />
                    {business.name}
                  </h2>
                  <p className="mb-3 text-sm text-silver-500">{business.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-silver-400">
                    <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{business.category}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Horario variable</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Centro histórico</span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
