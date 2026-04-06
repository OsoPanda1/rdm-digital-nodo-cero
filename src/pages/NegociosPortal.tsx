import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Store, CreditCard, LogIn } from "lucide-react";

type Category =
  | "GASTRONOMIA"
  | "HOSPEDAJE"
  | "ARTESANIA"
  | "PLATERIA"
  | "BAR"
  | "COMERCIO"
  | "SERVICIOS"
  | "TURISMO"
  | "OTROS";

const CATEGORIES: Category[] = ["GASTRONOMIA", "HOSPEDAJE", "ARTESANIA", "PLATERIA", "BAR", "COMERCIO", "SERVICIOS", "TURISMO", "OTROS"];

const defaultBiz = {
  name: "",
  category: "GASTRONOMIA" as Category,
  description: "",
  shortDescription: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  address: "",
  facebook: "",
  instagram: "",
  scheduleDisplay: "",
};

export default function NegociosPortal() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user, login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [biz, setBiz] = useState(defaultBiz);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast({ title: "Sesión iniciada", description: "Bienvenido al portal de comercios." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo iniciar sesión", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signup(signupData.name, signupData.email, signupData.password);
      toast({ title: "Cuenta creada", description: "Revisa tu correo para verificar tu cuenta y luego inicia sesión." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo crear la cuenta", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterBusiness = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Inicia sesión primero", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("businesses").insert({
        name: biz.name,
        category: biz.category,
        description: biz.description,
        short_description: biz.shortDescription || null,
        phone: biz.phone || null,
        whatsapp: biz.whatsapp || null,
        email: biz.email || null,
        website: biz.website || null,
        address: biz.address || null,
        facebook: biz.facebook || null,
        instagram: biz.instagram || null,
        schedule_display: biz.scheduleDisplay || null,
        owner_id: user.id,
        status: "pending",
      }).select("id").single();

      if (error) throw error;
      setBusinessId(data.id);
      toast({ title: "¡Negocio registrado!", description: "Ahora activa tu negocio con el pago de $200 MXN." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo registrar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleActivation = async () => {
    if (!businessId) {
      toast({ title: "Registra tu negocio primero", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { type: "activation", businessId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error de pago", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePremium = async () => {
    if (!businessId) {
      toast({ title: "Registra tu negocio primero", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { type: "premium", businessId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error de pago", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-night-900 text-silver-300">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-24 md:px-6">
          <h1 className="font-serif text-3xl text-gold-400">Portal de Comercios</h1>
          <p className="mt-2 text-sm text-silver-500">
            Registra tu negocio en RDM Digital. Activación: $200 MXN · Premium: $500 MXN/mes.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-night-800/70 p-4">
            <Tabs defaultValue={isAuthenticated ? "register" : "signup"}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="signup"><Store className="h-3.5 w-3.5 mr-1" />Crear cuenta</TabsTrigger>
                <TabsTrigger value="login"><LogIn className="h-3.5 w-3.5 mr-1" />Iniciar sesión</TabsTrigger>
                <TabsTrigger value="register"><Store className="h-3.5 w-3.5 mr-1" />Alta negocio</TabsTrigger>
                <TabsTrigger value="pay"><CreditCard className="h-3.5 w-3.5 mr-1" />Pagar</TabsTrigger>
              </TabsList>

              {/* SIGNUP */}
              <TabsContent value="signup" className="mt-4">
                {isAuthenticated ? (
                  <p className="text-sm text-emerald-400">✓ Ya tienes sesión activa. Ve a "Alta negocio".</p>
                ) : (
                  <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSignup}>
                    <div><Label>Nombre completo</Label><Input value={signupData.name} onChange={e => setSignupData({...signupData, name: e.target.value})} required /></div>
                    <div><Label>Email</Label><Input type="email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} required /></div>
                    <div><Label>Contraseña</Label><Input type="password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} required minLength={6} /></div>
                    <div><Label>Confirmar contraseña</Label><Input type="password" value={signupData.confirmPassword} onChange={e => setSignupData({...signupData, confirmPassword: e.target.value})} required minLength={6} /></div>
                    <div className="md:col-span-2"><Button disabled={loading} type="submit" className="w-full">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Crear cuenta</Button></div>
                  </form>
                )}
              </TabsContent>

              {/* LOGIN */}
              <TabsContent value="login" className="mt-4">
                {isAuthenticated ? (
                  <p className="text-sm text-emerald-400">✓ Sesión activa como {user?.email}.</p>
                ) : (
                  <form className="grid gap-3 md:grid-cols-2" onSubmit={handleLogin}>
                    <div><Label>Email</Label><Input type="email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required /></div>
                    <div><Label>Contraseña</Label><Input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required /></div>
                    <div className="md:col-span-2"><Button disabled={loading} type="submit" className="w-full">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Iniciar sesión</Button></div>
                  </form>
                )}
              </TabsContent>

              {/* REGISTER BUSINESS */}
              <TabsContent value="register" className="mt-4">
                {!isAuthenticated ? (
                  <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">Debes crear una cuenta e iniciar sesión primero.</p>
                ) : businessId ? (
                  <div className="space-y-3">
                    <p className="text-sm text-emerald-400">✓ Negocio registrado con ID: <code className="text-xs bg-white/10 px-2 py-0.5 rounded">{businessId}</code></p>
                    <p className="text-sm text-silver-400">Ahora ve a la pestaña "Pagar" para activar tu negocio.</p>
                  </div>
                ) : (
                  <form className="grid gap-3 md:grid-cols-2" onSubmit={handleRegisterBusiness}>
                    <div><Label>Nombre del negocio *</Label><Input value={biz.name} onChange={e => setBiz({...biz, name: e.target.value})} required /></div>
                    <div>
                      <Label>Categoría *</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={biz.category} onChange={e => setBiz({...biz, category: e.target.value as Category})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2"><Label>Descripción completa *</Label><Textarea value={biz.description} onChange={e => setBiz({...biz, description: e.target.value})} required minLength={20} rows={3} /></div>
                    <div className="md:col-span-2"><Label>Descripción corta (para cards)</Label><Input value={biz.shortDescription} onChange={e => setBiz({...biz, shortDescription: e.target.value})} maxLength={120} /></div>
                    <div><Label>Teléfono</Label><Input value={biz.phone} onChange={e => setBiz({...biz, phone: e.target.value})} /></div>
                    <div><Label>WhatsApp</Label><Input value={biz.whatsapp} onChange={e => setBiz({...biz, whatsapp: e.target.value})} /></div>
                    <div><Label>Email del negocio</Label><Input type="email" value={biz.email} onChange={e => setBiz({...biz, email: e.target.value})} /></div>
                    <div><Label>Sitio web</Label><Input value={biz.website} onChange={e => setBiz({...biz, website: e.target.value})} placeholder="https://" /></div>
                    <div className="md:col-span-2"><Label>Dirección *</Label><Input value={biz.address} onChange={e => setBiz({...biz, address: e.target.value})} required /></div>
                    <div><Label>Facebook</Label><Input value={biz.facebook} onChange={e => setBiz({...biz, facebook: e.target.value})} /></div>
                    <div><Label>Instagram</Label><Input value={biz.instagram} onChange={e => setBiz({...biz, instagram: e.target.value})} /></div>
                    <div className="md:col-span-2"><Label>Horario de atención</Label><Input value={biz.scheduleDisplay} onChange={e => setBiz({...biz, scheduleDisplay: e.target.value})} placeholder="Lun-Vie 9:00-18:00" /></div>
                    <div className="md:col-span-2"><Button disabled={loading} type="submit" className="w-full">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Registrar negocio</Button></div>
                  </form>
                )}
              </TabsContent>

              {/* PAY */}
              <TabsContent value="pay" className="mt-4 space-y-4">
                {!isAuthenticated && <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">Inicia sesión primero.</p>}
                {isAuthenticated && !businessId && <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">Registra tu negocio primero en la pestaña "Alta negocio".</p>}
                {isAuthenticated && businessId && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
                      <h3 className="font-serif text-lg text-gold-400">Activación</h3>
                      <p className="text-2xl font-bold text-silver-200">$200 <span className="text-sm font-normal text-silver-500">MXN único</span></p>
                      <p className="text-xs text-silver-400">Tu negocio aparecerá visible en el directorio y mapa de RDM Digital.</p>
                      <Button onClick={handleActivation} disabled={loading} className="w-full">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Pagar activación</Button>
                    </div>
                    <div className="rounded-xl border border-gold-400/30 bg-gold-400/5 p-5 space-y-3">
                      <h3 className="font-serif text-lg text-gold-400">Premium ⭐</h3>
                      <p className="text-2xl font-bold text-silver-200">$500 <span className="text-sm font-normal text-silver-500">MXN / mes</span></p>
                      <p className="text-xs text-silver-400">Visibilidad destacada, badge premium, posición prioritaria en búsquedas y mapa.</p>
                      <Button onClick={handlePremium} disabled={loading} variant="outline" className="w-full border-gold-400/30 text-gold-400">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Suscribirse Premium</Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
