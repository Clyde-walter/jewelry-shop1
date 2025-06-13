
-- First, delete all objects from the incorrectly named bucket
DELETE FROM storage.objects WHERE bucket_id = 'products-images';

-- Drop the incorrectly named bucket policies if they exist
DROP POLICY IF EXISTS "Public Access for Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;

-- Now we can safely delete the bucket
DELETE FROM storage.buckets WHERE id = 'products-images';

-- Create the correct storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 
  'product-images', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for the product-images bucket
CREATE POLICY "Public Access for Product Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Admin can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
