import { motion } from "framer-motion";
import { Star, Phone, ExternalLink, Award } from "lucide-react";

interface BusinessCardProps {
  name: string;
  category: string;
  description: string;
  image: string;
  isPremium?: boolean;
  rating?: number;
  phone?: string;
  index?: number;
}

const BusinessCard = ({
  name,
  category,
  description,
  image,
  isPremium = false,
  rating = 4.2,
  phone,
  index = 0,
}: BusinessCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group flex gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
        isPremium
          ? "bg-card shadow-warm border border-primary/20 hover:shadow-elevated"
          : "bg-card shadow-card hover:shadow-elevated"
      }`}
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {isPremium && (
          <div className="absolute top-1 left-1">
            <Award className="w-4 h-4 text-gold drop-shadow" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-serif text-base font-semibold text-foreground truncate">
            {name}
          </h3>
          {isPremium && (
            <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wide shrink-0">
              Premium
            </span>
          )}
        </div>
        <span className="text-xs text-primary font-medium uppercase tracking-wide">
          {category}
        </span>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span className="text-xs">{phone}</span>
            </div>
          )}
          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessCard;
