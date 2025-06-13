
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
}

export function PaystackPayment({ amount, email, customerInfo, cartItems, onSuccess }: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-paystack-payment', {
        body: {
          amount,
          email,
          customerInfo,
          cartItems,
        },
      });

      if (error) {
        throw error;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Unable to initialize payment. Please try again.",
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
