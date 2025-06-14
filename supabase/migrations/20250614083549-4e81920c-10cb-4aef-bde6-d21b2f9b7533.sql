
-- Create email_templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('auth_confirmation', 'auth_password_reset', 'auth_magic_link', 'newsletter', 'order_status', 'promotion', 'welcome', 'support')),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_history table
CREATE TABLE public.email_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  recipient_type TEXT NOT NULL,
  recipient_email TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'scheduled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to both tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

-- Create policies for email_templates (admin access only for now)
CREATE POLICY "Allow all operations on email_templates" 
  ON public.email_templates 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create policies for email_history (admin access only for now)
CREATE POLICY "Allow all operations on email_history" 
  ON public.email_history 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Insert some default email templates
INSERT INTO public.email_templates (name, type, subject, content, is_default) VALUES
('Welcome Email', 'welcome', 'Welcome to ShopEase!', '<h1>Welcome to ShopEase!</h1><p>Thank you for joining us. We''re excited to have you as part of our community.</p>', true),
('Order Confirmation', 'order_status', 'Order Confirmation - {{order_number}}', '<h1>Order Confirmed!</h1><p>Your order {{order_number}} has been confirmed and is being processed.</p><p>Total: {{total}}</p>', true),
('Newsletter', 'newsletter', 'ShopEase Newsletter', '<h1>Latest Updates</h1><p>Check out our latest products and offers!</p>', true);
