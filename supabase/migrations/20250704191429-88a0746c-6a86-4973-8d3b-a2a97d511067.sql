
-- Clear all orders from the database
DELETE FROM public.orders;

-- Reset any sequences if needed (though we're using UUIDs, so this isn't necessary)
-- This will give you a clean slate for launch
