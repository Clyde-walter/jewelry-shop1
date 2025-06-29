
-- Add fields to products table to mark them as featured or most picked
ALTER TABLE public.products 
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN is_most_picked BOOLEAN DEFAULT false,
ADD COLUMN featured_order INTEGER DEFAULT 0,
ADD COLUMN most_picked_order INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_is_most_picked ON public.products(is_most_picked);
CREATE INDEX idx_products_featured_order ON public.products(featured_order);
CREATE INDEX idx_products_most_picked_order ON public.products(most_picked_order);

-- Update existing products to have some as featured and most picked (optional sample data)
-- You can customize this based on your actual products
UPDATE public.products 
SET is_featured = true, featured_order = 1 
WHERE id = (SELECT id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 0);

UPDATE public.products 
SET is_featured = true, featured_order = 2 
WHERE id = (SELECT id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 1);

UPDATE public.products 
SET is_most_picked = true, most_picked_order = 1 
WHERE id = (SELECT id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 2);

UPDATE public.products 
SET is_most_picked = true, most_picked_order = 2 
WHERE id = (SELECT id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 3);
