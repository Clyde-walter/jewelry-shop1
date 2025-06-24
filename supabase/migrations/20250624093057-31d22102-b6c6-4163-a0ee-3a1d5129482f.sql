
-- First, let's check if your user exists and what roles they have
SELECT 
  u.id as user_id,
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'clydewalter21@gmail.com';

-- If the role exists but there's still an access issue, let's ensure the role is properly set
-- This will either insert the admin role or do nothing if it already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'clydewalter21@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Let's also verify the RLS policies are working correctly by checking the helper functions
SELECT public.has_role(
  (SELECT id FROM auth.users WHERE email = 'clydewalter21@gmail.com'),
  'admin'::app_role
) as has_admin_role;

-- Let's also check if the is_admin() function works for your user
-- (This would need to be run while you're authenticated)
-- SELECT public.is_admin() as is_current_user_admin;
