import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { motion } from "framer-motion";

const events = [
  { name: "Festival Internacional del Paste", date: "12 Oct", time: "10:00 - 20:00", location: "Plaza Principal", description: "El festival gastronómico más importante con más de 50 variedades de pastes." },
  { name: "Día de Muertos en Real del Monte", date: "01 Nov", time: "18:00 - 23:00", location: "Panteón Inglés", description: "Celebración única que fusiona tradiciones mexicanas e inglesas." },
  { name: "Carrera de Montaña RDM", date: "25 Nov", time: "07:00 - 14:00", location: "Peñas Cargadas", description: "Trail running por bosques y formaciones rocosas." },
  { name: "Feria del Libro en la Montaña", date: "08 Dic", time: "09:00 - 18:00", location: "Casa de Cultura", description: "Encuentro literario con autores locales y nacionales." },
  { name: "Noche de Leyendas", date: "20 Dic", time: "20:00 - 23:00", location: "Centro Histórico", description: "Recorrido nocturno narrando las leyendas más famosas del pueblo." },
  { name: "Año Nuevo en la Montaña", date: "31 Dic", time: "21:00 - 01:00", location: "Plaza Principal", description: "Celebración comunitaria de fin de año con música en vivo." },
];

const EventosPage = () => {
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
              Eventos y Festivales
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Calendario de actividades culturales, festivales y temporadas especiales.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, i) => (
              <EventCard key={event.name} {...event} index={i} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventosPage;
