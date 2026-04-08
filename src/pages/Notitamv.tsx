import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { SEOMeta } from '@/components/SEOMeta';
import { apiClient } from '@/lib/apiClient';
import { BellRing, Sparkles, RadioTower, ShieldCheck } from 'lucide-react';

type EventType = 'celebration' | 'alert' | 'community' | 'reminder';
type Urgency = 'low' | 'medium' | 'high' | 'critical';


interface OrchestrationResponse {
  success: boolean;
  data: {
    recommendation: string;
    decision: {
      selectedChannel: string;
      fallbackChannels: string[];
      sonicProfile: { label: string; spatialAudio: string };
      visualEffect: string;
      priorityScore: number;
      traceId: string;
    };
  };
}

const floatingBadges = ['Orgullo LATAM', 'Audio 3D', 'XR Ready', 'Privacidad por diseño', 'Federación soberana'];

const NotitamvPage = () => {
  const [title, setTitle] = useState('Logro desbloqueado en DreamSpaces');
  const [message, setMessage] = useState('Tu comunidad activó una celebración multisensorial con identidad latina.');
  const [eventType, setEventType] = useState<EventType>('celebration');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrchestrationResponse['data'] | null>(null);

  const gradient = useMemo(() => {
    if (urgency === 'critical') return 'from-rose-500/50 via-orange-500/40 to-amber-500/50';
    if (eventType === 'celebration') return 'from-fuchsia-500/30 via-cyan-400/40 to-amber-400/40';
    return 'from-cyan-500/30 via-blue-500/30 to-violet-500/30';
  }, [eventType, urgency]);

  const orchestrate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post<OrchestrationResponse>('/notitamv/orchestrate', {
        title,
        message,
        eventType,
        urgency,
        locale: 'es-MX',
        preferredChannels: ['xr', 'push', 'webpush'],
      });

      setResult(response.data);
    } finally {
      setLoading(false);
    }
  };


  // Repo chain loading removed - internal admin function only
  return (
    <PageTransition>
      <SEOMeta
        title='NOTITAMV | Pulso sensorial TAMV'
        description='Sistema de notificaciones multisensoriales con identidad latinoamericana, IA contextual y modos XR.'
      />
      <div className='min-h-screen bg-slate-950 text-white overflow-hidden'>
        <Navbar />

        <main className='container mx-auto px-4 pt-28 pb-16'>
          <section className='relative rounded-3xl border border-cyan-400/20 p-8 md:p-12 bg-slate-900/80'>
            <motion.div
              className={`absolute inset-0 -z-0 bg-gradient-to-r ${gradient}`}
              animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.02, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className='relative z-10 space-y-6'>
              <div className='inline-flex items-center gap-2 rounded-full border border-fuchsia-300/40 bg-fuchsia-500/10 px-4 py-1 text-xs'>
                <Sparkles className='w-4 h-4 text-fuchsia-300' />
                NOTITAMV — El pulso sensorial de TAMV
              </div>

              <h1 className='text-3xl md:text-5xl font-bold max-w-4xl'>
                Notificaciones con movimiento, sonido contextual e identidad latina global.
              </h1>
              <p className='text-slate-200 max-w-3xl'>
                Orquesta canal, urgencia y firma sonora en tiempo real. Diseñado para web, móvil, IoT y experiencias XR.
              </p>

              <div className='flex flex-wrap gap-2'>
                {floatingBadges.map((badge, idx) => (
                  <motion.span
                    key={badge}
                    className='rounded-full border border-cyan-300/30 bg-slate-950/70 px-3 py-1 text-xs text-cyan-100'
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2 + idx * 0.2, repeat: Infinity }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            </div>
          </section>

          <section className='grid lg:grid-cols-2 gap-6 mt-8'>
            <article className='rounded-2xl border border-slate-700 bg-slate-900/70 p-6 space-y-4'>
              <h2 className='text-xl font-semibold flex items-center gap-2'><BellRing className='w-5 h-5 text-cyan-300' /> Demo de orquestación</h2>

              <input className='w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2' value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea className='w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 min-h-24' value={message} onChange={(e) => setMessage(e.target.value)} />

              <div className='grid grid-cols-2 gap-3'>
                <select className='bg-slate-800 border border-slate-600 rounded-lg px-3 py-2' value={eventType} onChange={(e) => setEventType(e.target.value as EventType)}>
                  <option value='celebration'>Celebración</option>
                  <option value='alert'>Alerta</option>
                  <option value='community'>Comunidad</option>
                  <option value='reminder'>Recordatorio</option>
                </select>
                <select className='bg-slate-800 border border-slate-600 rounded-lg px-3 py-2' value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
                  <option value='low'>Baja</option>
                  <option value='medium'>Media</option>
                  <option value='high'>Alta</option>
                  <option value='critical'>Crítica</option>
                </select>
              </div>

              <button
                type='button'
                onClick={orchestrate}
                disabled={loading}
                className='w-full rounded-xl bg-cyan-500 text-slate-950 font-semibold px-4 py-2 disabled:opacity-60'
              >
                {loading ? 'Orquestando...' : 'Probar NOTITAMV'}
              </button>

            </article>

            <article className='rounded-2xl border border-cyan-400/30 bg-slate-900/70 p-6'>
              <h2 className='text-xl font-semibold flex items-center gap-2'><RadioTower className='w-5 h-5 text-fuchsia-300' /> Resultado inteligente</h2>
              {result ? (
                <div className='mt-4 space-y-3 text-sm'>
                  <p className='text-cyan-200'>{result.recommendation}</p>
                  <div className='grid gap-2'>
                    <div className='rounded-lg bg-slate-800 p-3'>Canal principal: <strong>{result.decision.selectedChannel}</strong></div>
                    <div className='rounded-lg bg-slate-800 p-3'>Fallbacks: {result.decision.fallbackChannels.join(', ') || 'N/A'}</div>
                    <div className='rounded-lg bg-slate-800 p-3'>Firma sonora: {result.decision.sonicProfile.label} ({result.decision.sonicProfile.spatialAudio})</div>
                    <div className='rounded-lg bg-slate-800 p-3'>Efecto visual: {result.decision.visualEffect}</div>
                    <div className='rounded-lg bg-slate-800 p-3'>Prioridad: {result.decision.priorityScore}</div>
                    <div className='rounded-lg bg-slate-800 p-3'>Trace: {result.decision.traceId}</div>
                  </div>
                </div>
              ) : (
                <p className='text-slate-300 mt-4'>Ejecuta el demo para obtener la recomendación contextual de NOTITAMV.</p>
              )}

              <div className='mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm flex items-start gap-2'>
                <ShieldCheck className='w-4 h-4 mt-0.5 text-emerald-300' />
                Cumple modo privacidad por diseño, con retención reducida para alertas críticas.
              </div>
            </article>


          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default NotitamvPage;
