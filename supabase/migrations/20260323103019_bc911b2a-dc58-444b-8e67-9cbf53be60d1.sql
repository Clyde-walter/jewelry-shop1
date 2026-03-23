-- Fix critical RLS exposures flagged as level=error

-- Customers table: remove publicly open policies and keep admin-only access via existing is_admin() policies
DROP POLICY IF EXISTS "Admin can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Admin can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Admin can update customers" ON public.customers;
DROP POLICY IF EXISTS "Admin can delete customers" ON public.customers;

-- Products and collections: remove broad authenticated write access
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage collections" ON public.collections;

-- Orders: remove broad authenticated read/update access
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;