
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/store';

interface CryptomusPaymentProps {
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

export function CryptomusPayment({
  amount,
  email,
  customerInfo,
  cartItems,
  onSuccess,
  onValidate
}: CryptomusPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCryptomusPayment = async () => {
    if (!onValidate()) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Initiating Cryptomus payment:', {
        amount,
        email: customerInfo.email,
        cartItemsCount: cartItems.length
      });

      const { data, error } = await supabase.functions.invoke('create-cryptomus-payment', {
        body: {
          amount,
          customerInfo,
          cartItems
        }
      });

      if (error) {
        console.error('Cryptomus payment error:', error);
        throw error;
      }

      console.log('Cryptomus response:', data);

      if (data?.payment_url) {
        // Open Cryptomus payment page in new tab
        window.open(data.payment_url, '_blank');
        
        toast({
          title: "Redirecting to Cryptomus",
          description: `Pay ${data.amount} USD with cryptocurrency. Complete your payment in the new tab.`
        });
      } else {
        throw new Error('No payment URL received from Cryptomus');
      }

    } catch (error: any) {
      console.error('Cryptomus payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate cryptocurrency payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleCryptomusPayment}
      disabled={isProcessing}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <span className="mr-2">₿</span>
          Pay $${amount.toFixed(2)} with Crypto
        </>
      )}
    </Button>
  );
}
