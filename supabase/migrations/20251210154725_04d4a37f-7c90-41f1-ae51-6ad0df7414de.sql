-- Create a SECURITY DEFINER function to update user profiles (bypasses RLS)
CREATE OR REPLACE FUNCTION public.update_user_profile(
  profile_id UUID,
  profile_photo_url TEXT DEFAULT NULL,
  profile_name TEXT DEFAULT NULL,
  profile_job_title TEXT DEFAULT NULL,
  profile_company_name TEXT DEFAULT NULL,
  profile_linkedin_url TEXT DEFAULT NULL,
  profile_card_screenshot_url TEXT DEFAULT NULL,
  profile_screenshot_generated_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    profile_photo_url = COALESCE(update_user_profile.profile_photo_url, user_profiles.profile_photo_url),
    name = COALESCE(update_user_profile.profile_name, user_profiles.name),
    job_title = COALESCE(update_user_profile.profile_job_title, user_profiles.job_title),
    company_name = COALESCE(update_user_profile.profile_company_name, user_profiles.company_name),
    linkedin_url = COALESCE(update_user_profile.profile_linkedin_url, user_profiles.linkedin_url),
    card_screenshot_url = COALESCE(update_user_profile.profile_card_screenshot_url, user_profiles.card_screenshot_url),
    screenshot_generated_at = COALESCE(update_user_profile.profile_screenshot_generated_at, user_profiles.screenshot_generated_at),
    updated_at = NOW()
  WHERE id = profile_id;
  
  RETURN FOUND;
END;
$$;