import { motion } from "framer-motion";
import { Clock, Pickaxe, Flag, Users, Ship, Church, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import callesImg from "@/assets/calles-colonial.webp";

const timeline = [
  {
    year: "1560",
    title: "Descubrimiento de la Plata",
    description: "Juan de Zúñiga y Juan de la Cruz descubren ricos yacimientos de plata en la Sierra de Pachuca, dando origen al Real de Minas de Pachuca.",
    icon: Pickaxe,
    color: "bg-terracotta"
  },
  {
    year: "1766",
    title: "Llegada de los Cornish",
    description: "Inmigrantes de Cornualles, Inglaterra llegan trayendo tecnología minera avanzada, steam engines y su cultura única que perdura hasta hoy.",
    icon: Ship,
    color: "bg-primary"
  },
  {
    year: "1824",
    title: "Independencia Económica",
    description: "Pedro Romero de Terreros compra las minas a la Corona Española, marcando una nueva era de prosperidad para el Distrito Minero.",
    icon: Flag,
    color: "bg-gold"
  },
  {
    year: "1850",
    title: "Auge del Paste",
    description: "Las pastelerías cornish-mexicanas se establecen, fusionando la receta del Cornish Pasty con ingredientes locales como el mole y frijol.",
    icon: BookOpen,
    color: "bg-forest"
  },
  {
    year: "1900",
    title: "Panteón Inglés",
    description: "Se consagra el Cementerio de los Anglicanos, hoy conocido como Panteón Inglés, el más alto del mundo a 2,700 metros sobre el nivel del mar.",
    icon: Church,
    color: "bg-terracotta"
  },
  {
    year: "2004",
    title: "Pueblo Mágico",
    description: "Real del Monte es nombrado Pueblo Mágico por su importancia histórica, cultural y arquitectónica única en México.",
    icon: Users,
    color: "bg-primary"
  }
];

const heritage = [
  {
    title: "Herencia Minera",
    description: "Real del Monte fue uno de los distritos mineros más importantes de la Nueva España y México. Las minas de Acosta, Dificultad y Cerro de San Cayetano produjeron toneladas de plata que financiaron guerras y construyeron naciones.",
    image: minaImg,
    stats: [
      { label: "Años de historia", value: "460+" },
      { label: "Minas históricas", value: "25+" },
      { label: "Toneladas de plata", value: "50K+" }
    ]
  },
  {
    title: "Legado Cornish",
    description: "La comunidad inglesa dejó una huella indeleble en Real del Monte. Sus técnicas mineras, arquitectura victoriana, tradiciones y sobre todo, el paste, se fusionaron con la cultura mexicana creando una identidad única.",
    image: panteonImg,
    stats: [
      { label: "Inmigrantes", value: "3,000+" },
      { label: "Familias", value: "150+" },
      { label: "Años de influencia", value: "258+" }
    ]
  },
  {
    title: "Arquitectura Colonial",
    description: "Las calles empedradas, casas con techos de teja roja, balcones de madera y jardines florales crean un ambiente que transporta al visitante al siglo XIX. El Centro Histórico está protegido por el INAH.",
    image: callesImg,
    stats: [
      { label: "Edificios históricos", value: "200+" },
      { label: "Manzanas", value: "12" },
      { label: "Año de fundación", value: "1560" }
    ]
  }
];

const HistoriaPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${minaImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
          <div className="absolute inset-0 flex items-end pb-20">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/20 text-terracotta text-sm font-medium mb-4">
                  <Clock className="w-4 h-4" />
                  Desde 1560
                </span>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
                  Historia de Real del Monte
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Más de 460 años de historia minera, donde la plata forjó no solo metales preciosos, 
                  sino una cultura única que fusiona lo mexicano con lo cornish.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Línea del Tiempo
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Los momentos que definieron la historia de este Pueblo Mágico
              </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-terracotta via-gold to-forest md:-translate-x-1/2" />
              
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start gap-8 mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`glass rounded-2xl p-6 ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} max-w-md`}>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground text-sm font-bold mb-3">
                        {item.year}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center md:mx-0">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Heritage Sections */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            {heritage.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center mb-24 last:mb-0 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {section.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {section.stats.map((stat) => (
                      <div key={stat.label} className="text-center p-4 rounded-xl bg-background shadow-card">
                        <div className="text-2xl font-bold text-terracotta">{stat.value}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <blockquote className="font-serif text-2xl md:text-3xl text-foreground italic leading-relaxed mb-6">
                "Real del Monte es el único lugar en México donde puedes sentir la presencia de dos culturas 
                que se fusionaron para crear algo verdaderamente mágico: la mexicana y la cornish."
              </blockquote>
              <cite className="text-muted-foreground not-italic">
                — Historiadores del Distrito Minero de Pachuca-Real del Monte
              </cite>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default HistoriaPage;
