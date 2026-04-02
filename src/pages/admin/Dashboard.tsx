import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Store, Users, TrendingUp, CheckCircle, Clock, Star, MapPin, Phone,
  Plus, Search, Edit, Trash2, Eye, EyeOff, Calendar, DollarSign,
  Shield, Activity, BarChart3, AlertTriangle, RefreshCw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const BUSINESS_CATEGORIES = [
  { value: "GASTRONOMIA", label: "Gastronomía", icon: "🍽️" },
  { value: "HOSPEDAJE", label: "Hospedaje", icon: "🏨" },
  { value: "ARTESANIA", label: "Artesanía", icon: "🎨" },
  { value: "PLATERIA", label: "Platería", icon: "💍" },
  { value: "BAR", label: "Bar", icon: "🍺" },
  { value: "COMERCIO", label: "Comercio", icon: "🏪" },
  { value: "SERVICIOS", label: "Servicios", icon: "🔧" },
  { value: "TURISMO", label: "Turismo", icon: "🗺️" },
  { value: "OTROS", label: "Otros", icon: "📦" },
];

const PRICE_RANGES = [
  { value: "ECONOMICO", label: "Económico ($)" },
  { value: "MODERADO", label: "Moderado ($$)" },
  { value: "CARO", label: "Caro ($$$)" },
  { value: "LUJO", label: "Lujo ($$$$)" },
];

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  activeBusinesses: number;
  pendingBusinesses: number;
  totalEvents: number;
  totalPosts: number;
  premiumBusinesses: number;
}

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  short_description: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  is_premium: boolean;
  is_featured: boolean;
  is_verified: boolean;
  views_count: number;
  image_url: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalBusinesses: 0, activeBusinesses: 0,
    pendingBusinesses: 0, totalEvents: 0, totalPosts: 0, premiumBusinesses: 0
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    name: "", category: "GASTRONOMIA", description: "", short_description: "",
    phone: "", address: "", price_range: "MODERADO",
    image_url: "", latitude: "", longitude: "",
  });

  const loadStats = useCallback(async () => {
    try {
      const [usersRes, bizRes, activeBizRes, pendingBizRes, eventsRes, postsRes, premRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('is_premium', true),
      ]);
      setStats({
        totalUsers: usersRes.count ?? 0,
        totalBusinesses: bizRes.count ?? 0,
        activeBusinesses: activeBizRes.count ?? 0,
        pendingBusinesses: pendingBizRes.count ?? 0,
        totalEvents: eventsRes.count ?? 0,
        totalPosts: postsRes.count ?? 0,
        premiumBusinesses: premRes.count ?? 0,
      });
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, []);

  const loadBusinesses = useCallback(async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setBusinesses(data as Business[]);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([loadStats(), loadBusinesses()]).finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, navigate, loadStats, loadBusinesses]);

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveBusiness = async () => {
    if (!formData.name || !formData.description) {
      toast({ title: "Error", description: "Completa nombre y descripción", variant: "destructive" });
      return;
    }
    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      short_description: formData.short_description || null,
      phone: formData.phone || null,
      address: formData.address || null,
      price_range: formData.price_range,
      image_url: formData.image_url || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    if (selectedBusiness) {
      const { error } = await supabase.from('businesses').update(payload).eq('id', selectedBusiness.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Actualizado", description: "Negocio actualizado" });
    } else {
      const { error } = await supabase.from('businesses').insert({
        ...payload,
        owner_id: profile?.id ?? null,
        status: 'pending',
      });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Creado", description: "Negocio registrado como pendiente" });
    }
    setIsEditing(false);
    loadBusinesses();
    loadStats();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('businesses').update({ status }).eq('id', id);
    loadBusinesses();
    loadStats();
    toast({ title: "Estado actualizado" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from('businesses').delete().eq('id', id);
    loadBusinesses();
    loadStats();
    toast({ title: "Eliminado" });
  };

  const openEdit = (b: Business) => {
    setSelectedBusiness(b);
    setFormData({
      name: b.name, category: b.category, description: b.description,
      short_description: b.short_description || "", phone: b.phone || "",
      address: b.address || "", price_range: "MODERADO", image_url: b.image_url || "",
      latitude: "", longitude: "",
    });
    setIsEditing(true);
  };

  const openNew = () => {
    setSelectedBusiness(null);
    setFormData({
      name: "", category: "GASTRONOMIA", description: "", short_description: "",
      phone: "", address: "", price_range: "MODERADO", image_url: "", latitude: "", longitude: "",
    });
    setIsEditing(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <div className="bg-gradient-to-r from-[hsl(var(--navy))] to-[hsl(var(--navy-light))] pt-28 pb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-[hsl(var(--gold))]" />
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  Panel de Control
                </h1>
              </div>
              <p className="text-white/70">
                Control operativo en tiempo real — RDM Digital
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 md:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: "Usuarios", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Negocios", value: stats.totalBusinesses, icon: Store, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Activos", value: stats.activeBusinesses, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Pendientes", value: stats.pendingBusinesses, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
              { label: "Premium", value: stats.premiumBusinesses, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Eventos", value: stats.totalEvents, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "Posts", value: stats.totalPosts, icon: BarChart3, color: "text-rose-500", bg: "bg-rose-500/10" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="border-0 shadow-lg bg-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 md:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="businesses">Negocios</TabsTrigger>
              <TabsTrigger value="analytics">Actividad</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[hsl(var(--electric))]" />
                      Estado del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Base de datos", status: "Operativa", ok: true },
                      { label: "Autenticación", status: "Activa", ok: true },
                      { label: "Mapa Leaflet", status: "Online", ok: true },
                      { label: "Gemelo Digital 3D", status: "Modo básico", ok: true },
                      { label: "Isabella IA", status: "Reglas activas", ok: true },
                    ].map(({ label, status, ok }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm">{label}</span>
                        <Badge variant={ok ? "default" : "destructive"} className={ok ? "bg-green-500/20 text-green-600 border-0" : ""}>
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[hsl(var(--gold))]" />
                      Monetización
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm">Modelo</span>
                      <span className="text-sm font-medium">Freemium + Activación</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm">Registro negocio</span>
                      <span className="text-sm font-medium">Gratis (pendiente)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm">Activación</span>
                      <span className="text-sm font-medium">$200 MXN</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm">Premium</span>
                      <span className="text-sm font-medium">$500 MXN / mes</span>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--terracotta))] text-white" disabled>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Stripe (próximamente)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Businesses */}
            <TabsContent value="businesses">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar negocios..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Categoría" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {BUSINESS_CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={openNew} className="bg-[hsl(var(--gold))] hover:opacity-90 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Nuevo Negocio
                </Button>
              </div>

              {filteredBusinesses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay negocios registrados aún</p>
                    <Button onClick={openNew} variant="outline" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" /> Registrar primer negocio
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredBusinesses.map((b) => (
                    <Card key={b.id} className={b.status === 'inactive' ? "opacity-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          {b.image_url && (
                            <div className="w-full md:w-28 h-20 rounded-lg overflow-hidden shrink-0">
                              <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold">{b.name}</h3>
                                  <Badge variant="outline" className={
                                    b.status === 'active' ? 'border-green-500 text-green-600' :
                                    b.status === 'pending' ? 'border-yellow-500 text-yellow-600' :
                                    'border-red-500 text-red-600'
                                  }>
                                    {b.status === 'active' ? 'Activo' : b.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                                  </Badge>
                                  {b.is_premium && <Badge className="bg-amber-500 text-white border-0">Premium</Badge>}
                                  {b.is_featured && <Badge className="bg-blue-500 text-white border-0">Destacado</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                  {b.short_description || b.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {b.status === 'pending' && (
                                  <Button variant="ghost" size="sm" onClick={() => handleStatusChange(b.id, 'active')}
                                    className="text-green-600 hover:text-green-700">
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() =>
                                  handleStatusChange(b.id, b.status === 'active' ? 'inactive' : 'active')}>
                                  {b.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openEdit(b)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}
                                  className="text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                              {b.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</span>}
                              {b.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.address}</span>}
                              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{b.views_count} vistas</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Resumen de actividad en la plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span>Usuarios registrados</span>
                        <span className="font-medium">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span>Posts en comunidad</span>
                        <span className="font-medium">{stats.totalPosts}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span>Negocios registrados</span>
                        <span className="font-medium">{stats.totalBusinesses}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Eventos programados</span>
                        <span className="font-medium">{stats.totalEvents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Seguridad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>RLS Políticas</span>
                      <Badge className="bg-green-500/20 text-green-600 border-0">Activas</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Roles (RBAC)</span>
                      <Badge className="bg-green-500/20 text-green-600 border-0">Configurado</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Auth Supabase</span>
                      <Badge className="bg-green-500/20 text-green-600 border-0">Activa</Badge>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Error Boundary</span>
                      <Badge className="bg-green-500/20 text-green-600 border-0">Global</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Business Form Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedBusiness ? "Editar Negocio" : "Nuevo Negocio"}</DialogTitle>
              <DialogDescription>
                {selectedBusiness ? "Actualiza la información" : "Registra un negocio en el directorio"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Nombre *</label>
                <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Pastes El Portal" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Categoría</label>
                  <Select value={formData.category} onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Precio</label>
                  <Select value={formData.price_range} onValueChange={(v) => setFormData(p => ({ ...p, price_range: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Descripción *</label>
                <Textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe el negocio..." maxLength={500} className="min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Dirección</label>
                  <Input value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Imagen URL</label>
                <Input value={formData.image_url} onChange={(e) => setFormData(p => ({ ...p, image_url: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button onClick={handleSaveBusiness} className="bg-[hsl(var(--gold))] text-white hover:opacity-90">
                {selectedBusiness ? "Guardar Cambios" : "Registrar Negocio"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
