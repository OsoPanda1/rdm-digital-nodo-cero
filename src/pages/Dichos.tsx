import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Quote, Heart, Sparkles, Lightbulb, Users, Clock, 
  Search, Filter, ChevronDown, Volume2, Share2, BookOpen
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Categories of dichos
const CATEGORIES = [
  { id: "all", label: "Todos", icon: "✨" },
  { id: "GENERAL", label: "Generales", icon: "💬" },
  { id: "BRINDIS", label: "Brindis", icon: "🍻" },
  { id: "HUMOR", label: "Humor", icon: "😂" },
  { id: "FAMILIA", label: "Familia", icon: "👨‍👩‍👧‍👦" },
  { id: "COMIDA_BEBIDA", label: "Comida y Bebida", icon: "🍽️" },
  { id: "TRABAJO", label: "Trabajo", icon: "⛏️" },
  { id: "VIDA_COTIDIANA", label: "Vida Cotidiana", icon: "🏠" },
  { id: "MINERIA", label: "Minería", icon: "💎" },
];

// Sample dichos with Real del Monte context
const DICHOS = [
  {
    id: "1",
    texto: "¡Ándale, no seas mole!",
    significado: "Expresión para motivar a alguien a actuar, no quedarse pasivo. El mole representa algo retrasoso o lento.",
    categoria: "BRINDIS",
    fuente: "Tradición pastelesa",
    tags: ["motivación", "acción"],
    likes: 156
  },
  {
    id: "2",
    texto: "Más tieso que la neblina del lunes",
    significado: "Algo muy tieso o tiesa. Se dice cuando alguien está muy erguido o formal, comparándolo con la niebla espesa que baja los lunes.",
    categoria: "HUMOR",
    fuente: "Dichos locales",
    tags: ["formal", "lunes"],
    likes: 89
  },
  {
    id: "3",
    texto: "Trabajar como mineral en la mina",
    significado: "Trabajar intensamente, sin descanso. Referencia al duro trabajo en las minas de plata.",
    categoria: "TRABAJO",
    fuente: "Herencia minera",
    tags: ["trabajo", "esfuerzo"],
    likes: 234
  },
  {
    id: "4",
    texto: "Echar más carburo que máquina de vapor",
    significado: "Poner mucho esfuerzo, trabajar duro. Comparación con las antiguas máquinas de vapor usadas en las minas.",
    categoria: "TRABAJO",
    fuente: "Historia minera",
    tags: ["esfuerzo", "máquinas"],
    likes: 178
  },
  {
    id: "5",
    texto: "Estar más largo que la veta madre",
    significado: "Algo o alguien muy largo. La veta madre era la veta principal de plata en las minas.",
    categoria: "GENERAL",
    fuente: "Historia minera",
    tags: ["largo", "mina"],
    likes: 145
  },
  {
    id: "6",
    texto: "Más profundo que la Mina de Acosta",
    significado: "Algo muy profundo, ya sea literal o figuradamente. La Mina de Acosta tiene 460 metros de profundidad.",
    categoria: "MINERIA",
    fuente: "Lugares emblemáticos",
    tags: ["profundo", "Acosta"],
    likes: 267
  },
  {
    id: "7",
    texto: "Comer como si fuera festival del paste",
    significado: "Comer con mucho apetito y enjoyment. Referencia al famoso Festival Internacional del Paste.",
    categoria: "COMIDA_BEBIDA",
    fuente: "Gastronomía local",
    tags: ["comida", "festival"],
    likes: 198
  },
  {
    id: "8",
    texto: "Subir más alto que Peñas Cargadas",
    significado: "Alcanzar gran altura, ya sea física o metafórica. Las Peñas Cargadas son formaciones rocosas icónicas.",
    categoria: "GENERAL",
    fuente: "Naturaleza local",
    tags: ["altura", "Peñas Cargadas"],
    likes: 156
  },
  {
    id: "9",
    texto: "Brindar con mezcal del bueno",
    significado: "Celebrar algo especial. El mezcal es parte de la tradición local.",
    categoria: "BRINDIS",
    fuente: "Tradición",
    tags: ["celebración", "mezcal"],
    likes: 312
  },
  {
    id: "10",
    texto: "Más blanco que la neblina del Panteón Inglés",
    significado: "Algo muy blanco. La niebla del Panteón Inglés es legendaria por su blancura.",
    categoria: "GENERAL",
    fuente: "Lugares icónicos",
    tags: ["blanco", "Panteón"],
    likes: 87
  },
  {
    id: "11",
    texto: "Tener más capas que un paste de varios ingredientes",
    significado: "Ser complejo, tener muchas facetas. Los pastes pueden tener múltiples rellenos.",
    categoria: "COMIDA_BEBIDA",
    fuente: "Gastronomía",
    tags: ["complejo", "paste"],
    likes: 134
  },
  {
    id: "12",
    texto: "Vivir entre la neblina",
    significado: "Estar en un estado de confusión o no entender algo claramente.",
    categoria: "VIDA_COTIDIANA",
    fuente: "Clima local",
    tags: ["confusión", "neblina"],
    likes: 178
  },
  {
    id: "13",
    texto: "Conocerse como las calles empedradas",
    significado: "Conocerse muy bien, saber todos los rincones. Las calles empedradas son un patrimonio del pueblo.",
    categoria: "FAMILIA",
    fuente: "Arquitectura colonial",
    tags: ["conocimiento", "calles"],
    likes: 156
  },
  {
    id: "14",
    texto: "Más valioso que la plata de Real",
    significado: "Algo muy valioso. La plata fue la fuente de riqueza del pueblo.",
    categoria: "MINERIA",
    fuente: "Historia",
    tags: ["valioso", "plata"],
    likes: 289
  },
  {
    id: "15",
    texto: "Bajar como agua de manantial",
    significado: "Hacer algo con facilidad y fluidez. Los manantiales son abundantes en la región.",
    categoria: "GENERAL",
    fuente: "Naturaleza",
    tags: ["fluidez", "agua"],
    likes: 98
  }
];

const DichosPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSaid, setExpandedSaid] = useState<string | null>(null);
  const [likedDichos, setLikedDichos] = useState<Set<string>>(new Set());

  // Filter dichos
  const filteredDichos = DICHOS.filter(dicho => {
    const matchesCategory = selectedCategory === "all" || dicho.categoria === selectedCategory;
    const matchesSearch = dicho.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dicho.significado.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle like
  const handleLike = (id: string) => {
    setLikedDichos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get random category for featured section
  const featuredDichos = DICHOS.slice(0, 3);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-amber-900/20 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.1),transparent_70%)]" />
          
          <div className="container mx-auto px-4 md:px-8 pt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Patrimonio Cultural
                </Badge>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Dichos del{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  Pueblo
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Descubre las expresiones, dichos y frases típicas que han marcado la identidad 
                de Real del Monte a lo largo de más de 200 años de historia minera y cultural.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar Dichos
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar dichos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Section */}
          {selectedCategory === "all" && !searchQuery && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Dichos Destacados
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredDichos.map((dicho, index) => (
                  <motion.div
                    key={dicho.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50">
                      <CardContent className="p-6">
                        <Quote className="w-8 h-8 text-amber-500/30 mb-4" />
                        <p className="font-serif text-xl font-bold text-foreground mb-3">
                          "{dicho.texto}"
                        </p>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {dicho.significado}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {CATEGORIES.find(c => c.id === dicho.categoria)?.icon} {dicho.categoria.replace("_", " ")}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className={`w-4 h-4 ${likedDichos.has(dicho.id) ? "fill-red-500 text-red-500" : ""}`} />
                            {dicho.likes}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Stats */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{DICHOS.length}</p>
                  <p className="text-sm text-muted-foreground">Dichos Registrados</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{CATEGORIES.length - 1}</p>
                  <p className="text-sm text-muted-foreground">Categorías</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">200+</p>
                  <p className="text-sm text-muted-foreground">Años de Historia</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">15+</p>
                  <p className="text-sm text-muted-foreground">Etiquetas</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dichos Grid */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-6">
              {selectedCategory === "all" 
                ? "Todos los Dichos" 
                : CATEGORIES.find(c => c.id === selectedCategory)?.icon + " " + CATEGORIES.find(c => c.id === selectedCategory)?.label
              }
            </h2>
            
            {filteredDichos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Quote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron dichos con esa búsqueda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredDichos.map((dicho, index) => (
                    <motion.div
                      key={dicho.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`h-full cursor-pointer transition-all hover:shadow-lg ${
                          expandedSaid === dicho.id ? "ring-2 ring-amber-500" : ""
                        }`}
                        onClick={() => setExpandedSaid(expandedSaid === dicho.id ? null : dicho.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Quote className="w-6 h-6 text-amber-500/50 shrink-0" />
                            <Badge variant="outline" className="text-xs shrink-0">
                              {CATEGORIES.find(c => c.id === dicho.categoria)?.icon}
                            </Badge>
                          </div>
                          
                          <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                            "{dicho.texto}"
                          </h3>
                          
                          <AnimatePresence>
                            {expandedSaid === dicho.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                                  <strong>Significado:</strong> {dicho.significado}
                                </p>
                                {dicho.fuente && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    <strong>Fuente:</strong> {dicho.fuente}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {dicho.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(dicho.id);
                              }}
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${likedDichos.has(dicho.id) ? "fill-red-500 text-red-500" : ""}`} />
                              {dicho.likes + (likedDichos.has(dicho.id) ? 1 : 0)}
                            </button>
                            <button className="text-sm text-muted-foreground hover:text-amber-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Contribute Section */}
          <section className="mt-16">
            <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              <CardContent className="p-8 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h3 className="font-serif text-2xl font-bold mb-2">
                  ¿Conoces algún dicho tradicional?
                </h3>
                <p className="opacity-80 mb-6 max-w-xl mx-auto">
                  Ayúdanos a preservar la cultura de Real del Monte contribuyendo con 
                  dichos o expresiones tradicionales que conozcas.
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-700 hover:bg-white/90"
                >
                  Contribuir con un Dichos
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default DichosPage;
