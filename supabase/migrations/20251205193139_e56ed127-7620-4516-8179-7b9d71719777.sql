-- Fix the view to use SECURITY INVOKER (safer - uses querying user's permissions)
DROP VIEW IF EXISTS public.user_profiles_public;

CREATE VIEW public.user_profiles_public 
WITH (security_invoker = true)
AS
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

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.user_profiles_public TO anon, authenticated;