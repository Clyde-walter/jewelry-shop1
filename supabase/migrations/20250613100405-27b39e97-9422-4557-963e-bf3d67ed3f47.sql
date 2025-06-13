
-- Create storage bucket for product and collection images
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
