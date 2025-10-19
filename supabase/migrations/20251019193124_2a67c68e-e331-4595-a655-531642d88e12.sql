-- Add job_title and company_name to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN job_title TEXT,
ADD COLUMN company_name TEXT;

-- Make bio optional (already nullable, but good to be explicit)
-- Remove the bio field from being generated, users can add it themselves later