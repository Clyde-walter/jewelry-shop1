import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Wallet, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFromLocalStorage } from '@/utils/adminSettings';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from '@/components/ImageUpload';

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
  const [btcAmountCopied, setBtcAmountCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [btcAmount, setBtcAmount] = useState<string>('');
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const { toast } = useToast();

  // Get crypto settings from admin configuration
  const cryptoSettings = getFromLocalStorage('cryptoSettings', {
    walletAddress: '',
    qrCodeImage: ''
  });

  // Fetch Bitcoin price and calculate BTC amount
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const price = data.bitcoin.usd;
        setBtcPrice(price);
        
        // Calculate BTC amount with 8 decimal places (satoshi precision)
        const btcValue = (cartTotal / price).toFixed(8);
        setBtcAmount(btcValue);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        setBtcAmount((cartTotal / 50000).toFixed(8)); // Fallback with estimated price
      }
    };

    if (cartTotal > 0) {
      fetchBitcoinPrice();
    }
  }, [cartTotal]);

  const copyToClipboard = async () => {
    try {
      // Check if clipboard API is available (for modern browsers)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cryptoSettings.walletAddress);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = cryptoSettings.walletAddress;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        title: "Error",
        description: "Failed to copy wallet address. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const copyBtcAmount = async () => {
    try {
      // Check if clipboard API is available (for modern browsers)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(btcAmount);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = btcAmount;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setBtcAmountCopied(true);
      toast({
        title: "Copied!",
        description: "BTC amount copied to clipboard",
      });
      setTimeout(() => setBtcAmountCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      toast({
        title: "Error",
        description: "Failed to copy BTC amount. Please select and copy manually.",
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
        },
        proof_of_payment_images: proofImages
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
        <div className="bg-muted/50 border rounded-lg p-4 md:p-6">
          <h3 className="font-semibold mb-4 text-center">Payment Instructions</h3>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Copy the wallet address below</li>
            <li>Send exactly <span className="font-medium text-foreground">{btcAmount} BTC</span> (${cartTotal.toFixed(2)} USD)</li>
            <li>Upload proof of payment (optional but recommended)</li>
            <li>Click "Confirm Payment" after sending</li>
            <li>We'll verify your payment and process your order</li>
          </ol>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Amount to Send</label>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg border text-center">
                <p className="font-mono text-xl md:text-2xl font-bold break-all leading-relaxed select-text text-primary">
                  {btcAmount} BTC
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  ≈ ${cartTotal.toFixed(2)} USD
                </p>
                {btcPrice > 0 && (
                  <p className="text-xs text-muted-foreground">
                    BTC Price: ${btcPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={copyBtcAmount}
                disabled={btcAmountCopied || !btcAmount}
                className="w-full"
                size="sm"
              >
                {btcAmountCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Amount Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Amount
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Bitcoin Wallet Address</label>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg border">
                <p className="font-mono text-sm break-all leading-relaxed select-text">
                  {cryptoSettings.walletAddress}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={copied}
                className="w-full"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Address Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Address
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Proof of Payment (Optional)
          </label>
          <div className="bg-background border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Upload a screenshot or photo of your transaction as proof of payment. This helps us verify your payment faster.
            </p>
            <ImageUpload
              images={proofImages}
              onImagesChange={setProofImages}
              maxImages={3}
              bucketName="product-images"
            />
          </div>
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