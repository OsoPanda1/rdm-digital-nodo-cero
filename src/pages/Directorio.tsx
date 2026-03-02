import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { motion } from "framer-motion";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import callesImg from "@/assets/calles-colonial.webp";

const businesses = [
  { name: "Pastes El Portal", category: "Pastes", description: "Los pastes más tradicionales desde 1985. Sabores clásicos y nuevas creaciones.", image: pasteImg, isPremium: true, rating: 4.9, phone: "771 123 4567" },
  { name: "Hotel Real de Minas", category: "Hospedaje", description: "Hotel boutique en casona colonial restaurada con vista a la montaña.", image: callesImg, isPremium: true, rating: 4.7, phone: "771 234 5678" },
  { name: "Tours Mineros RDM", category: "Tours", description: "Recorridos guiados por las minas históricas con expertos en historia local.", image: minaImg, isPremium: false, rating: 4.5 },
  { name: "Café La Neblina", category: "Restaurante", description: "Café artesanal de altura con los mejores postres y vista al bosque.", image: panteonImg, isPremium: false, rating: 4.4 },
  { name: "Artesanías del Monte", category: "Souvenir", description: "Artesanías locales, textiles y recuerdos auténticos hechos a mano.", image: callesImg, isPremium: true, rating: 4.6, phone: "771 345 6789" },
  { name: "Posada La Escondida", category: "Hospedaje", description: "Cabañas rústicas entre pinos con chimenea y desayuno incluido.", image: panteonImg, isPremium: false, rating: 4.3 },
];

const DirectorioPage = () => {
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
              Directorio de Negocios
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Comercios, hoteles, restaurantes y servicios recomendados por la comunidad.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {businesses.map((biz, i) => (
              <BusinessCard key={biz.name} {...biz} index={i} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DirectorioPage;
