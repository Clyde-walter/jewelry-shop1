
-- 1. Create the storage bucket for user profile images (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit (adjust if needed)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 2. Allow anyone to read files (public)
CREATE POLICY "Public access for profile images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-images');

-- 3. Allow authenticated users to upload their own files
CREATE POLICY "Authenticated can upload profile images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'profile-images');

-- 4. Allow authenticated users to update their own files
CREATE POLICY "Authenticated can update profile images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'profile-images');

-- 5. Allow authenticated users to delete their own files
CREATE POLICY "Authenticated can delete profile images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'profile-images');
