import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import NotFound from "./pages/NotFound";
import RealitoChat from "./components/RealitoChat";

const queryClient = new QueryClient();

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <RealitoChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
