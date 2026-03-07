import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PostCard from "@/components/PostCard";
import SectionHeader from "@/components/SectionHeader";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/VisualEffects";
import GradientSeparator from "@/components/GradientSeparator";
import { useCommunityPosts } from "@/lib/hooks";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

// Fallback data when API is not available
const fallbackPosts = [
  { id: '1', userName: 'María G.', userAvatar: 'M', content: 'El Panteón Inglés es un lugar impresionante, lleno de historia y misticismo. ¡Imperdible!', image: panteonImg, placeName: 'Panteón Inglés', likes: 24, comments: 5, timeAgo: 'hace 2 días' },
  { id: '2', userName: 'Carlos R.', userAvatar: 'C', content: 'Los pastes de Real del Monte son los mejores que he probado. La tradición minera inglesa vive en cada bocado.', image: pasteImg, placeName: 'Centro Histórico', likes: 42, comments: 8, timeAgo: 'hace 3 días' },
  { id: '3', userName: 'Ana L.', userAvatar: 'A', content: 'La Mina de Acosta es una experiencia única. Bajar a las profundidades y sentir la historia minera fue inolvidable.', image: minaImg, placeName: 'Mina de Acosta', likes: 31, comments: 12, timeAgo: 'hace 5 días' },
  { id: '4', userName: 'Pedro S.', userAvatar: 'P', content: 'Las Peñas Cargadas ofrecen una vista espectacular del pueblo entre la neblina. Naturaleza pura.', image: penasImg, placeName: 'Peñas Cargadas', likes: 19, comments: 3, timeAgo: 'hace 1 semana' },
  { id: '5', userName: 'Laura M.', userAvatar: 'L', content: 'Caminar por las calles coloniales de Real del Monte es como viajar en el tiempo. Arquitectura hermosa.', image: callesImg, placeName: 'Calles Coloniales', likes: 37, comments: 7, timeAgo: 'hace 1 semana' },
  { id: '6', userName: 'Diego F.', userAvatar: 'D', content: 'La niebla que envuelve el pueblo le da un toque mágico. Cada rincón tiene una historia que contar.', image: panteonImg, placeName: 'Real del Monte', likes: 28, comments: 4, timeAgo: 'hace 2 semanas' },
];

const Comunidad = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: apiPosts, isLoading } = useCommunityPosts();
  const posts = apiPosts && apiPosts.length > 0 ? apiPosts : fallbackPosts;

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />

        {/* Hero */}
        <div className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4"
            >
              Muro de Recuerdos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Experiencias compartidas por visitantes de Real del Monte
            </motion.p>
          </div>
        </div>

        {/* Posts Grid */}
        <section className="py-16 relative overflow-hidden">
          <motion.div className="absolute inset-0 -z-10" style={{ y: backgroundY }}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </motion.div>

          <div className="container mx-auto px-4 md:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any, i: number) => (
                  <StaggerItem key={post.id}>
                    <GlowCard>
                      <PostCard
                        userName={post.userName}
                        userAvatar={post.userAvatar || post.userName?.charAt(0) || '?'}
                        content={post.content}
                        image={post.image || post.imageUrl}
                        placeName={post.placeName}
                        likes={post.likes || 0}
                        comments={post.comments || 0}
                        timeAgo={post.timeAgo || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Reciente')}
                        index={i}
                      />
                    </GlowCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8"><GradientSeparator /></div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Comunidad;
