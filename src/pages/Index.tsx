import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import SectionHeader from "@/components/SectionHeader";
import PlaceCard from "@/components/PlaceCard";
import BusinessCard from "@/components/BusinessCard";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import RoutesSection from "@/components/RoutesSection";
import VideoGallery from "@/components/VideoGallery";
import ImageGallery from "@/components/ImageGallery";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/VisualEffects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientSeparator from "@/components/GradientSeparator";
import PageTransition from "@/components/PageTransition";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";
import rdm3 from "@/assets/rdm01.jpg";
import rdm4 from "@/assets/rdm02.jpg";

const places = [
  { name: "Mina de Acosta", category: "Mina", description: "Desciende 450 metros bajo tierra en esta mina del siglo XVIII. Recorre los túneles donde mineros ingleses y mexicanos forjaron la historia de la plata.", image: minaImg, rating: 4.8 },
  { name: "Panteón Inglés", category: "Museo", description: "Un cementerio único con cruces celtas entre pinos y neblina. Testimonio de la comunidad inglesa que llegó en el siglo XIX.", image: panteonImg, rating: 4.7 },
  { name: "Peñas Cargadas", category: "Naturaleza", description: "Formaciones rocosas gigantes en equilibrio imposible. Senderismo entre bosque de niebla con vistas panorámicas del valle.", image: penasImg, rating: 4.9 },
  { name: "Callejones Coloniales", category: "Cultura", description: "Calles empedradas con fachadas coloridas, balcones con flores y tiendas artesanales. El corazón vivo del pueblo mágico.", image: callesImg, rating: 4.6 },
  { name: "Plaza Principal", category: "Cultura", description: "El corazón del pueblo mágico con la Parroquia de la Asunción y el Kiosco de la Independencia.", image: rdm1, rating: 4.5 },
  { name: "Museo del Paste", category: "Museo", description: "Conoce la historia del paste, su origen inglés y cómo se convirtió en el platillo emblemático de Real del Monte.", image: rdm2, rating: 4.6 },
];

const businesses = [
  { name: "Pastes El Portal", category: "Pastes", description: "Los pastes más tradicionales de Real del Monte desde 1985.", image: pasteImg, isPremium: true, rating: 4.9, phone: "771 123 4567" },
  { name: "Hotel Real de Minas", category: "Hospedaje", description: "Hotel boutique en casona colonial restaurada con vista a la montaña.", image: callesImg, isPremium: true, rating: 4.7, phone: "771 234 5678" },
  { name: "Tours Mineros RDM", category: "Tours", description: "Recorridos guiados por las minas históricas con expertos en historia local.", image: minaImg, isPremium: false, rating: 4.5 },
  { name: "Café La Neblina", category: "Restaurante", description: "Café artesanal de altura con los mejores postres y vista al bosque.", image: rdm3, isPremium: false, rating: 4.4 },
  { name: "La Casa del Paste", category: "Pastes", description: "Variedades únicas de paste incluyendo mole, barbacoa y opciones dulces.", image: rdm4, isPremium: true, rating: 4.8 },
  { name: "Hostal Colonial", category: "Hospedaje", description: "Alojamiento económico en el centro histórico con ambiente acogedor.", image: rdm1, isPremium: false, rating: 4.3 },
];

const posts = [
  { userName: "María García", userAvatar: "MG", content: "¡Increíble visita a la Mina de Acosta! Bajar 450 metros bajo tierra fue una experiencia única. 🏔️⛏️", image: minaImg, placeName: "Mina de Acosta", likes: 24, comments: 5, timeAgo: "Hace 2 horas" },
  { userName: "Carlos Hernández", userAvatar: "CH", content: "Los mejores pastes que he probado en mi vida. El de mole es una obra maestra. 🥟❤️", image: pasteImg, placeName: "Pastes El Portal", likes: 18, comments: 3, timeAgo: "Hace 5 horas" },
  { userName: "Ana López", userAvatar: "AL", content: "Peñas Cargadas entre la niebla es mágico. Las formaciones rocosas parecen de otro planeta. 🌫️🪨", image: penasImg, placeName: "Peñas Cargadas", likes: 31, comments: 8, timeAgo: "Ayer" },
  { userName: "Roberto Díaz", userAvatar: "RD", content: "El Panteón Inglés al atardecer es una experiencia que no puedes perderte. Tan histórico y hermoso. 🌅", image: panteonImg, placeName: "Panteón Inglés", likes: 22, comments: 4, timeAgo: "Ayer" },
];

const events = [
  { name: "Festival Internacional del Paste", date: "12 Oct", time: "10:00 - 20:00", location: "Plaza Principal", description: "El festival gastronómico más importante del pueblo con más de 50 variedades de pastes." },
  { name: "Día de Muertos en Real del Monte", date: "01 Nov", time: "18:00 - 23:00", location: "Panteón Inglés", description: "Celebración única que fusiona tradiciones mexicanas e inglesas en el panteón histórico." },
  { name: "Carrera de Montaña RDM", date: "25 Nov", time: "07:00 - 14:00", location: "Peñas Cargadas", description: "Carrera de trail running por los bosques y formaciones rocosas del pueblo mágico." },
  { name: "Noche de Rábanos", date: "23 Dic", time: "16:00 - 22:00", location: "Plaza Principal", description: "Tradicional competencia de sculpture en rábanos illuminados." },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <HeroSection />

        {/* Places Section with Parallax Background */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated Background */}
          <motion.div 
            className="absolute inset-0 -z-10"
            style={{ y: backgroundY }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-5"
              style={{ backgroundImage: `url(${heroImg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </motion.div>

          <div className="container mx-auto px-4 md:px-8">
            <TextReveal>
              <SectionHeader 
                title="Lugares Imperdibles" 
                subtitle="Descubre los atractivos más emblemáticos de Real del Monte" 
                linkTo="/lugares" 
              />
            </TextReveal>
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {places.map((place, i) => (
                <StaggerItem key={place.name}>
                  <GlowCard>
                    <PlaceCard {...place} index={i} />
                  </GlowCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8">
          <GradientSeparator />
        </div>

        {/* Routes Section */}
        <RoutesSection />

        <div className="container mx-auto px-4 md:px-8">
          <GradientSeparator />
        </div>

        {/* Video Gallery - 6 videos */}
        <VideoGallery />

        <div className="container mx-auto px-4 md:px-8">
          <GradientSeparator />
        </div>

        {/* Directory Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <TextReveal>
              <SectionHeader 
                title="Directorio Local" 
                subtitle="Negocios y servicios recomendados por la comunidad" 
                linkTo="/directorio" 
              />
            </TextReveal>
            
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {businesses.map((biz, i) => (
                <StaggerItem key={biz.name}>
                  <GlowCard>
                    <BusinessCard {...biz} index={i} />
                  </GlowCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8">
          <GradientSeparator />
        </div>

        {/* Image Gallery - 25 images */}
        <ImageGallery />

        <div className="container mx-auto px-4 md:px-8">
          <GradientSeparator />
        </div>

        {/* Events Section */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[hsl(43,65%,52%)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[hsl(18,45%,48%)]/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <TextReveal>
              <SectionHeader 
                title="Próximos Eventos" 
                subtitle="Festivales, ferias y temporadas especiales" 
                linkTo="/eventos" 
              />
            </TextReveal>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <StaggerItem key={event.name}>
                  <EventCard {...event} index={i} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Community Feed */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <TextReveal>
              <SectionHeader 
                title="Muro de Recuerdos" 
                subtitle="Experiencias compartidas por visitantes de Real del Monte" 
                linkTo="/comunidad" 
              />
            </TextReveal>
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <StaggerItem key={post.userName}>
                  <PostCard {...post} index={i} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8">
          <GradientSeparator />
        </div>

        {/* Premium CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img 
              src={callesImg} 
              alt="Real del Monte" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(24,15%,15%)]/95 via-[hsl(24,15%,15%)]/80 to-[hsl(24,15%,15%)]/60" />
          </motion.div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[hsl(43,65%,52%)]/20 text-[hsl(43,65%,52%)] text-xs font-medium mb-6">
                ¿Eres comerciante?
              </span>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Únete al directorio digital de Real del Monte
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Llega a miles de turistas que visitan nuestro Pueblo Mágico cada año. 
                Planes desde $50 MXN/mes con visibilidad premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-premium">
                  Registrar mi negocio
                </button>
                <button className="btn-glass text-white border-white/20 hover:bg-white/10">
                  Conocer planes
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
