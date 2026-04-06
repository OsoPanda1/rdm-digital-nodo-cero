import { useState, useCallback, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { NotificationProvider } from "@/components/NotificationSystem";
import ErrorBoundary from "@/components/ErrorBoundary";
import CinematicIntro from "@/components/CinematicIntro";
import RealitoChatLauncher from "./components/RealitoChatLauncher";
import GlobalSupportCTA from "./components/GlobalSupportCTA";
import { usePageTracking } from "@/hooks/useAnalytics";
import ImmersiveInteractionLayer from "@/components/ImmersiveInteractionLayer";
import IsabellaAura from "@/components/IsabellaAura";

const Index = lazy(() => import("./pages/Index"));
const Lugares = lazy(() => import("./pages/Lugares"));
const Directorio = lazy(() => import("./pages/Directorio"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Comunidad = lazy(() => import("./pages/Comunidad"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Historia = lazy(() => import("./pages/Historia"));
const Cultura = lazy(() => import("./pages/Cultura"));
const Relatos = lazy(() => import("./pages/Relatos"));
const Ecoturismo = lazy(() => import("./pages/Ecoturismo"));
const Gastronomia = lazy(() => import("./pages/Gastronomia"));
const Arte = lazy(() => import("./pages/Arte"));
const Rutas = lazy(() => import("./pages/Rutas"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Apoya = lazy(() => import("./pages/Apoya"));
const Reglamento = lazy(() => import("./pages/Reglamento"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Dichos = lazy(() => import("./pages/Dichos"));
const Catalogo = lazy(() => import("./pages/Catalogo"));
const NegociosPortal = lazy(() => import("./pages/NegociosPortal"));
const ValidacionTecnica = lazy(() => import("./pages/ValidacionTecnica"));
const Musica = lazy(() => import("./pages/Musica"));

const RouteFallback = () => (
  <div className="min-h-screen w-full animate-pulse bg-background" aria-label="Cargando contenido" />
);

const AnimatedRoutes = () => {
  const location = useLocation();
  usePageTracking();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
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
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/negocios" element={<NegociosPortal />} />
          <Route path="/validacion-tecnica" element={<ValidacionTecnica />} />
          <Route path="/musica" element={<Musica />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const AppInner = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const [showIntro] = useState(() => {
    if (sessionStorage.getItem("rdm_intro_shown")) return false;
    sessionStorage.setItem("rdm_intro_shown", "true");
    return true;
  });

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showIntro && !introComplete && (
            <CinematicIntro onComplete={handleIntroComplete} />
          )}
          {(!showIntro || introComplete) && (
            <AnimatedRoutes />
          )}
          <ImmersiveInteractionLayer />
          <IsabellaAura />
          <GlobalSupportCTA />
          <RealitoChatLauncher />
        </TooltipProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
};

export default App;
