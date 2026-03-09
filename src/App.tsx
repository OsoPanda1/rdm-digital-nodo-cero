import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NotificationProvider } from "@/components/NotificationSystem";
import ErrorBoundary from "@/components/ErrorBoundary";
import CinematicIntro from "@/components/CinematicIntro";
import Index from "./pages/Index";
import Lugares from "./pages/Lugares";
import Directorio from "./pages/Directorio";
import Eventos from "./pages/Eventos";
import Comunidad from "./pages/Comunidad";
import Mapa from "./pages/Mapa";
import Historia from "./pages/Historia";
import Cultura from "./pages/Cultura";
import Relatos from "./pages/Relatos";
import Ecoturismo from "./pages/Ecoturismo";
import Gastronomia from "./pages/Gastronomia";
import Arte from "./pages/Arte";
import Rutas from "./pages/Rutas";
import NotFound from "./pages/NotFound";
import RealitoChat from "./components/RealitoChat";
import Auth from "./pages/Auth";
import Apoya from "./pages/Apoya";
import Reglamento from "./pages/Reglamento";
import AdminDashboard from "./pages/admin/Dashboard";
import Dichos from "./pages/Dichos";
import Catalogo from "./pages/Catalogo";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/lugares" element={<Lugares />} />
        <Route path="/directorio" element={<Directorio />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/cultura" element={<Cultura />} />
        <Route path="/relatos" element={<Relatos />} />
        <Route path="/ecoturismo" element={<Ecoturismo />} />
        <Route path="/gastronomia" element={<Gastronomia />} />
        <Route path="/arte" element={<Arte />} />
        <Route path="/rutas" element={<Rutas />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/apoya" element={<Apoya />} />
        <Route path="/reglamento" element={<Reglamento />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dichos" element={<Dichos />} />
        <Route path="/dichos-mineros" element={<Dichos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const [showIntro] = useState(() => {
    if (sessionStorage.getItem('rdm_intro_shown')) return false;
    sessionStorage.setItem('rdm_intro_shown', 'true');
    return true;
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {showIntro && !introComplete && <CinematicIntro onComplete={handleIntroComplete} />}
            <BrowserRouter>
              <ErrorBoundary>
                <AnimatedRoutes />
              </ErrorBoundary>
              <RealitoChat />
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
