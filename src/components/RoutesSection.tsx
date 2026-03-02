import { motion } from "framer-motion";
import { Map, Compass, Utensils } from "lucide-react";

const routes = [
  {
    name: "Ruta del Paste",
    description: "Recorre las pastelerías más emblemáticas y prueba los mejores pastes del pueblo",
    icon: Utensils,
    stops: 6,
    duration: "2-3 hrs",
    color: "bg-gradient-warm",
  },
  {
    name: "Ruta Minas y Museos",
    description: "Descubre la historia minera, los túneles subterráneos y la herencia inglesa",
    icon: Compass,
    stops: 5,
    duration: "3-4 hrs",
    color: "bg-gradient-forest",
  },
  {
    name: "Ruta Familiar",
    description: "Aventura natural por Peñas Cargadas, bosques de niebla y miradores",
    icon: Map,
    stops: 4,
    duration: "4-5 hrs",
    color: "bg-gold",
  },
];

const RoutesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Rutas Sugeridas
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Recorridos diseñados para que no te pierdas lo mejor de Real del Monte
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {routes.map((route, i) => (
            <motion.div
              key={route.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group glass rounded-2xl p-6 shadow-card hover:shadow-elevated hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl ${route.color} flex items-center justify-center mb-4 shadow-warm group-hover:scale-110 transition-transform duration-300`}
              >
                <route.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {route.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {route.description}
              </p>
              <div className="separator-gradient mb-4" />
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-lg glass">{route.stops} paradas</span>
                <span className="px-2 py-1 rounded-lg glass">{route.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoutesSection;
