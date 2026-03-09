
-- Forum posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL DEFAULT 'Visitante',
  author_email TEXT,
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  place_name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  likes INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Forum comments table
CREATE TABLE public.forum_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Visitante',
  author_email TEXT,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved posts
CREATE POLICY "Anyone can read approved posts"
  ON public.forum_posts FOR SELECT
  USING (is_approved = true);

-- Anyone can insert posts (public forum)
CREATE POLICY "Anyone can create posts"
  ON public.forum_posts FOR INSERT
  WITH CHECK (true);

-- Everyone can read comments
CREATE POLICY "Anyone can read comments"
  ON public.forum_comments FOR SELECT
  USING (true);

-- Anyone can insert comments
CREATE POLICY "Anyone can create comments"
  ON public.forum_comments FOR INSERT
  WITH CHECK (true);

-- Seed some initial forum posts
INSERT INTO public.forum_posts (author_name, author_avatar, title, content, place_name, category, likes) VALUES
  ('María González', 'M', '¡Mi primer paste en Real del Monte!', 'Nunca había probado un paste tan delicioso. El de papa con carne es increíble, pero el de mole me sorprendió aún más. Definitivamente volveré por más. Las pastelerías del centro tienen una tradición de más de 5 generaciones. 🥟', 'Centro Histórico', 'gastronomia', 42),
  ('Carlos Ruiz', 'C', 'Experiencia en la Mina de Acosta', 'Bajar 460 metros bajo tierra fue una experiencia única. El guía nos contó historias fascinantes sobre los mineros cornish del siglo XIX. Se siente la historia en cada rincón. Llevar chamarra porque hace frío allá abajo (14°C constantes). ⛏️', 'Mina de Acosta', 'aventura', 38),
  ('Ana López', 'A', 'Atardecer en el Panteón Inglés', 'El cementerio más alto del mundo tiene una energía especial. Las tumbas victorianas entre los árboles de oyamel crean una atmósfera única. Fui al atardecer y la luz dorada entre la neblina fue mágica. 📸', 'Panteón Inglés', 'historia', 55),
  ('Pedro Sánchez', 'P', 'Senderismo en Peñas Cargadas', 'Las formaciones rocosas son impresionantes. Caminamos 2 horas entre el bosque de oyamel y las vistas del pueblo son espectaculares. Perfecto para fotografía de paisaje. 🏔️', 'Peñas Cargadas', 'naturaleza', 29),
  ('Laura Martínez', 'L', 'Festival del Paste 2025', 'Asistí al Festival Internacional del Paste y fue increíble. Más de 50 variedades, música en vivo, desfile de carros alegóricos. La mejor fiesta gastronómica de Hidalgo. ¡Nos vemos en octubre! 🎉', 'Plaza Principal', 'cultura', 67),
  ('Diego Fernández', 'D', 'La niebla mágica de Real del Monte', 'Despertar en Real del Monte envuelto en niebla es como estar en una película. Las calles coloniales cobran vida propia con esa atmósfera misteriosa. Un pueblo que hay que visitar al menos una vez en la vida. 🌫️', 'Calles Coloniales', 'general', 44),
  ('Isabella Torres', 'I', 'Ruta gastronómica completa', 'Hicimos la ruta gastronómica guiada de 6 horas. Desayuno tradicional, taller de paste, recorrido por pastelerías centenarias, y terminamos con barbacoa estilo Hidalgo. Vale cada peso invertido. 🍽️', 'Centro Histórico', 'gastronomia', 51),
  ('Roberto Hernández', 'R', 'Primer partido de fútbol en México', '¿Sabían que el primer partido de fútbol en México se jugó aquí en 1900? Los mineros ingleses lo trajeron. Real del Monte es cuna del fútbol mexicano. Historia pura. ⚽', 'Real del Monte', 'historia', 33);

-- Enable realtime for forum
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
