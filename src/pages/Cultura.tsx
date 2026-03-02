import { motion } from "framer-motion";
import { Music, Palette, Calendar, Users, Sparkles, Camera } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import callesImg from "@/assets/calles-colonial.webp";
import panteonImg from "@/assets/panteon-ingles.webp";

const festivals = [
  {
    name: "Festival Internacional del Paste",
    month: "Octubre",
    description: "El evento gastronómico más importante del año. Más de 50 expositores, concursos de pastes, música en vivo y actividades para toda la familia.",
    activities: ["Concurso de pastes", "Música tradicional", "Talleres culturales", "Exposición de artesanías"]
  },
  {
    name: "Día de Muertos en el Panteón Inglés",
    month: "Noviembre",
    description: "Única celebración que fusiona tradiciones mexicanas con rituales anglicanos. Velas, flores de cempasúchil y rezos en un ambiente mágico entre la neblina.",
    activities: ["Ofrendas biculturales", "Recorridos nocturnos", "Misa anglicana", "Conteo de leyendas"]
  },
  {
    name: "Semana Santa Minera",
    month: "Marzo/Abril",
    description: "Procesiones que recorren las calles empedradas del centro histórico, representando la pasión de Cristo con elementos de la tradición minera.",
    activities: ["Procesión del Silencio", "Representaciones teatrales", "Conciertos sacros", "Visitas guiadas"]
  },
  {
    name: "Feria de la Plata",
    month: "Agosto",
    description: "Celebración del metal que dio origen al pueblo. Exposición de joyería, minerales, competencias y eventos académicos sobre la minería.",
    activities: ["Exposición de minerales", "Concurso de joyería", "Conferencias mineras", "Fuegos artificiales"]
  }
];

const traditions = [
  {
    title: "Música de Viento",
    description: "Las bandas de viento son parte esencial de cualquier celebración en Real del Monte. Herencia de las bandas mineras que animaban las fiestas de los trabajadores.",
    icon: Music
  },
  {
    title: "Danzas Tradicionales",
    description: "El ballet folclórico local preserva danzas que cuentan la historia de la minería, la llegada de los ingleses y la vida en la sierra.",
    icon: Users
  },
  {
    title: "Teatro Regional",
    description: "Obras que representan la vida cotidiana de los mineros, las historias de amor entre ingleses y mexicanas, y las leyendas del pueblo.",
    icon: Sparkles
  },
  {
    title: "Pintura y Escultura",
    description: "Artistas locales capturan la belleza del paisaje montañoso, la arquitectura colonial y la vida minera en sus obras.",
    icon: Palette
  },
  {
    title: "Fotografía Documental",
    description: "El pueblo ha sido escenario de numerosas producciones cinematográficas y fotográficas que buscan capturar su atmósfera única.",
    icon: Camera
  },
  {
    title: "Calendario Ceremonial",
    description: "A lo largo del año, diversas festividades marcan el ritmo de la vida comunitaria, desde celebraciones religiosas hasta eventos civicos.",
    icon: Calendar
  }
];

const CulturaPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${callesImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
          <div className="absolute inset-0 flex items-end pb-20">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                  <Palette className="w-4 h-4" />
                  Tradición Viva
                </span>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
                  Cultura y Tradiciones
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Un mosaico cultural donde las tradiciones mexicanas se entrelazan con las costumbres 
                  cornish, creando una identidad única en el mundo.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Festivals */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Festivales y Eventos Anuales
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Celebraciones que marcan el ritmo de la vida en Real del Monte
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {festivals.map((festival, index) => (
                <motion.div
                  key={festival.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider mb-2">
                        {festival.month}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {festival.name}
                      </h3>
                    </div>
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {festival.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {festival.activities.map((activity) => (
                      <span 
                        key={activity}
                        className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Traditions Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Expresiones Culturales
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Las artes y tradiciones que dan vida a este Pueblo Mágico
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {traditions.map((tradition, index) => (
                <motion.div
                  key={tradition.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group glass rounded-2xl p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <tradition.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                    {tradition.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tradition.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cultural Quote */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              <img 
                src={panteonImg}
                alt="Cultura Real del Monte"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="max-w-2xl text-center text-white"
                >
                  <blockquote className="font-serif text-2xl md:text-3xl italic leading-relaxed mb-6">
                    "En Real del Monte, cada calle cuenta una historia, cada piedra guarda un secreto, 
                    y cada habitante es guardian de una tradición que une dos mundos."
                  </blockquote>
                  <p className="text-white/70">
                    — Maestros artesanos del pueblo
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default CulturaPage;
