import { motion } from "framer-motion";
import { Utensils, ChefHat, Coffee, Wine, Star, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import pasteImg from "@/assets/paste.webp";
import callesImg from "@/assets/calles-colonial.webp";

const pasteTypes = [
  {
    name: "Paste de Papa con Carne",
    origin: "Receta Original Cornish",
    description: "El clásico tradicional. Carne de res sazonada con especias, papas cortadas en cubos y un toque de pimienta negra, envuelto en masa hojaldre dorada.",
    isTraditional: true,
    rating: 4.9
  },
  {
    name: "Paste de Mole",
    origin: "Fusión Mexicano-Cornish",
    description: "Pollo desmenuzado bañado en mole poblano tradicional, una creación única que solo existe en Real del Monte.",
    isTraditional: false,
    rating: 4.8
  },
  {
    name: "Paste de Frijol con Queso",
    origin: "Tradición Local",
    description: "Frijoles bayos refritos con queso fresco, una opción vegetariana que rinde homenaje a los ingredientes mexicanos.",
    isTraditional: false,
    rating: 4.7
  },
  {
    name: "Paste de Pollo con Chipotle",
    origin: "Creación Contemporánea",
    description: "Pollo jugoso con salsa de chipotle ahumado, perfecto equilibrio entre picante y sabor.",
    isTraditional: false,
    rating: 4.6
  },
  {
    name: "Paste de Atún",
    origin: "Receta de los Mineros",
    description: "Atún con aceitunas, cebolla y pimiento, tradición que traían los ingleses de sus viajes marítimos.",
    isTraditional: true,
    rating: 4.5
  },
  {
    name: "Paste Dulce de Piña",
    origin: "Tradición Postrera",
    description: "Dulce de piña casero envuelto en masa, el favorito de los niños y perfecto para el café de la tarde.",
    isTraditional: false,
    rating: 4.8
  }
];

const restaurants = [
  {
    name: "Pastes El Portal",
    category: "Pastes Tradicionales",
    since: "Desde 1985",
    specialty: "Paste de Papa con Carne",
    description: "Los pastes más tradicionales de Real del Monte. Familia con más de 40 años de tradición pastelesa.",
    rating: 4.9,
    phone: "771 123 4567",
    location: "Portal del Comercio #15"
  },
  {
    name: "Café La Neblina",
    category: "Cafetería",
    since: "Desde 2010",
    specialty: "Café de altura y paste dulce",
    description: "Café artesanal cultivado en la región, acompañado de deliciosos postres tradicionales con vista al bosque.",
    rating: 4.7,
    phone: "771 234 5678",
    location: "Av. Hidalgo #42"
  },
  {
    name: "Mesón de la Abuela",
    category: "Cocina Regional",
    since: "Desde 1998",
    specialty: "Guisos mineros tradicionales",
    description: "Ambiente familiar con recetas transmitidas por generaciones de cocineras locales.",
    rating: 4.6,
    phone: "771 345 6789",
    location: "Callejón de la Cruz #8"
  },
  {
    name: "Barbacoa El Minero",
    category: "Barbacoa Estilo Hidalgo",
    since: "Desde 2005",
    specialty: "Barbacoa de borrego y consomé",
    description: "Auténtica barbacoa hidalguense preparada bajo tierra, tradición de los domingos familiares.",
    rating: 4.8,
    phone: "771 456 7890",
    location: "Carretera Real del Monte Km 3"
  }
];

const otherDishes = [
  {
    name: "Guiso de Res Minero",
    description: "Carne de res cocida lentamente con verduras de la región, servida con arroz y frijoles."
  },
  {
    name: "Truchas al Ajillo",
    description: "Truchas frescas de las granjas locales preparadas al ajillo con hierbas de olor."
  },
  {
    name: "Quesos de Vaso",
    description: "Queso fresco tradicional de la región, acompañado de tortillas de comal."
  },
  {
    name: "Dulces Típicos",
    description: "Obleas de gajeta, jamoncillo, cocada y ate de frutas locales."
  }
];

const GastronomiaPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${pasteImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
          <div className="absolute inset-0 flex items-end pb-20">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium mb-4">
                  <Utensils className="w-4 h-4" />
                  Cuna del Paste en México
                </span>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
                  Gastronomía
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Descubre el único lugar en México donde la cocina cornish se fusionó con los sabores 
                  tradicionales hidalguenses, creando el icónico paste mexicano.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* History of Paste */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  La Historia del Paste
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Cuando los mineros de Cornualles, Inglaterra llegaron a Real del Monte en 1824, 
                    trajeron consigo una tradición gastronómica que cambiaría para siempre la cultura 
                    culinaria de la región: el <strong>Cornish Pasty</strong>.
                  </p>
                  <p>
                    Originalmente, el paste era la comida de trabajo perfecta para los mineros. Su 
                    característica forma de media luna con un grueso borde de masa permitía que los 
                    trabajadores sostuvieran su almuerzo con manos sucias de carbón y lo descartaran 
                    después, protegiendo el contenido de contaminación.
                  </p>
                  <p>
                    Con el tiempo, las familias mexicanas comenzaron a fusionar la receta original con 
                    ingredientes locales. Así nacieron versiones con mole, frijoles, chile y otros 
                    sabores típicamente mexicanos, creando un platillo único en el mundo que solo 
                    existe en Real del Monte.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gold/10">
                    <div className="text-2xl font-bold text-gold">200+</div>
                    <div className="text-xs text-muted-foreground">Años de historia</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gold/10">
                    <div className="text-2xl font-bold text-gold">50+</div>
                    <div className="text-xs text-muted-foreground">Variedades</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gold/10">
                    <div className="text-2xl font-bold text-gold">15</div>
                    <div className="text-xs text-muted-foreground">Pastelerías</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src={pasteImg}
                  alt="Paste tradicional de Real del Monte"
                  className="rounded-2xl shadow-elevated"
                />
                <div className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-lg max-w-xs">
                  <div className="flex items-center gap-2 text-gold mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">Dato Curioso</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    El Museo del Paste en Real del Monte es el único en el mundo dedicado a esta delicia.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Paste Types */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Variedades de Paste
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Desde la receta original cornish hasta creaciones únicas de fusión mexicana
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pasteTypes.map((paste, index) => (
                <motion.div
                  key={paste.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                        {paste.name}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        paste.isTraditional 
                          ? "bg-gold/20 text-gold" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {paste.origin}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{paste.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {paste.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Restaurants */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Dónde Comer
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Los mejores lugares para disfrutar la gastronomía local
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                        {restaurant.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">{restaurant.category}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gold/10 text-gold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {restaurant.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <ChefHat className="w-4 h-4 text-terracotta" />
                      <span className="text-muted-foreground">Especialidad: </span>
                      <span className="font-medium text-foreground">{restaurant.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-terracotta" />
                      <span className="text-muted-foreground">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-terracotta" />
                      <span className="text-muted-foreground">{restaurant.since}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{restaurant.phone}</span>
                    <button className="px-4 py-2 rounded-lg bg-terracotta text-white text-sm font-medium hover:bg-terracotta/90 transition-colors">
                      Ver menú
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Dishes */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Otros Sabores de la Región
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Más delicias que no puedes dejar de probar
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {otherDishes.map((dish, index) => (
                <motion.div
                  key={dish.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-xl bg-background shadow-card"
                >
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{dish.name}</h3>
                    <p className="text-sm text-muted-foreground">{dish.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GastronomiaPage;
