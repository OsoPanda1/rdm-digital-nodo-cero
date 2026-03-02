import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventCardProps {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  index?: number;
}

const EventCard = ({ name, date, time, location, description, index = 0 }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-4 p-4 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer"
    >
      {/* Date badge */}
      <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-warm flex flex-col items-center justify-center text-primary-foreground">
        <span className="text-lg font-bold font-serif leading-none">
          {date.split(" ")[0]}
        </span>
        <span className="text-[10px] uppercase tracking-wide leading-tight mt-0.5">
          {date.split(" ")[1]}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-base font-semibold text-foreground truncate">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
