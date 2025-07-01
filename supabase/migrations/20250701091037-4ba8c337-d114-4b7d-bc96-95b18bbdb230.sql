
-- Create table for tracking password failed verification attempts
CREATE TABLE public.password_failed_verification_attempts (
  user_id uuid PRIMARY KEY,
  last_failed_at timestamp with time zone NOT NULL DEFAULT now(),
  attempt_count integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.password_failed_verification_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see their own failed attempts
CREATE POLICY "Users can view their own failed attempts" 
ON public.password_failed_verification_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow system to insert/update failed attempts
CREATE POLICY "System can manage failed attempts" 
ON public.password_failed_verification_attempts 
FOR ALL 
USING (true);
