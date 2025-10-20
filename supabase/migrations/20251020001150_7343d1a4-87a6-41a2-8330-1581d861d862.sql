-- Add screenshot tracking columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS card_screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS screenshot_generated_at TIMESTAMP WITH TIME ZONE;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_slug ON user_profiles(slug) WHERE slug IS NOT NULL;

-- Create profile-screenshots storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-screenshots', 'profile-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view screenshots
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-screenshots');

-- Allow authenticated users to upload their screenshots
CREATE POLICY "Users can upload screenshots"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-screenshots');

-- Allow users to update their own screenshots
CREATE POLICY "Users can update screenshots"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'profile-screenshots');