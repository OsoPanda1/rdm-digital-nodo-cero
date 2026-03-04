import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentsApi } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/PageTransition';
import { Heart, Star, Zap, Loader2, CheckCircle } from 'lucide-react';

const Apoya = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState('100');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'app' | 'business'>('app');
  const [success, setSuccess] = searchParams.get('success') === 'true';
  const [canceled, setCanceled] = searchParams.get('canceled') === 'true';

  const predefinedAmounts = ['50', '100', '250', '500', '1000'];

  useEffect(() => {
    if (success) {
      toast({
        title: '¡Gracias por tu apoyo! 🙏',
        description: 'Tu donación ha sido procesada correctamente.',
      });
    }
    if (canceled) {
      toast({
        title: 'Donación cancelada',
        description: 'Puedes intentarlo de nuevo cuando quieras.',
        variant: 'destructive',
      });
    }
  }, [success, canceled, toast]);

  const handleDonate = async () => {
    const amount = customAmount || donationAmount;
    if (!amount || parseFloat(amount) < 10) {
      toast({
        title: 'Monto mínimo',
        description: 'El monto mínimo de donación es de 10 MXN.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await paymentsApi.createCheckoutSession({
        toType: donationType,
        amount: parseFloat(amount),
        currency: 'MXN',
        message: 'Donación desde RDM Digital',
      });

      // Redirect to payment page
      window.location.href = response.data.url;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al procesar la donación.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const businessUpgrade = searchParams.get('upgraded') === 'true';

  if (businessUpgrade) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto text-center border-0 shadow-2xl">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">¡Felicidades!</CardTitle>
                <CardDescription>
                  Tu negocio ahora es destacado en RDM Digital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tu negocio aparecerá en las primeras posiciones y tendrá mayor visibilidad para los turistas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Apoya RDM Digital 🏔️
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ayúdanos a seguir construyendo la mejor plataforma turística para Real del Monte
              y contribuye a promover nuestro hermoso Pueblo Mágico.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Impacto Social</h3>
                <p className="text-gray-600 text-sm">
                  Apoyas el turismo local y contribuyes a la economía de Real del Monte
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Plataforma Mejor</h3>
                <p className="text-gray-600 text-sm">
                  Tu apoyo nos permite mejorar funcionalidades y crear más contenido
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Reconocimiento</h3>
                <p className="text-gray-600 text-sm">
                  Aparece en nuestro muro de agradecimientos y sé parte de la comunidad
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Donation Form */}
          <Card className="max-w-lg mx-auto border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Haz tu donación
              </CardTitle>
              <CardDescription className="text-center">
                Elige el monto que deseas donate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donation Type */}
              <div className="space-y-3">
                <Label>Tipo de apoyo</Label>
                <RadioGroup
                  value={donationType}
                  onValueChange={(value) => setDonationType(value as 'app' | 'business')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app" id="app" />
                    <Label htmlFor="app" className="cursor-pointer">
                      Para la app
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="cursor-pointer">
                      Para un negocio
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3">
                <Label>Monto (MXN)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={donationAmount === amount && !customAmount ? 'default' : 'outline'}
                      className={donationAmount === amount && !customAmount 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' 
                        : ''}
                      onClick={() => {
                        setDonationAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount">O ingresa un monto personalizado</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10"
                    placeholder="Otro monto"
                    className="pl-8"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setDonationAmount('');
                    }}
                  />
                </div>
              </div>

              {/* Auth requirement */}
              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <strong>Nota:</strong> Para hacer una donación necesitas{' '}
                  <a href="/auth" className="underline font-semibold">iniciar sesión</a>
                </div>
              )}

              {/* Donate Button */}
              <Button
                className="w-full h-12 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={handleDonate}
                disabled={loading || !isAuthenticated}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Heart className="mr-2 h-5 w-5" />
                )}
                Donar ${customAmount || donationAmount} MXN
              </Button>

              <p className="text-center text-sm text-gray-500">
                Pago seguro con Stripe. Tu información nunca se guarda.
              </p>
            </CardContent>
          </Card>

          {/* Testimonials / Thank You Wall */}
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              💝 Gracias a quienes nos apoyan
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 shadow bg-white/60">
                <CardContent className="pt-4">
                  <p className="text-gray-600 italic">"Excelente plataforma. Me ayudó a descubrir lugares que no conocía."</p>
                  <p className="text-sm font-semibold mt-2">- Turista de CDMX</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow bg-white/60">
                <CardContent className="pt-4">
                  <p className="text-gray-600 italic">"Gracias por promover Real del Monte. Es un pueblo mágico."</p>
                  <p className="text-sm font-semibold mt-2">- Visitante de Querétaro</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Apoya;
