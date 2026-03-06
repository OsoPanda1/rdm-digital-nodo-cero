import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// Import additional RDM images
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import pasteImg from "@/assets/paste.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";
import rdm3 from "@/assets/rdm01.jpg";
import rdm4 from "@/assets/rdm02.jpg";
import rdm5 from "@/assets/rdm03.jpg";
import rdm6 from "@/assets/rdm04.jpg";
import rdm7 from "@/assets/rdm05.jpg";
import rdm8 from "@/assets/rdm06.jpeg";
import rdm9 from "@/assets/rdm7.jpeg";
import rdm10 from "@/assets/rdm08.jpeg";
import rdm11 from "@/assets/rmd5.jpeg";
import rdm12 from "@/assets/rmd6.jpeg";

interface Image {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
}

const galleryImages: Image[] = [
  // Historia (5 imágenes)
  { id: "1", src: minaImg, title: "Mina de Acosta", category: "Historia", description: "Descenso a 450 metros bajo tierra" },
  { id: "2", src: panteonImg, title: "Panteón Inglés", category: "Historia", description: "El cementerio más alto del mundo" },
  { id: "3", src: callesImg, title: "Calles Coloniales", category: "Historia", description: "Arquitectura del siglo XIX" },
  { id: "4", src: heroImg, title: "Vista Panorámica", category: "Historia", description: "El pueblo entre la neblina" },
  { id: "5", src: penasImg, title: "Peñas Cargadas", category: "Historia", description: "Formaciones milenarias" },
  
  // Cultura (5 imágenes)
  { id: "6", src: pasteImg, title: "Paste Tradicional", category: "Cultura", description: "Cuna del paste en México" },
  { id: "7", src: rdm1, title: "Portal del Comercio", category: "Cultura", description: "Centro histórico" },
  { id: "8", src: rdm2, title: "Parroquia", category: "Cultura", description: "Templo del siglo XVIII" },
  { id: "9", src: rdm3, title: "Museo del Paste", category: "Cultura", description: "Único en el mundo" },
  { id: "10", src: rdm4, title: "Casa de la Cultura", category: "Cultura", description: "Eventos y exposiciones" },
  
  // Naturaleza (5 imágenes)
  { id: "11", src: penasImg, title: "Sendero Peñas", category: "Naturaleza", description: "Vista panorámica del valle" },
  { id: "12", src: rdm5, title: "Bosque de Oyamel", category: "Naturaleza", description: "Flora nativa" },
  { id: "13", src: rdm6, title: "Mirador", category: "Naturaleza", description: "Atardecer en la sierra" },
  { id: "14", src: rdm7, title: "Niebla Matutina", category: "Naturaleza", description: "Característica del clima" },
  { id: "15", src: rdm8, title: "Río de la Sierra", category: "Naturaleza", description: "Aguas cristalinas" },
  
  // Gastronomía (5 imágenes)
  { id: "16", src: pasteImg, title: "Variedades de Paste", category: "Gastronomía", description: "Más de 50 sabores" },
  { id: "17", src: rdm9, title: "Pastelería Tradicional", category: "Gastronomía", description: "Horneado artesanal" },
  { id: "18", src: rdm10, title: "Café de Altura", category: "Gastronomía", description: "Cultivado localmente" },
  { id: "19", src: rdm11, title: "Restaurante Vista", category: "Gastronomía", description: "Comida con panorámica" },
  { id: "20", src: rdm12, title: "Barbacoa Estilo Hidalgo", category: "Gastronomía", description: "Tradición del domingo" },
  
  // Arte (5 imágenes)
  { id: "21", src: rdm1, title: "Artesanía Local", category: "Arte", description: "Trabajos en plata" },
  { id: "22", src: rdm2, title: "Escultura Minera", category: "Arte", description: "Arte en metal" },
  { id: "23", src: panteonImg, title: "Pintura Colonial", category: "Arte", description: "Obras locales" },
  { id: "24", src: rdm3, title: "Textiles Tradicionales", category: "Arte", description: "Bordado otomí" },
  { id: "25", src: rdm4, title: "Fotografía Documental", category: "Arte", description: "Capturando la esencia" },
];

const categories = ["Todas", "Historia", "Cultura", "Naturaleza", "Gastronomía", "Arte"];

export const ImageGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = selectedCategory === "Todas" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: Image, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const navigate = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium text-[hsl(43,65%,52%)] mb-4">
            Galería Visual
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Real del Monte en Imágenes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Una colección de 25 fotografías que capturan la esencia de nuestro Pueblo Mágico
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[hsl(43,65%,52%)] text-white shadow-lg"
                  : "glass hover:border-[hsl(43,65%,52%)]/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
                onClick={() => openLightbox(image, index)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] uppercase tracking-wider text-[hsl(43,65%,52%)] mb-1">
                    {image.category}
                  </span>
                  <h3 className="text-white font-medium text-sm">{image.title}</h3>
                  <p className="text-white/70 text-xs mt-1 line-clamp-1">{image.description}</p>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate("next"); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Caption */}
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <span className="text-[hsl(43,65%,52%)] text-sm uppercase tracking-wider">
                  {selectedImage.category}
                </span>
                <h3 className="text-white font-display text-2xl mt-1">{selectedImage.title}</h3>
                <p className="text-white/60 text-sm mt-1">{selectedImage.description}</p>
                <p className="text-white/40 text-xs mt-3">
                  {currentIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ImageGallery;
