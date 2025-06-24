
-- Grant admin role to the specified user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'clydewalter21@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the admin role was added
SELECT 
  u.id as user_id,
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'clydewalter21@gmail.com';
