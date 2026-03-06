import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  Utensils, ChefHat, Coffee, Wine, Star, Clock, MapPin, Flame,
  Heart, BookOpen, Leaf, Wheat, Beef, Fish, Apple, Croissant,
  History, Users, Award, Sparkles, ArrowRight, GlassWater
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { TextReveal, ParallaxImage, StaggerContainer, StaggerItem, GlowCard } from "@/components/VisualEffects";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageGallery } from "@/components/ImageGallery";

// Assets
import pasteImg from "@/assets/paste.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";
import rdm3 from "@/assets/rdm01.jpg";
import rdm4 from "@/assets/rdm02.jpg";

// Extended paste varieties
const pasteVarieties = [
  {
    name: "Paste de Papa con Carne",
    origin: "Receta Original Cornish",
    description: "El clásico tradicional que inició todo. Carne de res sazonada con especies inglesas, papas cortadas en cubos perfectos, cebolla caramelizada y un toque de pimienta negra molida. La masa hojaldre dorada crujiente completa la experiencia.",
    isTraditional: true,
    difficulty: "Media",
    preparationTime: "45 min",
    ingredients: ["Carne de res molida", "Papas", "Cebolla", "Pimienta negra", "Especias inglesas", "Mantequilla", "Harina"],
    history: "Esta receta fue traída directamente desde Cornualles en 1824. Los mineros la consumían diariamente como su almuerzo completo."
  },
  {
    name: "Paste de Mole",
    origin: "Fusión Mexicano-Cornish",
    description: "Pollo desmenuzado bañado en mole poblano tradicional, con un toque de chocolate y chile. Es una creación única que solo existe en Real del Monte, resultado de la fusión perfecta entre dos culturas.",
    isTraditional: false,
    difficulty: "Alta",
    preparationTime: "60 min",
    ingredients: ["Pollo desmenuzado", "Mole poblano", "Chocolate", "Especias", "Masa especial"],
    history: "Creado en la década de 1850 cuando las cocineras mexicanas comenzaron a experimentar con la receta cornish original."
  },
  {
    name: "Paste de Frijol con Queso",
    origin: "Tradición Local",
    description: "Frijoles bayos refritos sazonados con hierbas de olor, combinados con queso fresco local. Una opción vegetariana deliciosa que rinde homenaje a los ingredientes más mexicanos.",
    isTraditional: false,
    difficulty: "Baja",
    preparationTime: "40 min",
    ingredients: ["Frijoles bayos", "Queso fresco", "Cebolla", "Ajo", "Epazote", "Masa"],
    history: "Desarrollado durante la Revolución Mexicana como alternativa económica cuando la carne era escasa."
  },
  {
    name: "Paste de Pollo con Chipotle",
    origin: "Creación Contemporánea",
    description: "Pollo jugoso marinado en salsa de chipotle ahumado, con un equilibrio perfecto entre picante y sabor. Ideal para quienes disfrutan de un toque de calor en su comida.",
    isTraditional: false,
    difficulty: "Media",
    preparationTime: "45 min",
    ingredients: ["Pollo", "Chipotle", "Crema", "Cebolla", "Ajo", "Masa"],
    history: "Innovación de las nuevas generaciones de pasteleros que buscan fusionar tradición con sabores modernos."
  },
  {
    name: "Paste de Atún",
    origin: "Receta de los Mineros del Mar",
    description: "Atún de conserva mezclado con aceitunas, cebolla morada, pimiento y hierbas provenzales. Una tradición que traían los mineros cornish de sus viajes marítimos desde Inglaterra.",
    isTraditional: true,
    difficulty: "Baja",
    preparationTime: "35 min",
    ingredients: ["Atún", "Aceitunas", "Cebolla morada", "Pimiento", "Hierbas provenzales", "Masa"],
    history: "Receta auténtica de Cornualles, adaptada con ingredientes locales disponibles en la Sierra de Pachuca."
  },
  {
    name: "Paste Dulce de Piña",
    origin: "Tradición Postrera",
    description: "Dulce de piña casero, cocido lentamente con canela y clavo, envuelto en masa. El favorito de los niños y el acompañamiento perfecto para el café de la tarde.",
    isTraditional: false,
    difficulty: "Media",
    preparationTime: "50 min",
    ingredients: ["Piña", "Azúcar", "Canela", "Clavo", "Masa dulce"],
    history: "Inspirado en los pasteles de frutas ingleses, pero usando la abundante piña de la región."
  },
  {
    name: "Paste de Rajas con Queso",
    origin: "Fusión Crema",
    description: "Chiles poblanos asados en tiras, combinados con queso Oaxaca derretido y un toque de crema. Una delicia que equilibra el picante suave con la cremosidad del queso.",
    isTraditional: false,
    difficulty: "Media",
    preparationTime: "45 min",
    ingredients: ["Chiles poblanos", "Queso Oaxaca", "Crema", "Cebolla", "Elote", "Masa"],
    history: "Variante creada en la década de 1960 que se ha convertido en una de las favoritas locales."
  },
  {
    name: "Paste de Barbacoa",
    origin: "Tradición Hidalguense",
    description: "Carne de borrego estilo barbacoa, cocida bajo tierra según la tradición hidalguense. Un tributo a la rica tradición gastronómica de la región.",
    isTraditional: false,
    difficulty: "Alta",
    preparationTime: "90 min",
    ingredients: ["Carne de borrego", "Hojas de maguey", "Chiles", "Especias", "Masa especial"],
    history: "Fusión reciente que honra la famosa barbacoa de Hidalgo dentro del formato icónico del paste."
  }
];

// Other traditional dishes
const traditionalDishes = [
  {
    name: "Guiso de Res Minero",
    category: "Plato Fuerte",
    description: "Carne de res cocida lentamente con verduras de la región, servida con arroz rojo y frijoles de la olla. Este guiso era el alimento principal de los mineros después de una jornada bajo tierra.",
    history: "Receta que ha pasado por generaciones de familias mineras. Cada hogar tiene su versión secreta.",
    season: "Todo el año"
  },
  {
    name: "Truchas al Ajillo",
    category: "Plato Fuerte",
    description: "Truchas frescas de las granjas locales preparadas al ajillo con abundante ajo, mantequilla y hierbas de olor. Servidas con ensalada de la huerta.",
    history: "Las truchas fueron introducidas en la región en la década de 1940 y se han convertido en un producto local emblemático.",
    season: "Todo el año"
  },
  {
    name: "Quesos de Vaso",
    category: "Entrada",
    description: "Queso fresco tradicional de la región, servido en vasos de barro con tortillas de comal calientitas. Acompañado de salsa martajada.",
    history: "Técnica de elaboración traída por españoles y adaptada con leche de ganado local de la sierra.",
    season: "Todo el año"
  },
  {
    name: "Sopa de Medulas",
    category: "Sopa",
    description: "Sopa tradicional hecha con médula de res, verduras y especias. Conocida como 'el sustento de los mineros' por su alto contenido nutritivo.",
    history: "Los médicos de la época minera recomendaban esta sopa para fortalecer a los trabajadores.",
    season: "Invierno"
  },
  {
    name: "Mole de Olla",
    category: "Plato Fuerte",
    description: "Sustancioso guiso con carne de res, verduras de la región y un caldo espesado con chile guajillo. Servido con arroz y frijoles.",
    history: "Variante regional del tradicional mole de olla mexicano, con ingredientes propios de la sierra.",
    season: "Invierno"
  },
  {
    name: "Cecina de la Sierra",
    category: "Entrada",
    description: "Carne de res finamente sazonada y secada al sol de la sierra. Se sirve enrollada con queso fresco y aguacate.",
    history: "Técnica de conservación de carne adaptada al clima de altura de Real del Monte.",
    season: "Todo el año"
  }
];

// Sweets and desserts
const sweetsAndDesserts = [
  {
    name: "Obleas de Gajeta",
    description: "Delgadas obleas rellenas de gajeta (dulce de leche espeso). Crujientes por fuera, cremosas por dentro.",
    origin: "Tradición Colonial"
  },
  {
    name: "Jamoncillo",
    description: "Dulce de leche cuajado, cortado en rombos y espolvoreado con canela. Similar al fudge inglés pero con sabor mexicano.",
    origin: "Fusión Mexicano-Española"
  },
  {
    name: "Cocada",
    description: "Dulce de coco con leche condensada, horneado hasta dorarse. Existen versiones blandas y crocantes.",
    origin: "Tradición Local"
  },
  {
    name: "Ate de Membrillo",
    description: "Dulce de pasta hecho con membrillos de la región. Se sirve con queso fresco como postre clásico.",
    origin: "Tradición Española"
  },
  {
    name: "Buñuelos de Viento",
    description: "Masa frita esponjosa, espolvoreada con azúcar y canela. Tradicionales en época navideña.",
    origin: "Tradición Colonial"
  },
  {
    name: "Dulce de Calabaza",
    description: "Calabaza de castilla cocida en piloncillo con canela y clavo. Típico de las festividades de Día de Muertos.",
    origin: "Tradición Indígena-Mestiza"
  }
];

// Beverages
const beverages = [
  {
    name: "Café de Altura",
    description: "Café arábiga cultivado en las zonas altas de la Sierra de Pachuca, entre 1,800 y 2,200 metros de altitud. Tostado artesanalmente en el pueblo.",
    characteristics: "Cuerpo medio, acidez brillante, notas de chocolate y frutos secos",
    pairing: "Ideal con paste dulce de piña"
  },
  {
    name: "Chocolate Atole",
    description: "Bebida prehispánica hecha con maíz, chocolate, canela y piloncillo. Espesa y reconfortante, perfecta para las mañanas frías.",
    characteristics: "Textura cremosa, sabor intenso a chocolate y canela",
    pairing: "Tradicionalmente acompaña pan recién hecho"
  },
  {
    name: "Agua de Horchata",
    description: "Bebida refrescante hecha con arroz, canela y azúcar. La versión local incluye un toque de vainilla.",
    characteristics: "Dulce, cremosa, altamente refrescante",
    pairing: "Perfecta para acompañar paste picante"
  },
  {
    name: "Pulque Natural",
    description: "Bebida prehispánica fermentada del maguey. Servido natural o en curados con frutas de la región.",
    characteristics: "Sabor ácido, viscoso, bajo contenido alcohólico",
    pairing: "Tradicional con guisos mineros"
  },
  {
    name: "Agua de Jamaica",
    description: "Infusión fría de flor de jamaica con un toque de limón. Color rojo intenso y sabor refrescante.",
    characteristics: "Tartamudez, ligeramente dulce, muy refrescante",
    pairing: "Complementa perfectamente paste de barbacoa"
  }
];

// Gastronomic history timeline
const gastronomicHistory = [
  {
    year: "1824",
    event: "Llegada del Cornish Pasty",
    description: "Los mineros cornish traen la receta original del paste, que se convierte en su alimento diario bajo tierra."
  },
  {
    year: "1850",
    event: "Primera Pastelería Formal",
    description: "Se establece la primera pastelería dedicada exclusivamente a la venta de pastes, marcando el inicio de la industria pastelesa local."
  },
  {
    year: "1880",
    event: "Fusión de Sabores",
    description: "Las cocineras mexicanas comienzan a experimentar con rellenos locales como el mole y los frijoles, creando nuevas variedades."
  },
  {
    year: "1950",
    event: "Reconocimiento Nacional",
    description: "Los pastes de Real del Monte ganan reconocimiento nacional como patrimonio gastronómico único de México."
  },
  {
    year: "2005",
    event: "Museo del Paste",
    description: "Inauguración del único museo en México dedicado exclusivamente a la historia del paste."
  },
  {
    year: "2024",
    event: "Bicentenario del Paste",
    description: "Celebración de 200 años de historia pastelesa con eventos internacionales y el reconocimiento como Patrimonio Cultural Inmaterial."
  }
];

// Images
const gastronomyImages = [
  { src: pasteImg, alt: "Pastes Tradicionales", caption: "La variedad de pastes es infinita" },
  { src: callesImg, alt: "Cocina Tradicional", caption: "Cocina realizada con técnicas ancestrales" },
  { src: heroImg, alt: "Ingredientes Locales", caption: "Productos frescos de la región" },
];

const GastronomiaPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        
        {/* Hero Section */}
        <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
          <motion.div 
            className="absolute inset-0 -z-10"
            style={{ y: backgroundY }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
              style={{ backgroundImage: `url(${pasteImg})` }}
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl"
              >
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium mb-6 backdrop-blur-sm"
                >
                  <Utensils className="w-4 h-4" />
                  Cuna del Paste en México
                </motion.span>
                
                <TextReveal>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[1.1]">
                    Gastronomía{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-terracotta to-gold">
                      Realmontense
                    </span>
                  </h1>
                </TextReveal>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
                >
                  Descubre el único lugar en México donde la cocina cornish se fusionó con los sabores 
                  tradicionales hidalguenses, creando el icónico paste mexicano y una gastronomía 
                  única en el mundo.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  <Button size="lg" className="bg-gold hover:bg-gold/90 text-white rounded-full px-8">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Historia del Paste
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-2">
                    <Utensils className="w-4 h-4 mr-2" />
                    Variedades de Paste
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Descubre</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
            </motion.div>
          </motion.div>
        </div>

        {/* Introduction Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "200+", label: "Años de tradición pastelesa" },
                { value: "50+", label: "Variedades de paste" },
                { value: "15+", label: "Familias pastelesas tradicionales" },
                { value: "1", label: "Museo del Paste en México" },
              ].map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-serif font-bold text-gold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* History of Paste */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-gold text-sm font-medium uppercase tracking-wider">Historia</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                  La Historia del Paste
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Cuando los mineros de Cornualles, Inglaterra llegaron a Real del Monte en 1824, 
                    trajeron consigo una tradición gastronómica que cambiaría para siempre la cultura 
                    culinaria de la región: el <strong className="text-foreground">Cornish Pasty</strong>.
                  </p>
                  <p>
                    Originalmente, el paste era la comida de trabajo perfecta para los mineros. Su 
                    característica forma de media luna con un grueso borde de masa permitía que los 
                    trabajadores sostuvieran su almuerzo con manos sucias de carbón y lo descartaran 
                    después, protegiendo el contenido de contaminación. El borde grueso servía como 
                    mango comestible.
                  </p>
                  <p>
                    Con el tiempo, las familias mexicanas comenzaron a fusionar la receta original con 
                    ingredientes locales. Así nacieron versiones con mole, frijoles, chile y otros 
                    sabores típicamente mexicanos, creando un platillo único en el mundo que solo 
                    existe en Real del Monte.
                  </p>
                  <p>
                    Hoy, el paste es reconocido como Patrimonio Cultural Inmaterial de Hidalgo y es 
                    el platillo más emblemático del pueblo. Cada año, el Festival Internacional del Paste 
                    atrae a miles de visitantes que vienen a degustar las más de 50 variedades que 
                    existen.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gold/10">
                    <div className="text-2xl font-bold text-gold">1824</div>
                    <div className="text-xs text-muted-foreground">Año de llegada</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gold/10">
                    <div className="text-2xl font-bold text-gold">50+</div>
                    <div className="text-xs text-muted-foreground">Variedades</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gold/10">
                    <div className="text-2xl font-bold text-gold">15</div>
                    <div className="text-xs text-muted-foreground">Generaciones</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <ParallaxImage src={pasteImg} alt="Historia del Paste" />
                
                {/* History timeline overlay */}
                <div className="absolute -bottom-8 -right-8 bg-background p-6 rounded-2xl shadow-elevated max-w-sm">
                  <h4 className="font-serif font-bold text-foreground mb-4">Línea del Tiempo</h4>
                  <div className="space-y-3">
                    {gastronomicHistory.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="font-bold text-gold shrink-0">{item.year}</span>
                        <span className="text-muted-foreground">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Paste Varieties */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-terracotta text-sm font-medium uppercase tracking-wider">Variedades</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                El Mundo del Paste
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Desde el tradicional de papa con carne hasta creaciones innovadoras, 
                descubre la increíble variedad de sabores que ofrece Real del Monte
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {pasteVarieties.map((paste, index) => (
                <motion.div
                  key={paste.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlowCard>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {paste.isTraditional && (
                              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium">
                                Tradicional
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                              {paste.difficulty}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl font-bold text-foreground">
                            {paste.name}
                          </h3>
                          <p className="text-sm text-gold">{paste.origin}</p>
                        </div>
                        <div className="text-right">
                          <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">{paste.preparationTime}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {paste.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {paste.ingredients.slice(0, 4).map((ingredient, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {paste.ingredients.length > 4 && (
                          <span className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
                            +{paste.ingredients.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground/80">
                          <History className="w-3 h-3 inline mr-1" />
                          {paste.history}
                        </p>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Traditional Dishes */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">Cocina Regional</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Más Allá del Paste
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                La gastronomía de Real del Monte incluye una rica variedad de platillos tradicionales 
                que reflejan la herencia minera y la abundancia de la sierra
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
              {traditionalDishes.map((dish, index) => (
                <AccordionItem key={index} value={`dish-${index}`} className="glass rounded-2xl border-0 px-6">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-gold flex items-center justify-center shrink-0">
                        <Utensils className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground">{dish.name}</h3>
                        <p className="text-sm text-muted-foreground">{dish.category}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="pl-16 space-y-3">
                      <p className="text-muted-foreground leading-relaxed">{dish.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-terracotta">
                          <strong>Temporada:</strong> {dish.season}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/70 pt-3 border-t border-border">
                        <strong>Historia:</strong> {dish.history}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Sweets and Beverages */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium uppercase tracking-wider">Dulces y Bebidas</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Para Endulzar la Experiencia
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Sweets */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-gold" />
                  Dulces Tradicionales
                </h3>
                <div className="space-y-4">
                  {sweetsAndDesserts.map((sweet, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <Croissant className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{sweet.name}</h4>
                        <p className="text-sm text-muted-foreground">{sweet.description}</p>
                        <span className="text-xs text-gold">{sweet.origin}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Beverages */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Coffee className="w-6 h-6 text-terracotta" />
                  Bebidas de la Región
                </h3>
                <div className="space-y-4">
                  {beverages.map((beverage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center shrink-0">
                        <GlassWater className="w-5 h-5 text-terracotta" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{beverage.name}</h4>
                        <p className="text-sm text-muted-foreground">{beverage.description}</p>
                        <p className="text-xs text-terracotta mt-1">
                          <strong>Maridaje:</strong> {beverage.pairing}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Art of Making Paste */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <ParallaxImage src={callesImg} alt="El Arte del Paste" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <span className="text-gold text-sm font-medium uppercase tracking-wider">Proceso</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                  El Arte de Hacer Paste
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    La elaboración del paste es un verdadero arte que requiere años de práctica para 
                    dominar. Cada familia pastelesa guarda celosamente sus secretos, transmitidos de 
                    generación en generación.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">La Masa</h4>
                        <p className="text-sm">Preparada con harina de trigo, manteca vegetal, agua y una pizca de sal. Debe amasarse hasta alcanzar la elasticidad perfecta.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">El Relleno</h4>
                        <p className="text-sm">Cada receta tiene sus proporciones exactas. Los ingredientes deben cortarse uniformemente para cocinarse parejo.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">El Repujado</h4>
                        <p className="text-sm">El característico borde se hace doblando la masa sobre sí misma, creando el sello distintivo que identifica a cada pastelería.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">El Horneado</h4>
                        <p className="text-sm">Horneados en hornos tradicionales de piedra a temperatura precisa hasta dorar la masa perfectamente.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-terracotta text-sm font-medium uppercase tracking-wider">Galería</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Una Fiesta para los Sentidos
              </h2>
            </motion.div>

            <ImageGallery />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-terracotta/10" />
          <div className="container mx-auto px-4 md:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Saborea la Historia de Real del Monte
              </h2>
              <p className="text-muted-foreground mb-8">
                Cada bocado de paste es una experiencia que conecta con más de 200 años de historia. 
                Visita Real del Monte y descubre por qué esta tradición gastronómica es única en el mundo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-white rounded-full px-8">
                  <MapPin className="w-4 h-4 mr-2" />
                  Planificar Visita Gastronómica
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 border-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Recetas Tradicionales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GastronomiaPage;
