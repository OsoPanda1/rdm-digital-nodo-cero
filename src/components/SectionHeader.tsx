import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkText?: string;
}

const SectionHeader = ({ title, subtitle, linkTo, linkText = "Ver todo" }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between mb-8"
    >
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2 max-w-lg">{subtitle}</p>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          {linkText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </motion.div>
  );
};

export default SectionHeader;
