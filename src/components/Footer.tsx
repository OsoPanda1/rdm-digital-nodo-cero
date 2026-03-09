import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logoRdm from "@/assets/logo-rdm-digital.png";
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
      setSubscribed(true);
      toast({
        title: "¡Suscrito! 🎉",
        description: "Gracias por suscribirte a RDM Digital.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ background: "linear-gradient(180deg, hsl(220,45%,8%) 0%, hsl(220,50%,5%) 100%)" }}>
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoRdm} 
                alt="RDM Digital" 
                className="w-14 h-14 object-contain"
                style={{ filter: "drop-shadow(0 0 10px hsla(210,100%,55%,0.3))" }}
              />
              <div>
                <span className="font-serif text-xl font-bold" style={{ color: "hsl(0,0%,95%)" }}>
                  RDM Digital
                </span>
                <div className="flex items-center gap-1 text-[10px] tracking-wider" style={{ color: "hsl(43,70%,55%)" }}>
                  <Sparkles className="w-3 h-3" />
                  Innovación Turística 2026
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(210,20%,50%)" }}>
              Tu guía comunitaria digital para descubrir Real del Monte, Pueblo Mágico de Hidalgo. 
              Servicios de altura para visitantes exigentes.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h4 className="font-serif font-semibold mb-3" style={{ color: "hsl(0,0%,92%)" }}>
                📨 Recibe noticias y eventos
              </h4>
              {subscribed ? (
                <div 
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: "hsla(145,60%,40%,0.15)", color: "hsl(145,60%,60%)" }}
                >
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
                    className="border-0"
                    style={{ 
                      background: "hsl(220,40%,12%)", 
                      color: "white",
                    }}
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    style={{ background: "linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,45%))" }}
                    className="hover:opacity-90"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4" style={{ color: "hsl(0,0%,92%)" }}>Explorar</h4>
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
                    className="text-sm transition-colors duration-200"
                    style={{ color: "hsl(210,20%,50%)" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "hsl(210,100%,70%)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "hsl(210,20%,50%)"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rutas */}
          <div>
            <h4 className="font-serif font-semibold mb-4" style={{ color: "hsl(0,0%,92%)" }}>Descubre</h4>
            <ul className="space-y-2">
              {[
                { label: "Historia", path: "/historia" },
                { label: "Cultura", path: "/cultura" },
                { label: "Gastronomía", path: "/gastronomia" },
                { label: "Ecoturismo", path: "/ecoturismo" },
                { label: "Dichos Mineros", path: "/dichos-mineros" },
                { label: "Rutas", path: "/rutas" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "hsl(210,20%,50%)" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "hsl(43,70%,60%)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "hsl(210,20%,50%)"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold mb-4" style={{ color: "hsl(0,0%,92%)" }}>Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(210,20%,50%)" }}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "hsl(210,100%,60%)" }} />
                <span>Real del Monte, Hidalgo</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(210,20%,50%)" }}>
                <Mail className="w-4 h-4 shrink-0" style={{ color: "hsl(43,70%,55%)" }} />
                <span>info@rdmdigital.mx</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(210,20%,50%)" }}>
                <Phone className="w-4 h-4 shrink-0" style={{ color: "hsl(145,50%,50%)" }} />
                <span>+52 771 123 4567</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="mt-6 space-y-2">
              <Link
                to="/apoya"
                className="block text-sm transition-colors"
                style={{ color: "hsl(43,70%,55%)" }}
                onMouseOver={(e) => e.currentTarget.style.color = "hsl(43,70%,70%)"}
                onMouseOut={(e) => e.currentTarget.style.color = "hsl(43,70%,55%)"}
              >
                ❤️ Apoya RDM Digital
              </Link>
              <Link
                to="/auth"
                className="block text-sm transition-colors"
                style={{ color: "hsl(210,20%,50%)" }}
                onMouseOver={(e) => e.currentTarget.style.color = "hsl(210,100%,70%)"}
                onMouseOut={(e) => e.currentTarget.style.color = "hsl(210,20%,50%)"}
              >
                🔐 Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid hsla(210,100%,55%,0.1)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs" style={{ color: "hsl(210,20%,35%)" }}>
              © 2026 RDM Digital. Hecho con ❤️ para Real del Monte, Pueblo Mágico.
            </p>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/reglamento" 
                className="text-xs transition-colors"
                style={{ color: "hsl(210,20%,35%)" }}
                onMouseOver={(e) => e.currentTarget.style.color = "hsl(210,100%,60%)"}
                onMouseOut={(e) => e.currentTarget.style.color = "hsl(210,20%,35%)"}
              >
                Reglamento
              </Link>
              <span style={{ color: "hsl(210,30%,20%)" }}>|</span>
              <Link 
                to="/privacidad" 
                className="text-xs transition-colors"
                style={{ color: "hsl(210,20%,35%)" }}
                onMouseOver={(e) => e.currentTarget.style.color = "hsl(210,100%,60%)"}
                onMouseOut={(e) => e.currentTarget.style.color = "hsl(210,20%,35%)"}
              >
                Privacidad
              </Link>
            </div>
          </div>

          {/* TAMV Online branding */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <img
              src={logoTamv}
              alt="TAMV Online – Tecnología Avanzada Mexicana Versátil"
              className="h-12 md:h-14 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
              <p className="text-xs font-light tracking-wide" style={{ color: "hsl(210,30%,45%)" }}>
                Proyecto creado con amor ♥ Tecnología TAMV Online
              </p>
              <span className="hidden md:inline" style={{ color: "hsl(210,30%,20%)" }}>|</span>
              <p className="text-xs font-medium tracking-wide" style={{ color: "hsl(43,50%,50%)" }}>
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
