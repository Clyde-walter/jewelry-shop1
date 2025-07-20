-- Create crypto_payments table to track pending crypto payments
CREATE TABLE public.crypto_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  wallet_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  admin_notes TEXT,
  customer_info JSONB NOT NULL,
  cart_items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for crypto_payments
CREATE POLICY "Admins can view all crypto payments" 
ON public.crypto_payments 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update crypto payments" 
ON public.crypto_payments 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "System can insert crypto payments" 
ON public.crypto_payments 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_crypto_payments_status ON public.crypto_payments(status);
CREATE INDEX idx_crypto_payments_created_at ON public.crypto_payments(created_at);
CREATE INDEX idx_crypto_payments_customer_email ON public.crypto_payments(customer_email);

-- Create function to update confirmed_at timestamp
CREATE OR REPLACE FUNCTION public.update_crypto_payment_confirmed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.confirmed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_crypto_payment_confirmed_at_trigger
BEFORE UPDATE ON public.crypto_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_crypto_payment_confirmed_at();