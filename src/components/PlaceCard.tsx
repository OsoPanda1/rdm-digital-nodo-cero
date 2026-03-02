import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

interface PlaceCardProps {
  name: string;
  category: string;
  description: string;
  image: string;
  rating?: number;
  index?: number;
}

const PlaceCard = ({ name, category, description, image, rating = 4.5, index = 0 }: PlaceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-card" />
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium tracking-wide uppercase">
            {category}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm">
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span className="text-xs font-medium text-foreground">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-1 mb-1">
          <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
          <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
            {name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default PlaceCard;
