
-- Add new fields to the profiles table for extended profile information and notifications
ALTER TABLE public.profiles
  ADD COLUMN profile_image_url TEXT,
  ADD COLUMN date_of_birth DATE,
  ADD COLUMN email_notifications BOOLEAN DEFAULT true,
  ADD COLUMN sms_notifications BOOLEAN DEFAULT false,
  ADD COLUMN newsletter BOOLEAN DEFAULT true;
