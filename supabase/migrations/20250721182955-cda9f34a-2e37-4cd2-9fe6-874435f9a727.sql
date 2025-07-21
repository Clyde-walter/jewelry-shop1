-- Create order_locations table for tracking shipping progress
CREATE TABLE public.order_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'in_transit',
  notes TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for order locations
CREATE POLICY "Admins can manage order locations" 
ON public.order_locations 
FOR ALL 
USING (is_admin());

CREATE POLICY "Users can view their order locations" 
ON public.order_locations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_locations.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_order_location_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_order_locations_updated_at
BEFORE UPDATE ON public.order_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_order_location_updated_at();