import { useState } from 'react';
import { MapPin, Mail, Phone, Send, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logoRdm from "@/assets/logo-rdm.png";
import logoTamv from "@/assets/logo-tamv.jpg";
import { newsletterApi } from "../lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setLoading(true);
    
    try {
      await newsletterApi.subscribe({ email, source: 'footer' });
      setSubscribed(true);
      toast({
        title: "¡Suscrito! 🎉",
        description: "Recibirás las mejores ofertas y eventos de Real del Monte.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No pudiste suscribirte. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[hsl(0,0%,4%)] text-[hsl(0,0%,75%)]">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoRdm} alt="RDM Digital" className="w-10 h-10 rounded-full object-cover ring-1 ring-[hsl(0,0%,20%)]" />
              <div>
                <span className="font-serif text-lg font-bold text-[hsl(0,0%,92%)]">
                  RDM Digital
                </span>
              </div>
            </div>
            <p className="text-sm text-[hsl(0,0%,45%)] leading-relaxed mb-6">
              Tu guía comunitaria digital para descubrir Real del Monte, Pueblo Mágico de Hidalgo.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h4 className="font-serif font-semibold text-[hsl(0,0%,92%)] mb-3">
                📨 Recibe noticias y eventos
              </h4>
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">¡Te has suscrito exitosamente!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[hsl(0,0%,10%)] border-[hsl(0,0%,15%)] text-white placeholder:text-[hsl(0,0%,30%)]"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              )}
            </div>
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
            <h4 className="font-serif font-semibold text-[hsl(0,0%,92%)] mb-4">Descubre</h4>
            <ul className="space-y-2">
              {[
                { label: "Historia", path: "/historia" },
                { label: "Cultura", path: "/cultura" },
                { label: "Gastronomía", path: "/gastronomia" },
                { label: "Ecoturismo", path: "/ecoturismo" },
                { label: "Rutas", path: "/rutas" },
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

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-[hsl(0,0%,92%)] mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[hsl(0,0%,45%)]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Real del Monte, Hidalgo</span>
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
            
            {/* Quick Links */}
            <div className="mt-6 space-y-2">
              <Link
                to="/apoya"
                className="block text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                ❤️ Apoya RDM Digital
              </Link>
              <Link
                to="/auth"
                className="block text-sm text-[hsl(0,0%,45%)] hover:text-[hsl(0,0%,85%)] transition-colors"
              >
                🔐 Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid hsl(0,0%,12%)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[hsl(0,0%,30%)]">
              © 2026 RDM Digital. Hecho con ❤️ para Real del Monte, Pueblo Mágico.
            </p>
            
            <div className="flex items-center gap-4">
              <Link to="/reglamento" className="text-xs text-[hsl(0,0%,30%)] hover:text-[hsl(0,0%,60%)]">
                Reglamento
              </Link>
              <span className="text-[hsl(0,0%,15%)]">|</span>
              <Link to="/privacidad" className="text-xs text-[hsl(0,0%,30%)] hover:text-[hsl(0,0%,60%)]">
                Privacidad
              </Link>
            </div>
          </div>

          {/* TAMV Online branding */}
          <div className="flex flex-col items-center gap-4 mt-8">
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
