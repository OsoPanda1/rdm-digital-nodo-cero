import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

const posts = [
  { userName: "María García", userAvatar: "MG", content: "¡Increíble visita a la Mina de Acosta! Bajar 450 metros bajo tierra fue una experiencia única. 🏔️⛏️", image: minaImg, placeName: "Mina de Acosta", likes: 24, comments: 5, timeAgo: "Hace 2 horas" },
  { userName: "Carlos Hernández", userAvatar: "CH", content: "Los mejores pastes que he probado. El de mole es una obra maestra. 🥟❤️", image: pasteImg, placeName: "Pastes El Portal", likes: 18, comments: 3, timeAgo: "Hace 5 horas" },
  { userName: "Ana López", userAvatar: "AL", content: "Peñas Cargadas entre la niebla es mágico. Las rocas parecen de otro planeta. 🌫️🪨", image: penasImg, placeName: "Peñas Cargadas", likes: 31, comments: 8, timeAgo: "Ayer" },
  { userName: "Roberto Sánchez", userAvatar: "RS", content: "El Panteón Inglés es uno de los lugares más atmosféricos que he visitado.", image: panteonImg, placeName: "Panteón Inglés", likes: 15, comments: 4, timeAgo: "Hace 2 días" },
  { userName: "Laura Méndez", userAvatar: "LM", content: "Las calles de Real del Monte son pura magia. Cada esquina es una postal.", image: callesImg, placeName: "Centro Histórico", likes: 42, comments: 12, timeAgo: "Hace 3 días" },
  { userName: "Diego Torres", userAvatar: "DT", content: "Primer viaje a Real del Monte y ya estoy planeando el segundo.", image: minaImg, placeName: "Real del Monte", likes: 27, comments: 6, timeAgo: "Hace 4 días" },
];

const ComunidadPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Muro de Recuerdos</h1>
              <p className="text-muted-foreground max-w-lg">Experiencias, fotos y recuerdos compartidos por visitantes de Real del Monte.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.userName + i} {...post} index={i} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ComunidadPage;
