-- Drop existing crypto payment tables completely
DROP TABLE IF EXISTS public.crypto_payments CASCADE;
DROP TABLE IF EXISTS public.crypto_wallets CASCADE;

-- Create fresh crypto_wallets table
CREATE TABLE public.crypto_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency TEXT NOT NULL,
  wallet_address TEXT NOT NULL UNIQUE,
  qr_code_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fresh crypto_payments table
CREATE TABLE public.crypto_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  wallet_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  customer_info JSONB NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  cart_items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  proof_images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for crypto_wallets
CREATE POLICY "Anyone can view active crypto wallets" 
ON public.crypto_wallets 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage crypto wallets" 
ON public.crypto_wallets 
FOR ALL 
USING (is_admin());

-- Create RLS policies for crypto_payments
CREATE POLICY "System can insert crypto payments" 
ON public.crypto_payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all crypto payments" 
ON public.crypto_payments 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update crypto payments" 
ON public.crypto_payments 
FOR UPDATE 
USING (is_admin());

-- Create trigger for crypto payment confirmation timestamp
CREATE OR REPLACE FUNCTION public.update_crypto_payment_confirmed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.confirmed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crypto_payment_confirmed_at_trigger
BEFORE UPDATE ON public.crypto_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_crypto_payment_confirmed_at();