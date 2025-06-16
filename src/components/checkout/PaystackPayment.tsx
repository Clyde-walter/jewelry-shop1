
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  customerInfo: any;
  cartItems: any[];
  onSuccess: (order: any) => void;
  onValidate?: () => boolean;
}

export function PaystackPayment({ 
  amount, 
  email, 
  customerInfo, 
  cartItems, 
  onSuccess, 
  onValidate 
}: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    // Run validation if provided
    if (onValidate && !onValidate()) {
      return;
    }

    // Additional validation for required fields
    if (!email || !email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address before proceeding with payment.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before proceeding with payment.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Initiating Paystack payment with:', {
        amount,
        email,
        customerInfo: {
          name: customerInfo.name,
          address: customerInfo.address,
          city: customerInfo.city
        },
        cartItemsCount: cartItems.length
      });

      const { data, error } = await supabase.functions.invoke('create-paystack-payment', {
        body: {
          amount,
          email: email.trim(),
          customerInfo,
          cartItems,
        },
      });

      if (error) {
        console.error('Paystack payment error:', error);
        throw error;
      }

      console.log('Paystack response:', data);

      // Redirect to Paystack checkout
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL received from Paystack');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Unable to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full bg-green-600 hover:bg-green-700"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ₦${amount.toLocaleString()} with Paystack`
      )}
    </Button>
  );
}
