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

import { usePlaces } from "@/features/places";
import { useBusinesses } from "@/features/businesses";
import { useCommunityPosts } from "@/lib/hooks";
import { useEvents } from "@/features/events";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: places = [], isLoading: loadingPlaces } = usePlaces();
  const { data: businesses = [], isLoading: loadingBusinesses } = useBusinesses();
  const { data: posts = [], isLoading: loadingPosts } = useCommunityPosts();
  const { data: events = [], isLoading: loadingEvents } = useEvents();

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <HeroSection />

        {/* Places */}
        <section className="py-24 relative overflow-hidden">
          <motion.div className="absolute inset-0 -z-10" style={{ y: backgroundY }}>
            <div className="absolute inset-0 bg-cover bg-center opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </motion.div>
          <div className="container mx-auto px-4 md:px-8">
            <TextReveal>
              <SectionHeader title="Lugares Imperdibles" subtitle="Descubre los atractivos más emblemáticos de Real del Monte" linkTo="/lugares" />
            </TextReveal>
            {loadingPlaces ? (
              <p className="text-center text-muted-foreground">Cargando lugares...</p>
            ) : (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {places.map((place: any, i: number) => (
                  <StaggerItem key={place.id || place.name}>
                    <GlowCard><PlaceCard {...place} index={i} /></GlowCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8"><GradientSeparator /></div>
        <RoutesSection />
        <div className="container mx-auto px-4 md:px-8"><GradientSeparator /></div>
        <VideoGallery />
        <div className="container mx-auto px-4 md:px-8"><GradientSeparator /></div>

        {/* Businesses */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <TextReveal>
              <SectionHeader title="Directorio Local" subtitle="Negocios y servicios recomendados por la comunidad" linkTo="/directorio" />
            </TextReveal>
            {loadingBusinesses ? (
              <p className="text-center text-muted-foreground">Cargando negocios...</p>
            ) : (
              <StaggerContainer className="grid md:grid-cols-2 gap-6">
                {businesses.map((biz: any, i: number) => (
                  <StaggerItem key={biz.id || biz.name}>
                    <GlowCard><BusinessCard {...biz} index={i} /></GlowCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8"><GradientSeparator /></div>
        <ImageGallery />
        <div className="container mx-auto px-4 md:px-8"><GradientSeparator /></div>

        {/* Events */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <TextReveal>
              <SectionHeader title="Próximos Eventos" subtitle="Festivales, ferias y temporadas especiales" linkTo="/eventos" />
            </TextReveal>
            {loadingEvents ? (
              <p className="text-center text-muted-foreground">Cargando eventos...</p>
            ) : (
              <StaggerContainer className="grid md:grid-cols-3 gap-6">
                {events.map((event: any, i: number) => (
                  <StaggerItem key={event.id || event.name}>
                    <EventCard {...event} index={i} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* Community */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <TextReveal>
              <SectionHeader title="Muro de Recuerdos" subtitle="Experiencias compartidas por visitantes de Real del Monte" linkTo="/comunidad" />
            </TextReveal>
            {loadingPosts ? (
              <p className="text-center text-muted-foreground">Cargando publicaciones...</p>
            ) : (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any, i: number) => (
                  <StaggerItem key={post.id || post.userName}>
                    <PostCard
                      userName={post.userName}
                      userAvatar={post.userAvatar || post.userName?.charAt(0) || '?'}
                      content={post.content}
                      image={post.imageUrl}
                      placeName={post.placeName}
                      likes={post.likes || 0}
                      comments={post.comments || 0}
                      timeAgo={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Reciente'}
                      index={i}
                    />
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

export default Index;
