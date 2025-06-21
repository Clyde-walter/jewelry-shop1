
-- Fix function search path security warnings by setting search_path explicitly

-- 1. Fix update_customer_stats function
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update customer stats on new order
    UPDATE public.customers 
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total,
      last_order = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.customer_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update customer stats on order update
    IF OLD.customer_id IS NOT NULL THEN
      UPDATE public.customers 
      SET 
        total_spent = total_spent - OLD.total,
        updated_at = NOW()
      WHERE id = OLD.customer_id;
    END IF;
    
    IF NEW.customer_id IS NOT NULL THEN
      UPDATE public.customers 
      SET 
        total_spent = total_spent + NEW.total,
        last_order = NEW.created_at,
        updated_at = NOW()
      WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update customer stats on order deletion
    UPDATE public.customers 
    SET 
      total_orders = GREATEST(total_orders - 1, 0),
      total_spent = GREATEST(total_spent - OLD.total, 0),
      updated_at = NOW()
    WHERE id = OLD.customer_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 2. Fix update_collection_product_count_from_junction function
CREATE OR REPLACE FUNCTION public.update_collection_product_count_from_junction()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.collections 
    SET product_count = (
      SELECT COUNT(*) FROM public.collection_products 
      WHERE collection_id = NEW.collection_id
    ),
    updated_at = NOW()
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.collections 
    SET product_count = (
      SELECT COUNT(*) FROM public.collection_products 
      WHERE collection_id = OLD.collection_id
    ),
    updated_at = NOW()
    WHERE id = OLD.collection_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

-- 4. Fix update_collection_product_count function
CREATE OR REPLACE FUNCTION public.update_collection_product_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.collection_id IS NOT NULL THEN
    UPDATE public.collections 
    SET product_count = product_count + 1,
        updated_at = NOW()
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' AND OLD.collection_id IS NOT NULL THEN
    UPDATE public.collections 
    SET product_count = GREATEST(product_count - 1, 0),
        updated_at = NOW()
    WHERE id = OLD.collection_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.collection_id IS DISTINCT FROM NEW.collection_id THEN
      IF OLD.collection_id IS NOT NULL THEN
        UPDATE public.collections 
        SET product_count = GREATEST(product_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.collection_id;
      END IF;
      IF NEW.collection_id IS NOT NULL THEN
        UPDATE public.collections 
        SET product_count = product_count + 1,
            updated_at = NOW()
        WHERE id = NEW.collection_id;
      END IF;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 5. Fix generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_sequence')::TEXT, 4, '0');
END;
$$;
