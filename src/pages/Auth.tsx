import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/PageTransition';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'login';
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, isAuthenticated } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente.' });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al iniciar sesión.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({ title: 'Error', description: 'Las contraseñas no coinciden.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signup(signupData.name, signupData.email, signupData.password);
      toast({ title: '¡Cuenta creada!', description: 'Bienvenido a RDM Digital.' });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al crear la cuenta.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
        <Card className="w-full max-w-md shadow-2xl border-border bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--terracotta))] rounded-full flex items-center justify-center">
              <span className="text-3xl">🏔️</span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">RDM Digital</CardTitle>
            <CardDescription>Explora Real del Monte como nunca antes</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="tu@email.com" className="pl-10"
                        value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="••••••••" className="pl-10"
                        value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--terracotta))] text-white hover:opacity-90" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="name" type="text" placeholder="Juan Pérez" className="pl-10"
                        value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-email" type="email" placeholder="tu@email.com" className="pl-10"
                        value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-password" type="password" placeholder="••••••••" className="pl-10"
                        value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required minLength={6} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10"
                        value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--terracotta))] text-white hover:opacity-90" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O continúa como guest</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>Explorar sin cuenta</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/negocios')}>Soy comercio / negocio</Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Auth;
