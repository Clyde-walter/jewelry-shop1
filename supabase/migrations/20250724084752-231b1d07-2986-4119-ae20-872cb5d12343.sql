-- Create crypto_wallets table for storing wallet addresses and QR codes
CREATE TABLE public.crypto_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency TEXT NOT NULL UNIQUE CHECK (currency IN ('BTC', 'LTC', 'ETH', 'USDT')),
  wallet_address TEXT NOT NULL,
  qr_code_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crypto_payments table for tracking payments
CREATE TABLE public.crypto_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  currency TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  customer_info JSONB NOT NULL,
  cart_items JSONB NOT NULL,
  proof_images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  admin_notes TEXT,
  confirmed_by UUID,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Policies for crypto_wallets
CREATE POLICY "Anyone can view active crypto wallets" 
ON public.crypto_wallets 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage crypto wallets" 
ON public.crypto_wallets 
FOR ALL 
USING (is_admin());

-- Policies for crypto_payments
CREATE POLICY "Anyone can create crypto payments" 
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

-- Insert default wallet addresses (you can update these later)
INSERT INTO public.crypto_wallets (currency, wallet_address, is_active) VALUES
('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', true),
('LTC', 'ltc1qsgx5lmqy8wqem2deks0d6c8zxm0jklm8q9x7v2', true),
('ETH', '0x742d35Cc6634C0532925a3b8D404E8E86A7C5e67', true),
('USDT', '0x742d35Cc6634C0532925a3b8D404E8E86A7C5e67', true);

-- Create function to update crypto payment timestamps
CREATE OR REPLACE FUNCTION public.update_crypto_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.confirmed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for crypto payments
CREATE TRIGGER update_crypto_payments_timestamp
  BEFORE UPDATE ON public.crypto_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crypto_payment_timestamp();