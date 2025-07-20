-- Add proof_of_payment_images column to crypto_payments table
ALTER TABLE public.crypto_payments 
ADD COLUMN proof_of_payment_images TEXT[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN public.crypto_payments.proof_of_payment_images IS 'Array of image URLs uploaded by customer as proof of payment';