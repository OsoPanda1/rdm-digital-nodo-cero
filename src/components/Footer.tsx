import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logoRdm from "@/assets/logo-rdm.png";
import GradientSeparator from "@/components/GradientSeparator";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoRdm} alt="RDM Digital" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-foreground/10" />
              <div>
                <span className="font-serif text-lg font-bold text-primary-foreground">
                  RDM Digital
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/50 leading-relaxed">
              Tu guía comunitaria digital para descubrir Real del Monte, Pueblo Mágico de Hidalgo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">Explorar</h4>
            <ul className="space-y-2">
              {[
                { label: "Mapa", path: "/mapa" },
                { label: "Lugares", path: "/lugares" },
                { label: "Directorio", path: "/directorio" },
                { label: "Eventos", path: "/eventos" },
                { label: "Comunidad", path: "/comunidad" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rutas */}
          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">Rutas</h4>
            <ul className="space-y-2">
              {["Ruta del Paste", "Ruta Minas y Museos", "Ruta Familiar"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-primary-foreground/50">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Real del Monte, Hidalgo, México</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@rdmdigital.mx</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+52 771 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 text-center" style={{ borderTop: "1px solid hsla(36, 60%, 96%, 0.08)" }}>
          <p className="text-xs text-primary-foreground/30">
            © 2026 RDM Digital. Hecho con ❤️ para Real del Monte, Pueblo Mágico.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
