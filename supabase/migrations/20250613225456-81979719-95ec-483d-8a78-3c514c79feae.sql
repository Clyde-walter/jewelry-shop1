
-- First, let's create a junction table to properly manage the many-to-many relationship between collections and products
CREATE TABLE public.collection_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

-- Enable RLS for collection_products
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

-- Create policies for collection_products (public read, admin write)
CREATE POLICY "Anyone can view collection products" 
  ON public.collection_products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage collection products" 
  ON public.collection_products 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Update the collections table to better support our needs
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create a function to update collection product count based on junction table
CREATE OR REPLACE FUNCTION update_collection_product_count_from_junction()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.collections 
    SET product_count = (
      SELECT COUNT(*) FROM public.collection_products 
      WHERE collection_id = NEW.collection_id
    ),
    updated_at = NOW()
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.collections 
    SET product_count = (
      SELECT COUNT(*) FROM public.collection_products 
      WHERE collection_id = OLD.collection_id
    ),
    updated_at = NOW()
    WHERE id = OLD.collection_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the junction table
CREATE TRIGGER update_collection_product_count_junction_trigger
  AFTER INSERT OR DELETE ON public.collection_products
  FOR EACH ROW EXECUTE FUNCTION update_collection_product_count_from_junction();

-- Insert some sample collections data
INSERT INTO public.collections (name, description, category, images, featured, sort_order) VALUES
('Diamond Elegance', 'Exquisite diamond jewelry collection featuring timeless designs', 'rings', 
 ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop', 
       'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop'], 
 true, 1),
('Golden Grace', 'Elegant gold jewelry pieces for every occasion', 'necklaces', 
 ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=600&fit=crop',
       'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=600&fit=crop'], 
 true, 2),
('Pearl Perfection', 'Classic pearl jewelry with modern sophistication', 'earrings', 
 ARRAY['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=600&fit=crop',
       'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop'], 
 false, 3);
