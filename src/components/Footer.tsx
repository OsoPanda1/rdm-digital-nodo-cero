import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logoRdm from "@/assets/logo-rdm.png";
import logoTamv from "@/assets/logo-tamv.jpg";

const Footer = () => {
  return (
    <footer className="bg-[hsl(0,0%,4%)] text-[hsl(0,0%,75%)]">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoRdm} alt="RDM Digital" className="w-10 h-10 rounded-full object-cover ring-1 ring-[hsl(0,0%,20%)]" />
              <div>
                <span className="font-serif text-lg font-bold text-[hsl(0,0%,92%)]">
                  RDM Digital
                </span>
              </div>
            </div>
            <p className="text-sm text-[hsl(0,0%,45%)] leading-relaxed">
              Tu guía comunitaria digital para descubrir Real del Monte, Pueblo Mágico de Hidalgo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold text-[hsl(0,0%,92%)] mb-4">Explorar</h4>
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
                    className="text-sm text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,85%)] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rutas */}
          <div>
            <h4 className="font-serif font-semibold text-[hsl(0,0%,92%)] mb-4">Rutas</h4>
            <ul className="space-y-2">
              {["Ruta del Paste", "Ruta Minas y Museos", "Ruta Familiar"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-[hsl(0,0%,45%)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-[hsl(0,0%,92%)] mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[hsl(0,0%,45%)]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Real del Monte, Hidalgo, México</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[hsl(0,0%,45%)]">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@rdmdigital.mx</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[hsl(0,0%,45%)]">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+52 771 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid hsl(0,0%,12%)" }}>
          <p className="text-xs text-[hsl(0,0%,30%)] text-center mb-6">
            © 2026 RDM Digital. Hecho con ❤️ para Real del Monte, Pueblo Mágico.
          </p>

          {/* TAMV Online branding */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={logoTamv}
              alt="TAMV Online – Tecnología Avanzada Mexicana Versátil"
              className="h-12 md:h-14 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
              <p className="text-xs text-[hsl(210,10%,55%)] font-light tracking-wide">
                Proyecto creado con amor ♥ Tecnología TAMV Online
              </p>
              <span className="hidden md:inline text-[hsl(0,0%,15%)]">|</span>
              <p className="text-xs text-[hsl(0,0%,50%)] font-medium tracking-wide">
                Orgullosamente Realmontenses
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
