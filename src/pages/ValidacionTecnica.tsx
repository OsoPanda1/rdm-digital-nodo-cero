import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SEOMeta } from "@/components/SEOMeta";
import { BadgeCheck, ShieldCheck, AlertTriangle, BookOpen, CalendarDays } from "lucide-react";

const hitos = [
  "Ecosistema Web 4.0/5.0 autónomo con identidad digital + IA + XR",
  "Arquitectura de IA agéntica y protocolo de colaboración (Isabella Protocol)",
  "Ciberseguridad post-cuántica con referencias de transición",
  "Pipeline quantum-clásico con edge AI y aprendizaje federado",
  "Builder XR/3D/4D y colaboración en tiempo real",
  "Dashboard analítico emocional y predictivo",
  "Documentación y whitepapers auditables",
  "Reconocimiento en listados/rankings globales 2025",
  "Integración de componentes orientados a escalabilidad regional",
  "Transparencia, ética y auditoría integral",
];

const fuentes = [
  "Gartner",
  "MIT Technology Review",
  "OECD",
  "NIST",
  "W3C",
  "IEEE",
  "UNCTAD",
  "Google Scholar",
  "ArXiv",
];

const pendientes = [
  "Validar enlaces públicos para rankings globales 2025",
  "Aterrizar definición técnica de ‘quantum sensible’",
  "Separar claramente validación conceptual vs. certificación formal",
];

const ValidacionTecnica = () => {
  return (
    <PageTransition>
      <SEOMeta
        title="Validación Técnica TAMV 2025 | RDM Digital"
        description="Evidencia funcional integrada de validación técnica TAMV Online, con hitos, fuentes y pendientes de verificación."
      />
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="container mx-auto px-4 pt-28 pb-16 space-y-8">
          <section className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <BadgeCheck className="w-6 h-6 text-cyan-300" />
              <h1 className="text-2xl md:text-4xl font-bold">Validación Técnica Integral TAMV Online (2025)</h1>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Esta sección integra de forma activa en la aplicación web el dossier de validación técnica recibido,
              para consulta pública dentro del proyecto (no solo como archivo en repositorio).
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 border border-cyan-400/20">
              <CalendarDays className="w-4 h-4" />
              Fecha de referencia en evidencias: 2 de noviembre de 2025
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-emerald-400/20 bg-slate-900/70 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <h2 className="text-xl font-semibold">10 hitos declarados</h2>
              </div>
              <ol className="space-y-2 text-slate-200 list-decimal list-inside">
                {hitos.map((hito) => (
                  <li key={hito}>{hito}</li>
                ))}
              </ol>
            </article>

            <article className="rounded-2xl border border-amber-400/20 bg-slate-900/70 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <h2 className="text-xl font-semibold">Fuentes mencionadas</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                {fuentes.map((fuente) => (
                  <li key={fuente} className="rounded-lg bg-slate-800/80 px-3 py-2 border border-slate-700">
                    {fuente}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-2xl border border-rose-400/20 bg-slate-900/70 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-300" />
              <h2 className="text-xl font-semibold">Pendientes de verificación</h2>
            </div>
            <ul className="space-y-2 text-slate-200">
              {pendientes.map((pendiente) => (
                <li key={pendiente} className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2">
                  {pendiente}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-400">
              Nota: este apartado representa una integración documental y de trazabilidad; no sustituye certificaciones externas formales.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ValidacionTecnica;
