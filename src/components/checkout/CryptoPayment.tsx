import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFromLocalStorage } from '@/utils/adminSettings';
import { supabase } from '@/integrations/supabase/client';

interface CryptoPaymentProps {
  onPaymentComplete: (result: any) => void;
  onValidatePayment: () => boolean;
  customerInfo: any;
  cartTotal: number;
  isProcessing?: boolean;
}

export function CryptoPayment({ 
  onPaymentComplete, 
  onValidatePayment, 
  customerInfo, 
  cartTotal,
  isProcessing = false 
}: CryptoPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const { toast } = useToast();

  // Get crypto settings from admin configuration
  const cryptoSettings = getFromLocalStorage('cryptoSettings', {
    walletAddress: '',
    qrCodeImage: ''
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cryptoSettings.walletAddress);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy wallet address",
        variant: "destructive",
      });
    }
  };

  const handleConfirmPayment = async () => {
    if (!onValidatePayment()) {
      return;
    }

    try {
      // Create crypto payment record in database
      const cryptoPaymentData = {
        order_id: `ORD-${Date.now()}`,
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        amount: cartTotal,
        wallet_address: cryptoSettings.walletAddress,
        customer_info: customerInfo,
        cart_items: [], // Will be populated from cart context
        shipping_address: {
          address: customerInfo.address,
          city: customerInfo.city,
          zipCode: customerInfo.zipCode,
          country: customerInfo.country
        }
      };

      // Save to database
      const { data, error } = await supabase
        .from('crypto_payments')
        .insert([cryptoPaymentData]);

      if (error) {
        throw new Error('Failed to save crypto payment: ' + error.message);
      }

      // Send pending email notification
      await fetch('https://kirxlakwwzpkrmipdelj.supabase.co/functions/v1/send-crypto-payment-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pending',
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          orderId: cryptoPaymentData.order_id,
          amount: cartTotal,
          walletAddress: cryptoSettings.walletAddress
        })
      });

      setPaymentConfirmed(true);
      
      toast({
        title: "Payment Confirmation Received",
        description: "Your payment is being verified. You'll receive an email confirmation once approved.",
      });

      // Create a special order object for the confirmation page
      const order = {
        id: cryptoPaymentData.order_id,
        orderNumber: cryptoPaymentData.order_id,
        customerInfo,
        total: cartTotal,
        paymentMethod: 'crypto',
        status: 'pending_verification',
        walletAddress: cryptoSettings.walletAddress,
        createdAt: new Date().toISOString()
      };

      onPaymentComplete(order);
    } catch (error) {
      console.error('Error processing crypto payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment confirmation. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!cryptoSettings.walletAddress) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Wallet className="mx-auto mb-2 h-8 w-8" />
            <p>Crypto payment is not configured yet.</p>
            <p className="text-sm">Please contact admin to set up crypto payments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Cryptocurrency Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-background border rounded-lg p-4">
          <h3 className="font-medium mb-3">Payment Instructions</h3>
          <ol className="text-sm text-muted-foreground space-y-2">
            <li>1. Copy the wallet address below or scan the QR code</li>
            <li>2. Send exactly <span className="font-medium text-foreground">${cartTotal.toFixed(2)}</span> worth of cryptocurrency</li>
            <li>3. Click "Confirm Payment" after sending</li>
            <li>4. We'll verify your payment and process your order</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Wallet Address</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-xs sm:text-sm break-all min-h-[2.5rem] flex items-center">
                {cryptoSettings.walletAddress}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={copied}
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {cryptoSettings.qrCodeImage && (
            <div className="text-center">
              <label className="block text-sm font-medium mb-2">QR Code</label>
              <div className="inline-block p-4 bg-white rounded-lg">
                <img 
                  src={cryptoSettings.qrCodeImage} 
                  alt="Wallet QR Code" 
                  className="w-32 h-32 sm:w-48 sm:h-48 mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Your order will be marked as "Pending Verification" until we confirm your payment. 
            Processing may take 15-30 minutes depending on network confirmation times.
          </p>
        </div>

        <Button 
          onClick={handleConfirmPayment}
          disabled={isProcessing || paymentConfirmed}
          className="w-full"
          size="lg"
        >
          {paymentConfirmed ? 'Payment Confirmed' : 'Confirm Payment Sent'}
        </Button>
      </CardContent>
    </Card>
  );
}