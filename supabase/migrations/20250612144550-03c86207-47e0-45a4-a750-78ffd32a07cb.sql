
-- Create collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('rings', 'necklaces', 'earrings', 'bracelets', 'watches', 'pendants')),
  images TEXT[] DEFAULT '{}',
  product_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections (public read, admin write)
CREATE POLICY "Anyone can view collections" 
  ON public.collections 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage collections" 
  ON public.collections 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage products" 
  ON public.products 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- RLS Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Function to update collection product count
CREATE OR REPLACE FUNCTION update_collection_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.collection_id IS NOT NULL THEN
    UPDATE public.collections 
    SET product_count = product_count + 1,
        updated_at = NOW()
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' AND OLD.collection_id IS NOT NULL THEN
    UPDATE public.collections 
    SET product_count = GREATEST(product_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.collection_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.collection_id IS DISTINCT FROM NEW.collection_id THEN
      IF OLD.collection_id IS NOT NULL THEN
        UPDATE public.collections 
        SET product_count = GREATEST(product_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.collection_id;
      END IF;
      IF NEW.collection_id IS NOT NULL THEN
        UPDATE public.collections 
        SET product_count = product_count + 1,
            updated_at = NOW()
        WHERE id = NEW.collection_id;
      END IF;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update collection product counts
CREATE TRIGGER update_collection_product_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_collection_product_count();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_sequence')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;
