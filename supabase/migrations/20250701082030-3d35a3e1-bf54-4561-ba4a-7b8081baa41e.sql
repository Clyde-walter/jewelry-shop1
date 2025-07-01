
-- Fix RLS policies for orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Create proper RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for support_requests (customer care)
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Admins can view all support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Users can create support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Admins can update support requests" ON public.support_requests;

CREATE POLICY "Users can view their own support requests" 
ON public.support_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all support requests" 
ON public.support_requests 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Users can create support requests" 
ON public.support_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update support requests" 
ON public.support_requests 
FOR UPDATE 
USING (public.is_admin());

-- Add RLS policies for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all customers" ON public.customers;
CREATE POLICY "Admins can manage all customers" 
ON public.customers 
FOR ALL 
USING (public.is_admin());

-- Create a trigger to automatically create customer records from orders
CREATE OR REPLACE FUNCTION public.create_customer_from_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update customer based on order customer_info
  INSERT INTO public.customers (
    name, 
    email, 
    phone, 
    total_orders, 
    total_spent, 
    last_order
  )
  VALUES (
    (NEW.customer_info->>'name'),
    (NEW.customer_info->>'email'),
    (NEW.customer_info->>'phone'),
    1,
    NEW.total,
    NEW.created_at
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    total_orders = customers.total_orders + 1,
    total_spent = customers.total_spent + NEW.total,
    last_order = NEW.created_at,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for customer creation
DROP TRIGGER IF EXISTS create_customer_trigger ON public.orders;
CREATE TRIGGER create_customer_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.create_customer_from_order();

-- Add unique constraint on email for customers (only if it doesn't exist)
DO $$ 
BEGIN
    ALTER TABLE public.customers ADD CONSTRAINT customers_email_unique UNIQUE (email);
EXCEPTION
    WHEN duplicate_object THEN
        -- Constraint already exists, do nothing
        NULL;
END $$;
