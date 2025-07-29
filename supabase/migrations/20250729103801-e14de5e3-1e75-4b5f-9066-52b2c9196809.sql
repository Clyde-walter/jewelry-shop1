-- Add policy for users to upload payment screenshots to product-images bucket
CREATE POLICY "Users can upload payment screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.uid() IS NOT NULL 
  AND (storage.foldername(name))[1] = 'payment-screenshots'
);