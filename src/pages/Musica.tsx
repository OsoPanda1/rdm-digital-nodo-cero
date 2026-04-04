import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Music2, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { analyticsApi, musicApi } from '@/lib/api';

type Song = {
  id: string;
  title: string;
  description: string | null;
  basePrice: number;
  audioUrl: string | null;
  coverUrl: string | null;
};

const Musica = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [amountBySong, setAmountBySong] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    if (success) {
      toast({ title: 'Pago confirmado', description: 'Gracias por apoyar la economía cultural local.' });
      void analyticsApi.trackEvent('payment_success', { scope: 'music' });
    }

    if (canceled) {
      toast({ title: 'Pago cancelado', description: 'Tu apoyo sigue disponible cuando tú decidas.', variant: 'destructive' });
    }
  }, [success, canceled, toast]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await musicApi.getSongs();
        setSongs(response.data);
        const initialAmounts = response.data.reduce<Record<string, string>>((acc, song) => {
          acc[song.id] = String(song.basePrice);
          return acc;
        }, {});
        setAmountBySong(initialAmounts);
        await analyticsApi.trackEvent('song_view', { scope: 'music_catalog' });
      } catch (error) {
        toast({
          title: 'Error al cargar catálogo',
          description: error instanceof Error ? error.message : 'No fue posible cargar la música.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    void loadSongs();
  }, [toast]);

  const hasSongs = useMemo(() => songs.length > 0, [songs.length]);

  const handleCheckout = async (song: Song) => {
    const token = localStorage.getItem('rdm_token') || sessionStorage.getItem('rdm_token');
    if (!token) {
      toast({
        title: 'Inicia sesión para apoyar',
        description: 'Te redirigimos a acceso para continuar con el checkout.',
      });
      navigate('/auth');
      return;
    }

    const rawAmount = amountBySong[song.id] ?? String(song.basePrice);
    const parsedAmount = Number(rawAmount);

    if (!Number.isFinite(parsedAmount) || parsedAmount < song.basePrice) {
      toast({
        title: 'Monto inválido',
        description: `El apoyo mínimo para ${song.title} es de ${song.basePrice} MXN.`,
        variant: 'destructive',
      });
      return;
    }

    setCheckoutLoading(song.id);

    try {
      await analyticsApi.trackEvent('checkout_initiated', {
        songId: song.id,
        amount: parsedAmount,
      });

      if (parsedAmount > song.basePrice) {
        await analyticsApi.trackEvent('custom_amount_used', {
          songId: song.id,
          basePrice: song.basePrice,
          amount: parsedAmount,
        });
      }

      const response = await musicApi.createSongCheckout({
        songId: song.id,
        amount: parsedAmount,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
        return;
      }

      throw new Error('No se recibió URL de checkout');
    } catch (error) {
      toast({
        title: 'No se pudo iniciar el pago',
        description: error instanceof Error ? error.message : 'Error desconocido en checkout.',
        variant: 'destructive',
      });
      setCheckoutLoading(null);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">🎶 Motor Cultural RDM</h1>
            <p className="text-muted-foreground text-lg">
              Apoya canciones locales con trazabilidad económica y memoria histórica integrada.
            </p>
            <div className="mt-5">
              <Link to="/apoya" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                <HeartHandshake className="w-4 h-4" />
                Apoya el proyecto
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="font-semibold flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-primary" /> Identidad cultural</p>
                <p className="text-sm text-muted-foreground">Cada canción funciona como activo cultural de la comunidad.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="font-semibold flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4 text-primary" /> Pago con trazabilidad</p>
                <p className="text-sm text-muted-foreground">Checkout seguro y registro de eventos para auditoría operativa.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="font-semibold flex items-center gap-2 mb-1"><Music2 className="w-4 h-4 text-primary" /> Ecosistema vivo</p>
                <p className="text-sm text-muted-foreground">Tu apoyo fortalece promoción artística y turismo inteligente local.</p>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando catálogo cultural...
            </div>
          ) : null}

          {!loading && !hasSongs ? (
            <Card className="max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>Sin canciones disponibles</CardTitle>
                <CardDescription>
                  Aún no hay activos culturales publicados. Intenta de nuevo más tarde.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {!loading && hasSongs ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {songs.map((song) => (
                <Card key={song.id} className="shadow-xl border-0 bg-card/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music2 className="w-5 h-5" /> {song.title}
                    </CardTitle>
                    <CardDescription>{song.description || 'Activo cultural sin descripción adicional.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {song.audioUrl ? (
                      <audio controls className="w-full" src={song.audioUrl}>
                        Tu navegador no soporta audio HTML5.
                      </audio>
                    ) : null}

                    <div className="space-y-2">
                      <label htmlFor={`amount-${song.id}`} className="text-sm font-medium">
                        Aporte en MXN (mínimo {song.basePrice})
                      </label>
                      <Input
                        id={`amount-${song.id}`}
                        type="number"
                        min={song.basePrice}
                        value={amountBySong[song.id] ?? String(song.basePrice)}
                        onChange={(event) =>
                          setAmountBySong((prev) => ({
                            ...prev,
                            [song.id]: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <Button className="w-full" disabled={checkoutLoading === song.id} onClick={() => void handleCheckout(song)}>
                      {checkoutLoading === song.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Apoyar / Comprar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Musica;
