-- Drop the existing view
DROP VIEW IF EXISTS public.user_profiles_public;

-- Remove public read access to the underlying table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Create policy: only authenticated users can see their own profile, admins can see all
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (
  email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  OR has_role(auth.uid(), 'admin')
);

-- Create a security definer function to get public profile data (without email)
-- This is safe because we explicitly control what data is returned
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id uuid,
  name text,
  job_title text,
  company_name text,
  bio text,
  profile_photo_url text,
  linkedin_url text,
  slug text,
  wall_position_x numeric,
  wall_position_y numeric,
  card_screenshot_url text,
  screenshot_generated_at timestamptz,
  screenshot_version integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    name,
    job_title,
    company_name,
    bio,
    profile_photo_url,
    linkedin_url,
    slug,
    wall_position_x,
    wall_position_y,
    card_screenshot_url,
    screenshot_generated_at,
    screenshot_version,
    created_at,
    updated_at
  FROM public.user_profiles;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;