import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Store, Users, TrendingUp, AlertCircle, CheckCircle, XCircle,
  Clock, Star, MapPin, Phone, Globe, Instagram, Facebook, Youtube,
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, EyeOff,
  Upload, Video, Image as ImageIcon, Calendar, DollarSign, ChevronDown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Business categories
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

// Sample business data
const sampleBusinesses = [
  {
    id: "1",
    name: "Pastes El Portal",
    category: "GASTRONOMIA",
    description: "Los pastes más tradicionales de Real del Monte desde 1985. Sabores clásicos y nuevas creaciones.",
    shortDescription: "Tradición pastelera desde 1985",
    phone: "771 123 4567",
    whatsapp: "527711234567",
    email: "contacto@pastelesportal.com",
    website: "https://pastelesportal.com",
    address: "Calle Main #123, Centro",
    latitude: 20.1397,
    longitude: -98.6708,
    imageUrl: "/assets/paste.webp",
    imageUrl2: "/assets/rdm1.jpeg",
    imageUrl3: "/assets/rdm2.jpeg",
    scheduleDisplay: "Lun-Dom: 9:00 - 20:00",
    facebook: "pastelesportal",
    instagram: "@pastelesportal",
    isPremium: true,
    isVerified: true,
    isFeatured: true,
    isActive: true,
    viewsCount: 1250,
    rating: 4.9,
    priceRange: "MODERADO"
  },
  {
    id: "2",
    name: "Hotel Real de Minas",
    category: "HOSPEDAJE",
    description: "Hotel boutique en casona colonial restaurada con vista a la montaña.",
    shortDescription: "Casona colonial boutique",
    phone: "771 234 5678",
    whatsapp: "527712345678",
    email: "reservas@hotelrealdeminash.com",
    website: "https://hotelrealdeminash.com",
    address: "Av. Colonial #45",
    latitude: 20.1402,
    longitude: -98.6712,
    imageUrl: "/assets/calles-colonial.webp",
    imageUrl2: null,
    imageUrl3: null,
    scheduleDisplay: "Check-in: 15:00, Check-out: 12:00",
    facebook: "hotelrealdeminash",
    instagram: "@hotelrealdeminash",
    isPremium: true,
    isVerified: true,
    isFeatured: false,
    isActive: true,
    viewsCount: 890,
    rating: 4.7,
    priceRange: "CARO"
  },
  {
    id: "3",
    name: "Platería Los Hermanos",
    category: "PLATERIA",
    description: "Joyería artesanal en plata con diseños únicos inspirados en la herencia minera de Real del Monte.",
    shortDescription: "Joyería artesanal en plata",
    phone: "771 345 6789",
    whatsapp: "527713456789",
    email: "ventas@platerialoshermanos.com",
    address: "Calle Artesanal #78",
    latitude: 20.1395,
    longitude: -98.6705,
    imageUrl: "/assets/mina-acosta.webp",
    imageUrl2: null,
    imageUrl3: null,
    scheduleDisplay: "Lun-Sáb: 10:00 - 19:00",
    facebook: "platerialoshermanos",
    instagram: "@platerialoshermanos",
    isPremium: false,
    isVerified: true,
    isFeatured: false,
    isActive: true,
    viewsCount: 456,
    rating: 4.8,
    priceRange: "MODERADO"
  },
  {
    id: "4",
    name: "Café La Neblina",
    category: "GASTRONOMIA",
    description: "Café artesanal de altura con los mejores postres y vista al bosque de niebla.",
    shortDescription: "Café de altura con vista",
    phone: "771 456 7890",
    whatsapp: "527714567890",
    email: "hola@neblinacafe.com",
    website: "https://neblinacafe.com",
    address: "Camino al Bosque #12",
    latitude: 20.1410,
    longitude: -98.6720,
    imageUrl: "/assets/penas-cargadas.webp",
    imageUrl2: "/assets/rdm01.jpg",
    imageUrl3: null,
    scheduleDisplay: "Mar-Dom: 8:00 - 18:00",
    facebook: "neblinacafe",
    instagram: "@neblinacafe",
    isPremium: false,
    isVerified: false,
    isFeatured: false,
    isActive: true,
    viewsCount: 320,
    rating: 4.4,
    priceRange: "MODERADO"
  }
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("businesses");
  const [businesses, setBusinesses] = useState(sampleBusinesses);
  const [selectedBusiness, setSelectedBusiness] = useState<typeof sampleBusinesses[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "GASTRONOMIA" as typeof BUSINESS_CATEGORIES[number]["value"],
    description: "",
    shortDescription: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    address: "",
    addressReference: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
    videoUrl: "",
    scheduleDisplay: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    priceRange: "MODERADO"
  });

  // Stats
  const stats = {
    total: businesses.length,
    active: businesses.filter(b => b.isActive).length,
    pending: businesses.filter(b => !b.isVerified).length,
    premium: businesses.filter(b => b.isPremium).length
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle form change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open new business dialog
  const handleNewBusiness = () => {
    setSelectedBusiness(null);
    setFormData({
      name: "",
      category: "GASTRONOMIA",
      description: "",
      shortDescription: "",
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      address: "",
      addressReference: "",
      latitude: "",
      longitude: "",
      imageUrl: "",
      imageUrl2: "",
      imageUrl3: "",
      videoUrl: "",
      scheduleDisplay: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      priceRange: "MODERADO"
    });
    setIsEditing(true);
  };

  // Open edit business dialog
  const handleEditBusiness = (business: typeof sampleBusinesses[0]) => {
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      category: business.category,
      description: business.description,
      shortDescription: business.shortDescription || "",
      phone: business.phone || "",
      whatsapp: business.whatsapp || "",
      email: business.email || "",
      website: business.website || "",
      address: business.address || "",
      addressReference: "",
      latitude: business.latitude?.toString() || "",
      longitude: business.longitude?.toString() || "",
      imageUrl: business.imageUrl || "",
      imageUrl2: business.imageUrl2 || "",
      imageUrl3: business.imageUrl3 || "",
      videoUrl: business.videoUrl || "",
      scheduleDisplay: business.scheduleDisplay || "",
      facebook: business.facebook || "",
      instagram: business.instagram || "",
      tiktok: business.tiktok || "",
      priceRange: business.priceRange || "MODERADO"
    });
    setIsEditing(true);
  };

  // Save business
  const handleSaveBusiness = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    if (formData.description.length > 500) {
      toast({
        title: "Error",
        description: "La descripción no puede exceder 500 caracteres",
        variant: "destructive"
      });
      return;
    }

    if (selectedBusiness) {
      // Update existing
      setBusinesses(prev => prev.map(b => 
        b.id === selectedBusiness.id 
          ? { ...b, ...formData } as typeof b
          : b
      ));
      toast({
        title: "Éxito",
        description: "Negocio actualizado correctamente"
      });
    } else {
      // Create new
      const newBusiness = {
        id: Date.now().toString(),
        ...formData,
        isPremium: false,
        isVerified: true, // Auto-verify for demo
        isFeatured: false,
        isActive: true,
        viewsCount: 0,
        rating: 0,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
      };
      setBusinesses(prev => [...prev, newBusiness as typeof sampleBusinesses[0]]);
      toast({
        title: "Éxito",
        description: "Negocio creado correctamente"
      });
    }

    setIsEditing(false);
    setSelectedBusiness(null);
  };

  // Toggle business status
  const handleToggleStatus = (id: string) => {
    setBusinesses(prev => prev.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } as typeof b : b
    ));
    toast({
      title: "Estado actualizado",
      description: "El estado del negocio ha sido actualizado"
    });
  };

  // Toggle premium
  const handleTogglePremium = (id: string) => {
    setBusinesses(prev => prev.map(b => 
      b.id === id ? { ...b, isPremium: !b.isPremium } as typeof b : b
    ));
    toast({
      title: "Premium actualizado",
      description: "El estado premium del negocio ha sido actualizado"
    });
  };

  // Toggle featured
  const handleToggleFeatured = (id: string) => {
    setBusinesses(prev => prev.map(b => 
      b.id === id ? { ...b, isFeatured: !b.isFeatured } as typeof b : b
    ));
    toast({
      title: "Destacado actualizado",
      description: "El negocio ha sido actualizado en destacados"
    });
  };

  // Delete business
  const handleDeleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    toast({
      title: "Eliminado",
      description: "El negocio ha sido eliminado"
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 pt-28 pb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8 text-white" />
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  Panel de Administración
                </h1>
              </div>
              <p className="text-white/80">
                Gestiona los negocios, dicho

s y contenido de RDM Digital
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 md:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Store className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Negocios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.active}</p>
                    <p className="text-xs text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.premium}</p>
                    <p className="text-xs text-muted-foreground">Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 md:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="businesses">Negocios</TabsTrigger>
              <TabsTrigger value="dichos">Dichos del Pueblo</TabsTrigger>
              <TabsTrigger value="analytics">Estadísticas</TabsTrigger>
            </TabsList>

            {/* Businesses Tab */}
            <TabsContent value="businesses">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar negocios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {BUSINESS_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleNewBusiness} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Negocio
                </Button>
              </div>

              {/* Business List */}
              <div className="space-y-4">
                {filteredBusinesses.map((business) => (
                  <Card key={business.id} className={!business.isActive ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image */}
                        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={business.imageUrl} 
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">{business.name}</h3>
                                {business.isPremium && (
                                  <Badge className="bg-amber-500">Premium</Badge>
                                )}
                                {business.isFeatured && (
                                  <Badge className="bg-blue-500">Destacado</Badge>
                                )}
                                {!business.isVerified && (
                                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                                    Pendiente
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {business.shortDescription}
                              </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleToggleStatus(business.id)}
                                title={business.isActive ? "Desactivar" : "Activar"}
                              >
                                {business.isActive ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleTogglePremium(business.id)}
                                title="Toggle Premium"
                              >
                                <Star className={`w-4 h-4 ${business.isPremium ? "fill-amber-500 text-amber-500" : ""}`} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleToggleFeatured(business.id)}
                                title="Toggle Destacado"
                              >
                                <TrendingUp className={`w-4 h-4 ${business.isFeatured ? "text-blue-500" : ""}`} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditBusiness(business)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteBusiness(business.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {business.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {business.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {business.viewsCount} visitas
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Dichos Tab */}
            <TabsContent value="dichos">
              <Card>
                <CardHeader>
                  <CardTitle>Dichos del Pueblo</CardTitle>
                  <CardDescription>
                    Gestiona los dichos mineros y tradiciones de Real del Monte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Sección de Dichos del Pueblo en desarrollo</p>
                    <p className="text-sm">Aquí podrás agregar, editar y gestionar los dichos mineros</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                  <CardDescription>
                    Estadísticas y métricas del portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Estadísticas en desarrollo</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Business Form Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedBusiness ? "Editar Negocio" : "Nuevo Negocio"}
              </DialogTitle>
              <DialogDescription>
                {selectedBusiness 
                  ? "Actualiza la información del negocio" 
                  : "Completa los datos del nuevo negocio para el directorio"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Negocio *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Pastes El Portal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría *</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => handleSelectChange("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rango de Precio</label>
                  <Select 
                    value={formData.priceRange} 
                    onValueChange={(v) => handleSelectChange("priceRange", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map(pr => (
                        <SelectItem key={pr.value} value={pr.value}>
                          {pr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Descripción * <span className="text-muted-foreground">(Máx 500 caracteres)</span>
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el negocio, sus productos o servicios..."
                  maxLength={500}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.description.length}/500
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción Corta</label>
                <Input
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Versión corta para el mapa y tarjetas"
                  maxLength={200}
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="771 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="527711234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sitio Web</label>
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle, número, colonia"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitud</label>
                  <Input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="20.1397"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitud</label>
                  <Input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="-98.6708"
                  />
                </div>
              </div>

              {/* Media */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Imágenes <span className="text-muted-foreground">(Máx 3)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Input
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="URL Imagen 1"
                    />
                    {formData.imageUrl && (
                      <div className="w-full h-16 rounded overflow-hidden">
                        <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      name="imageUrl2"
                      value={formData.imageUrl2}
                      onChange={handleInputChange}
                      placeholder="URL Imagen 2"
                    />
                    {formData.imageUrl2 && (
                      <div className="w-full h-16 rounded overflow-hidden">
                        <img src={formData.imageUrl2} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      name="imageUrl3"
                      value={formData.imageUrl3}
                      onChange={handleInputChange}
                      placeholder="URL Imagen 3"
                    />
                    {formData.imageUrl3 && (
                      <div className="w-full h-16 rounded overflow-hidden">
                        <img src={formData.imageUrl3} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Video <span className="text-muted-foreground">(Máx 60 segundos)</span>
                </label>
                <Input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="URL del video (YouTube, Vimeo)"
                />
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Horario</label>
                <Input
                  name="scheduleDisplay"
                  value={formData.scheduleDisplay}
                  onChange={handleInputChange}
                  placeholder="Lun-Vie: 9:00 - 18:00, Sáb: 10:00 - 14:00"
                />
              </div>

              {/* Social Media */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Facebook</label>
                  <Input
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instagram</label>
                  <Input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">TikTok</label>
                  <Input
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveBusiness} className="bg-amber-600 hover:bg-amber-700">
                {selectedBusiness ? "Guardar Cambios" : "Crear Negocio"}
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
