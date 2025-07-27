-- Create the missing update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for payment method settings
CREATE TABLE public.payment_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  sort_code TEXT,
  btc_address TEXT NOT NULL,
  usdt_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for CPT payment confirmations
CREATE TABLE public.cpt_payment_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  payment_method TEXT NOT NULL, -- 'bank-transfer' or 'crypto'
  screenshot_url TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpt_payment_confirmations ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_settings
CREATE POLICY "Anyone can view payment settings" 
ON public.payment_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage payment settings" 
ON public.payment_settings 
FOR ALL 
USING (is_admin());

-- RLS policies for cpt_payment_confirmations
CREATE POLICY "Users can create their own payment confirmations" 
ON public.cpt_payment_confirmations 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own payment confirmations" 
ON public.cpt_payment_confirmations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payment confirmations" 
ON public.cpt_payment_confirmations 
FOR ALL 
USING (is_admin());

-- Insert default payment settings
INSERT INTO public.payment_settings (
  bank_name, 
  account_name, 
  account_number, 
  sort_code, 
  btc_address, 
  usdt_address
) VALUES (
  'First Bank Nigeria',
  'YourStore Limited',
  '2034567890',
  '011-234-567',
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
);

-- Create triggers for updating timestamps
CREATE TRIGGER update_payment_settings_updated_at
BEFORE UPDATE ON public.payment_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cpt_payment_confirmations_updated_at
BEFORE UPDATE ON public.cpt_payment_confirmations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();