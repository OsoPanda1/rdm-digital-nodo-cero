import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";

const allPlaces = [
  { name: "Mina de Acosta", category: "Mina", description: "Desciende 450 metros bajo tierra en esta mina del siglo XVIII. Recorre los túneles donde mineros ingleses y mexicanos forjaron la historia de la plata.", image: minaImg, rating: 4.8 },
  { name: "Panteón Inglés", category: "Museo", description: "Un cementerio único con cruces celtas entre pinos y neblina. Testimonio de la comunidad inglesa que llegó en el siglo XIX.", image: panteonImg, rating: 4.7 },
  { name: "Peñas Cargadas", category: "Naturaleza", description: "Formaciones rocosas gigantes en equilibrio imposible. Senderismo entre bosque de niebla con vistas panorámicas del valle.", image: penasImg, rating: 4.9 },
  { name: "Callejones Coloniales", category: "Cultura", description: "Calles empedradas con fachadas coloridas, balcones con flores y tiendas artesanales.", image: callesImg, rating: 4.6 },
  { name: "Plaza Principal", category: "Cultura", description: "El corazón del pueblo mágico. Punto de encuentro con vista a la Parroquia y rodeada de negocios locales.", image: heroImg, rating: 4.5 },
  { name: "Museo del Paste", category: "Museo", description: "Conoce la historia del paste, su origen inglés y cómo se convirtió en el platillo emblemático de Real del Monte.", image: pasteImg, rating: 4.6 },
];

const LugaresPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
              Lugares y Atractivos
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Descubre los rincones más emblemáticos de Real del Monte, desde minas históricas hasta bosques de niebla.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlaces.map((place, i) => (
              <PlaceCard key={place.name} {...place} index={i} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LugaresPage;
