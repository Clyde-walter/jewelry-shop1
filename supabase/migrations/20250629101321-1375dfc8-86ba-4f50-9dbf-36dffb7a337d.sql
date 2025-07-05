
-- Create table for warranty claims
CREATE TABLE public.warranty_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  product_name TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  issue_description TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for contact requests
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for return requests
CREATE TABLE public.return_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_notes TEXT,
  return_label_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for support requests (this will replace the localStorage implementation)
CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for warranty_claims
CREATE POLICY "Users can view their own warranty claims" ON public.warranty_claims
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create warranty claims" ON public.warranty_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all warranty claims" ON public.warranty_claims
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update warranty claims" ON public.warranty_claims
  FOR UPDATE USING (public.is_admin());

-- Create policies for contact_requests
CREATE POLICY "Users can view their own contact requests" ON public.contact_requests
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create contact requests" ON public.contact_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all contact requests" ON public.contact_requests
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update contact requests" ON public.contact_requests
  FOR UPDATE USING (public.is_admin());

-- Create policies for return_requests
CREATE POLICY "Users can view their own return requests" ON public.return_requests
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create return requests" ON public.return_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all return requests" ON public.return_requests
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update return requests" ON public.return_requests
  FOR UPDATE USING (public.is_admin());

-- Create policies for support_requests
CREATE POLICY "Users can view their own support requests" ON public.support_requests
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create support requests" ON public.support_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all support requests" ON public.support_requests
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update support requests" ON public.support_requests
  FOR UPDATE USING (public.is_admin());

-- Create indexes for better performance
CREATE INDEX idx_warranty_claims_user_id ON public.warranty_claims(user_id);
CREATE INDEX idx_warranty_claims_status ON public.warranty_claims(status);
CREATE INDEX idx_contact_requests_user_id ON public.contact_requests(user_id);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_return_requests_user_id ON public.return_requests(user_id);
CREATE INDEX idx_return_requests_status ON public.return_requests(status);
CREATE INDEX idx_support_requests_user_id ON public.support_requests(user_id);
CREATE INDEX idx_support_requests_status ON public.support_requests(status);
