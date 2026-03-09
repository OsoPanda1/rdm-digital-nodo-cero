import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

import heroVideo from "@/assets/hero-video.mp4";
import ctaVideo from "@/assets/RDM Digital_Call To Action_2_2026-03-03 05_52_52.mp4";
import leyendaVideo from "@/assets/leyenda1.mp4";

import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import pasteImg from "@/assets/paste.webp";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoSrc: string;
  duration: string;
  category: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "Real del Monte — Pueblo Mágico",
    description: "Vuelo cinematográfico por las calles y paisajes del pueblo minero",
    thumbnail: heroImg,
    videoSrc: heroVideo,
    duration: "2:30",
    category: "Introducción"
  },
  {
    id: "2",
    title: "RDM Digital — Innovación Turística 2026",
    description: "Presentación oficial de la plataforma digital de Real del Monte",
    thumbnail: callesImg,
    videoSrc: ctaVideo,
    duration: "1:15",
    category: "Tecnología"
  },
  {
    id: "3",
    title: "Leyendas de la Mina",
    description: "Relatos y misterios de los túneles que guardan 460 años de historia",
    thumbnail: minaImg,
    videoSrc: leyendaVideo,
    duration: "4:20",
    category: "Historia"
  },
  {
    id: "4",
    title: "Tour por la Mina de Acosta",
    description: "Descenso a 460 metros bajo tierra con guía especializado",
    thumbnail: minaImg,
    videoSrc: heroVideo,
    duration: "5:45",
    category: "Aventura"
  },
  {
    id: "5",
    title: "Panteón Inglés al Atardecer",
    description: "El cementerio anglicano más alto del mundo bañado en luz dorada",
    thumbnail: panteonImg,
    videoSrc: heroVideo,
    duration: "3:15",
    category: "Historia"
  },
  {
    id: "6",
    title: "Peñas Cargadas — Senderismo",
    description: "Recorrido por las formaciones rocosas más impresionantes de la sierra",
    thumbnail: penasImg,
    videoSrc: heroVideo,
    duration: "4:00",
    category: "Naturaleza"
  },
];

export const VideoCard = ({ video, onClick }: { video: Video; onClick: () => void }) => {
  return (
    <motion.div
      className="group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative rounded-2xl overflow-hidden aspect-video mb-3">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6 text-white ml-1" fill="white" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 text-white text-xs font-medium">
          {video.duration}
        </div>
        
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {video.category}
        </div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
      
      <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-amber-500 transition-colors">
        {video.title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
    </motion.div>
  );
};

export const VideoPlayer = ({ video, onClose }: { video: Video; onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={video.videoSrc}
          poster={video.thumbnail}
          autoPlay
          className="w-full h-full object-cover"
          onTimeUpdate={(e) => {
            const vid = e.target as HTMLVideoElement;
            setProgress((vid.currentTime / vid.duration) * 100);
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="absolute top-4 left-4">
            <h3 className="text-white font-serif text-xl">{video.title}</h3>
            <p className="text-white/70 text-sm">{video.description}</p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (videoRef.current) {
                    if (isPlaying) videoRef.current.pause();
                    else videoRef.current.play();
                    setIsPlaying(!isPlaying);
                  }
                }}
                className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" fill="white" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />}
              </button>
              
              <button 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium text-amber-500 mb-4">
              🎬 Videos Reales
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              Galería Audiovisual
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Videos reales filmados en Real del Monte — experimenta la magia del Pueblo Mágico
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoCard 
                  video={video} 
                  onClick={() => setSelectedVideo(video)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedVideo && (
          <VideoPlayer 
            video={selectedVideo} 
            onClose={() => setSelectedVideo(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoGallery;
