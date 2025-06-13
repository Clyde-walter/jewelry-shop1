
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (reference) {
      verifyPayment(reference);
    } else {
      setIsVerifying(false);
      setPaymentStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
        body: { reference }
      });

      if (error) {
        throw error;
      }

      if (data.status === 'success') {
        setPaymentStatus('success');
        setTransactionData(data);
        toast({
          title: "Payment successful!",
          description: "Your order has been confirmed and is being processed."
        });
      } else {
        setPaymentStatus('failed');
        toast({
          title: "Payment failed",
          description: "Your payment could not be processed.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Verification failed",
        description: "Unable to verify payment status.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          {paymentStatus === 'success' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your payment has been processed successfully.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment. Please try again or contact support.
              </p>
            </>
          )}
        </div>

        {paymentStatus === 'success' && transactionData && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Amount Paid:</span>
                    <p className="font-semibold">₦{transactionData.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Reference:</span>
                    <p className="font-semibold">{transactionData.reference}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/orders')}
            className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
          >
            View My Orders
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/products')}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
