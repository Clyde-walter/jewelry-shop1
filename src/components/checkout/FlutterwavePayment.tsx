import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/store';

interface FlutterwavePaymentProps {
  amount: number;
  email: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  cartItems: CartItem[];
  onSuccess: (order: any) => void;
  onValidate: () => boolean;
}

export function FlutterwavePayment({
  amount,
  email,
  customerInfo,
  cartItems,
  onSuccess,
  onValidate
}: FlutterwavePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFlutterwavePayment = async () => {
    if (!onValidate()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment with Flutterwave
      const { data, error } = await supabase.functions.invoke('create-flutterwave-payment', {
        body: {
          amount: Math.round(amount * 100), // Convert to kobo/cents
          email: customerInfo.email,
          customerInfo,
          cartItems
        }
      });

      if (error) throw error;

      if (data?.payment_link) {
        // Open Flutterwave payment page in new tab
        window.open(data.payment_link, '_blank');
        
        toast({
          title: "Redirecting to Flutterwave",
          description: "Complete your payment in the new tab."
        });
      }
    } catch (error: any) {
      console.error('Flutterwave payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleFlutterwavePayment}
      disabled={isProcessing}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay $${amount.toFixed(2)} with Flutterwave`
      )}
    </Button>
  );
}