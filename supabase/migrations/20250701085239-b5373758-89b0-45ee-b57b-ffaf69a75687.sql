
-- Phase 1: Critical Database Security - Clean up existing policies and create new ones

-- Enable RLS on all tables that don't have it enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view their own support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Admins can view all support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Users can create support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Anyone can create support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Admins can update support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Admins can delete support requests" ON public.support_requests;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Public can view products" ON public.products;

DROP POLICY IF EXISTS "Anyone can view collections" ON public.collections;
DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
DROP POLICY IF EXISTS "Public can view active collections" ON public.collections;

DROP POLICY IF EXISTS "Anyone can view collection products" ON public.collection_products;
DROP POLICY IF EXISTS "Authenticated users can manage collection products" ON public.collection_products;
DROP POLICY IF EXISTS "Admins can manage collection products" ON public.collection_products;

DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Allow all operations on email_templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;

DROP POLICY IF EXISTS "Allow all operations on email_history" ON public.email_history;
DROP POLICY IF EXISTS "Admins can view email history" ON public.email_history;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Contact requests policies - drop all variations
DROP POLICY IF EXISTS "Anyone can create contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Users can view their own contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can manage contact requests" ON public.contact_requests;

-- Return requests policies - drop all variations  
DROP POLICY IF EXISTS "Users can create their own return requests" ON public.return_requests;
DROP POLICY IF EXISTS "Users can view their own return requests" ON public.return_requests;
DROP POLICY IF EXISTS "Admins can manage return requests" ON public.return_requests;

-- Warranty claims policies - drop all variations
DROP POLICY IF EXISTS "Users can create their own warranty claims" ON public.warranty_claims;
DROP POLICY IF EXISTS "Users can view their own warranty claims" ON public.warranty_claims;
DROP POLICY IF EXISTS "Admins can manage warranty claims" ON public.warranty_claims;

-- Now create all policies fresh
-- 1. Orders table policies
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin());

-- 2. Support requests policies  
CREATE POLICY "Users can view their own support requests" 
ON public.support_requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all support requests" 
ON public.support_requests 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Anyone can create support requests" 
ON public.support_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update support requests" 
ON public.support_requests 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete support requests" 
ON public.support_requests 
FOR DELETE 
USING (public.is_admin());

-- 3. Products policies (public read access)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.is_admin());

-- 4. Collections policies (public read access)
CREATE POLICY "Anyone can view collections" 
ON public.collections 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage collections" 
ON public.collections 
FOR ALL 
USING (public.is_admin());

-- 5. Collection products policies
CREATE POLICY "Anyone can view collection products" 
ON public.collection_products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage collection products" 
ON public.collection_products 
FOR ALL 
USING (public.is_admin());

-- 6. Customers policies (admin only)
CREATE POLICY "Admins can manage customers" 
ON public.customers 
FOR ALL 
USING (public.is_admin());

-- 7. Email templates policies (admin only)
CREATE POLICY "Admins can manage email templates" 
ON public.email_templates 
FOR ALL 
USING (public.is_admin());

-- 8. Email history policies (admin only)
CREATE POLICY "Admins can view email history" 
ON public.email_history 
FOR ALL 
USING (public.is_admin());

-- 9. User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin());

-- 10. Contact requests policies
CREATE POLICY "Anyone can create contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage contact requests" 
ON public.contact_requests 
FOR ALL 
USING (public.is_admin());

-- 11. Return requests policies
CREATE POLICY "Users can create their own return requests" 
ON public.return_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own return requests" 
ON public.return_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage return requests" 
ON public.return_requests 
FOR ALL 
USING (public.is_admin());

-- 12. Warranty claims policies
CREATE POLICY "Users can create their own warranty claims" 
ON public.warranty_claims 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own warranty claims" 
ON public.warranty_claims 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage warranty claims" 
ON public.warranty_claims 
FOR ALL 
USING (public.is_admin());
