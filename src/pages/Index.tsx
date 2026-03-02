import HeroSection from "@/components/HeroSection";
import SectionHeader from "@/components/SectionHeader";
import PlaceCard from "@/components/PlaceCard";
import BusinessCard from "@/components/BusinessCard";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import RoutesSection from "@/components/RoutesSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";

const places = [
  {
    name: "Mina de Acosta",
    category: "Mina",
    description: "Desciende 450 metros bajo tierra en esta mina del siglo XVIII. Recorre los túneles donde mineros ingleses y mexicanos forjaron la historia de la plata.",
    image: minaImg,
    rating: 4.8,
  },
  {
    name: "Panteón Inglés",
    category: "Museo",
    description: "Un cementerio único con cruces celtas entre pinos y neblina. Testimonio de la comunidad inglesa que llegó en el siglo XIX.",
    image: panteonImg,
    rating: 4.7,
  },
  {
    name: "Peñas Cargadas",
    category: "Naturaleza",
    description: "Formaciones rocosas gigantes en equilibrio imposible. Senderismo entre bosque de niebla con vistas panorámicas del valle.",
    image: penasImg,
    rating: 4.9,
  },
  {
    name: "Callejones Coloniales",
    category: "Cultura",
    description: "Calles empedradas con fachadas coloridas, balcones con flores y tiendas artesanales. El corazón vivo del pueblo mágico.",
    image: callesImg,
    rating: 4.6,
  },
];

const businesses = [
  {
    name: "Pastes El Portal",
    category: "Pastes",
    description: "Los pastes más tradicionales de Real del Monte desde 1985. Sabores clásicos y nuevas creaciones.",
    image: pasteImg,
    isPremium: true,
    rating: 4.9,
    phone: "771 123 4567",
  },
  {
    name: "Hotel Real de Minas",
    category: "Hospedaje",
    description: "Hotel boutique en casona colonial restaurada con vista a la montaña.",
    image: callesImg,
    isPremium: true,
    rating: 4.7,
    phone: "771 234 5678",
  },
  {
    name: "Tours Mineros RDM",
    category: "Tours",
    description: "Recorridos guiados por las minas históricas con expertos en historia local.",
    image: minaImg,
    isPremium: false,
    rating: 4.5,
  },
  {
    name: "Café La Neblina",
    category: "Restaurante",
    description: "Café artesanal de altura con los mejores postres y vista al bosque.",
    image: panteonImg,
    isPremium: false,
    rating: 4.4,
  },
];

const posts = [
  {
    userName: "María García",
    userAvatar: "MG",
    content: "¡Increíble visita a la Mina de Acosta! Bajar 450 metros bajo tierra fue una experiencia única. La historia que se respira en esos túneles es impresionante. 🏔️⛏️",
    image: minaImg,
    placeName: "Mina de Acosta",
    likes: 24,
    comments: 5,
    timeAgo: "Hace 2 horas",
  },
  {
    userName: "Carlos Hernández",
    userAvatar: "CH",
    content: "Los mejores pastes que he probado en mi vida. El de mole es una obra maestra. Real del Monte no decepciona nunca. 🥟❤️",
    image: pasteImg,
    placeName: "Pastes El Portal",
    likes: 18,
    comments: 3,
    timeAgo: "Hace 5 horas",
  },
  {
    userName: "Ana López",
    userAvatar: "AL",
    content: "Peñas Cargadas entre la niebla es mágico. Las formaciones rocosas parecen de otro planeta. Imperdible para los amantes del senderismo. 🌫️🪨",
    image: penasImg,
    placeName: "Peñas Cargadas",
    likes: 31,
    comments: 8,
    timeAgo: "Ayer",
  },
];

const events = [
  {
    name: "Festival Internacional del Paste",
    date: "12 Oct",
    time: "10:00 - 20:00",
    location: "Plaza Principal",
    description: "El festival gastronómico más importante del pueblo con más de 50 variedades de pastes.",
  },
  {
    name: "Día de Muertos en Real del Monte",
    date: "01 Nov",
    time: "18:00 - 23:00",
    location: "Panteón Inglés",
    description: "Celebración única que fusiona tradiciones mexicanas e inglesas en el panteón histórico.",
  },
  {
    name: "Carrera de Montaña RDM",
    date: "25 Nov",
    time: "07:00 - 14:00",
    location: "Peñas Cargadas",
    description: "Carrera de trail running por los bosques y formaciones rocosas del pueblo mágico.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Places */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="Lugares Imperdibles"
            subtitle="Descubre los atractivos más emblemáticos de Real del Monte"
            linkTo="/lugares"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place, i) => (
              <PlaceCard key={place.name} {...place} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Routes */}
      <RoutesSection />

      {/* Directory */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="Directorio Local"
            subtitle="Negocios y servicios recomendados por la comunidad"
            linkTo="/directorio"
          />
          <div className="grid md:grid-cols-2 gap-4">
            {businesses.map((biz, i) => (
              <BusinessCard key={biz.name} {...biz} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="Próximos Eventos"
            subtitle="Festivales, ferias y temporadas especiales"
            linkTo="/eventos"
          />
          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event, i) => (
              <EventCard key={event.name} {...event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Community Feed */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="Muro de Recuerdos"
            subtitle="Experiencias compartidas por visitantes de Real del Monte"
            linkTo="/comunidad"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post.userName} {...post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-forest">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent-foreground mb-4">
            ¿Tienes un negocio en Real del Monte?
          </h2>
          <p className="text-accent-foreground/70 max-w-lg mx-auto mb-8">
            Únete al directorio digital y llega a miles de turistas. Planes desde $50 MXN/mes.
          </p>
          <button className="px-8 py-3 rounded-xl bg-background text-foreground font-medium hover:bg-background/90 transition-colors shadow-elevated">
            Registrar mi negocio
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
