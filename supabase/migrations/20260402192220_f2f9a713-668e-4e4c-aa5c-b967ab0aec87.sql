
-- =============================================
-- RDM Digital - Core Tables
-- =============================================

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'tourist' CHECK (role IN ('tourist', 'business_owner', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Businesses table
-- =============================================
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'OTROS',
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT,
  video_url TEXT,
  schedule_display TEXT,
  facebook TEXT,
  instagram TEXT,
  tiktok TEXT,
  price_range TEXT DEFAULT 'MODERADO',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active businesses"
  ON public.businesses FOR SELECT
  USING (status = 'active' OR owner_id = auth.uid());

CREATE POLICY "Authenticated users can create businesses"
  ON public.businesses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own businesses"
  ON public.businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- =============================================
-- Events table
-- =============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  category TEXT NOT NULL DEFAULT 'general',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- =============================================
-- Analytics table
-- =============================================
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
  ON public.analytics FOR INSERT
  WITH CHECK (true);

-- =============================================
-- System logs
-- =============================================
CREATE TABLE public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logs insert for all"
  ON public.system_logs FOR INSERT
  WITH CHECK (true);

-- =============================================
-- User roles table (security best practice)
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies for businesses (admins can update any)
CREATE POLICY "Admins can update any business"
  ON public.businesses FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete businesses"
  ON public.businesses FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin read for analytics/logs
CREATE POLICY "Admins can read analytics"
  ON public.analytics FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read logs"
  ON public.system_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage events
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
