
-- Create customers table to replace mock data
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_order TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table (admin access)
CREATE POLICY "Admin can view all customers" 
  ON public.customers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can insert customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin can update customers" 
  ON public.customers 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admin can delete customers" 
  ON public.customers 
  FOR DELETE 
  USING (true);

-- Add foreign key to orders table to link with customers
ALTER TABLE public.orders 
ADD COLUMN customer_id UUID REFERENCES public.customers(id);

-- Create function to update customer stats when orders change
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update customer stats on new order
    UPDATE public.customers 
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total,
      last_order = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.customer_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update customer stats on order update
    IF OLD.customer_id IS NOT NULL THEN
      UPDATE public.customers 
      SET 
        total_spent = total_spent - OLD.total,
        updated_at = NOW()
      WHERE id = OLD.customer_id;
    END IF;
    
    IF NEW.customer_id IS NOT NULL THEN
      UPDATE public.customers 
      SET 
        total_spent = total_spent + NEW.total,
        last_order = NEW.created_at,
        updated_at = NOW()
      WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update customer stats on order deletion
    UPDATE public.customers 
    SET 
      total_orders = GREATEST(total_orders - 1, 0),
      total_spent = GREATEST(total_spent - OLD.total, 0),
      updated_at = NOW()
    WHERE id = OLD.customer_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer stats updates
CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- Enable realtime for all tables
ALTER TABLE public.collections REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.customers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
