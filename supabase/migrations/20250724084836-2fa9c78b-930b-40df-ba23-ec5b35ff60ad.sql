-- First, let's create the crypto_wallets table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.crypto_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency TEXT NOT NULL UNIQUE CHECK (currency IN ('BTC', 'LTC', 'ETH', 'USDT')),
  wallet_address TEXT NOT NULL,
  qr_code_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for crypto_wallets if not already enabled
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view active crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Admins can manage crypto wallets" ON public.crypto_wallets;

CREATE POLICY "Anyone can view active crypto wallets" 
ON public.crypto_wallets 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage crypto wallets" 
ON public.crypto_wallets 
FOR ALL 
USING (is_admin());

-- Update existing crypto_payments table structure
ALTER TABLE public.crypto_payments 
ADD COLUMN IF NOT EXISTS proof_images TEXT[] DEFAULT '{}';

-- Insert default wallet addresses if they don't exist
INSERT INTO public.crypto_wallets (currency, wallet_address, is_active) 
VALUES
('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', true),
('LTC', 'ltc1qsgx5lmqy8wqem2deks0d6c8zxm0jklm8q9x7v2', true),
('ETH', '0x742d35Cc6634C0532925a3b8D404E8E86A7C5e67', true),
('USDT', '0x742d35Cc6634C0532925a3b8D404E8E86A7C5e67', true)
ON CONFLICT (currency) DO NOTHING;