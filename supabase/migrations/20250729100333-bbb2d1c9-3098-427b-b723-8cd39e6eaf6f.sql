-- Create payment confirmations table with proper structure
CREATE TABLE IF NOT EXISTS public.payment_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank-transfer', 'crypto')),
  payment_type TEXT CHECK (payment_type IN ('btc', 'usdt')), -- for crypto payments
  screenshot_url TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies for payment confirmations
CREATE POLICY "Users can create their own payment confirmations" 
ON public.payment_confirmations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment confirmations" 
ON public.payment_confirmations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment confirmations" 
ON public.payment_confirmations 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_confirmations_updated_at
BEFORE UPDATE ON public.payment_confirmations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_payment_confirmations_order_id ON public.payment_confirmations(order_id);
CREATE INDEX idx_payment_confirmations_user_id ON public.payment_confirmations(user_id);
CREATE INDEX idx_payment_confirmations_status ON public.payment_confirmations(status);