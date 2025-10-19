-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 280),
  profile_photo_url TEXT,
  linkedin_url TEXT,
  slug TEXT UNIQUE,
  wall_position_x NUMERIC DEFAULT random() * 1000,
  wall_position_y NUMERIC DEFAULT random() * 600,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrichments table
CREATE TABLE public.enrichments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('link', 'image')),
  url TEXT NOT NULL,
  title TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create magic link tokens table
CREATE TABLE public.magic_link_tokens (
  token TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies for enrichments
CREATE POLICY "Enrichments are viewable by everyone"
  ON public.enrichments FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own enrichments"
  ON public.enrichments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = enrichments.user_id
      AND email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- RLS Policies for magic_link_tokens (service role only)
CREATE POLICY "Service role only"
  ON public.magic_link_tokens FOR ALL
  USING (false);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_enrichments_user_id ON public.enrichments(user_id);
CREATE INDEX idx_magic_tokens_email ON public.magic_link_tokens(email);
CREATE INDEX idx_magic_tokens_expires ON public.magic_link_tokens(expires_at);
CREATE INDEX idx_user_profiles_slug ON public.user_profiles(slug);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);