
-- Remove all admin role assignments from the user_roles table
DELETE FROM public.user_roles 
WHERE role = 'admin';

-- Verify that all admin roles have been removed
SELECT 
  u.id as user_id,
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
