import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Upload, Check, Bitcoin, Banknote, Zap, DollarSign } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
  qr_code_url?: string;
  is_active: boolean;
}

interface CryptoPaymentProps {
  amount: number;
  customerInfo: any;
  cartItems: any[];
  onPaymentComplete: (order: any) => void;
}

const currencyIcons = {
  BTC: Bitcoin,
  LTC: Banknote,
  ETH: Zap,
  USDT: DollarSign,
};

const currencyNames = {
  BTC: 'Bitcoin',
  LTC: 'Litecoin', 
  ETH: 'Ethereum',
  USDT: 'Tether USD',
};

export function CryptoPayment({ 
  amount, 
  customerInfo, 
  cartItems, 
  onPaymentComplete
}: CryptoPaymentProps) {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BTC');
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string>('');
  const [localCustomerInfo, setLocalCustomerInfo] = useState({
    name: customerInfo.name || '',
    email: customerInfo.email || '',
    phone: customerInfo.phone || '',
    address: customerInfo.address || ''
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('is_active', true)
        .order('currency');

      if (error) throw error;
      setWallets(data || []);
      if (data && data.length > 0) {
        setSelectedCurrency(data[0].currency);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast({
        title: "Error",
        description: "Failed to load crypto wallets",
        variant: "destructive"
      });
    }
  };

  const handleCopyAddress = async (address: string, currency: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(currency);
      toast({
        title: "Address copied!",
        description: `${currency} wallet address copied to clipboard`
      });
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard",
        variant: "destructive"
      });
    }
  };

  const generateOrderId = () => {
    return 'CRYPTO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmitPayment = async () => {
    // Validate customer info
    if (!localCustomerInfo.name || !localCustomerInfo.email) {
      toast({
        title: "Customer information required",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    if (proofImages.length === 0) {
      toast({
        title: "Proof of payment required",
        description: "Please upload at least one proof of payment image",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const selectedWallet = wallets.find(w => w.currency === selectedCurrency);

      if (!selectedWallet) {
        throw new Error('Selected wallet not found');
      }

      // Create crypto payment record
      const { data: cryptoPayment, error: paymentError } = await supabase
        .from('crypto_payments')
         .insert({
           order_id: orderId,
           wallet_address: selectedWallet.wallet_address,
           amount,
           customer_info: localCustomerInfo,
           customer_name: localCustomerInfo.name,
           customer_email: localCustomerInfo.email,
           cart_items: cartItems,
           shipping_address: { address: localCustomerInfo.address },
           proof_images: proofImages,
           status: 'pending'
         })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
         .insert({
           order_number: orderId,
           customer_info: localCustomerInfo,
           items: cartItems,
           total: amount,
           status: 'pending_verification',
           user_id: null // Allow anonymous orders
         })
        .select()
        .single();

      if (orderError) throw orderError;

      // Call onPaymentComplete with the order
      onPaymentComplete({
        ...order,
        paymentMethod: 'crypto',
        currency: selectedCurrency,
        status: 'pending_verification'
      });

      toast({
        title: "Payment submitted!",
        description: "Your crypto payment has been submitted for verification"
      });

    } catch (error: any) {
      console.error('Error submitting crypto payment:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit crypto payment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedWallet = wallets.find(w => w.currency === selectedCurrency);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5" />
          Crypto Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold">${amount.toFixed(2)} USD</p>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={localCustomerInfo.name}
                onChange={(e) => setLocalCustomerInfo(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={localCustomerInfo.email}
                onChange={(e) => setLocalCustomerInfo(prev => ({...prev, email: e.target.value}))}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={localCustomerInfo.phone}
                onChange={(e) => setLocalCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Input
                id="address"
                value={localCustomerInfo.address}
                onChange={(e) => setLocalCustomerInfo(prev => ({...prev, address: e.target.value}))}
                placeholder="Enter your address"
              />
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Cryptocurrency</h3>
          <Tabs value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <TabsList className="grid w-full grid-cols-4">
              {wallets.map((wallet) => {
                const Icon = currencyIcons[wallet.currency as keyof typeof currencyIcons];
                return (
                  <TabsTrigger key={wallet.currency} value={wallet.currency} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    {wallet.currency}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {wallets.map((wallet) => (
              <TabsContent key={wallet.currency} value={wallet.currency} className="mt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Currency Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {React.createElement(currencyIcons[wallet.currency as keyof typeof currencyIcons], { className: "h-6 w-6" })}
                        <div>
                          <p className="font-semibold">{currencyNames[wallet.currency as keyof typeof currencyNames]}</p>
                          <Badge variant="secondary">{wallet.currency}</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Wallet Address */}
                    <div className="space-y-2">
                      <p className="font-semibold">Wallet Address:</p>
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <code className="flex-1 text-sm break-all">{wallet.wallet_address}</code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyAddress(wallet.wallet_address, wallet.currency)}
                          className="shrink-0"
                        >
                          {copiedAddress === wallet.currency ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* QR Code */}
                    {wallet.qr_code_url && (
                      <div className="space-y-2">
                        <p className="font-semibold">QR Code:</p>
                        <div className="flex justify-center">
                          <img 
                            src={wallet.qr_code_url} 
                            alt={`${wallet.currency} QR Code`}
                            className="w-48 h-48 border rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Send exactly <strong>${amount.toFixed(2)} USD worth</strong> of {selectedCurrency} to the address above</li>
            <li>Take a screenshot or photo of your transaction confirmation</li>
            <li>Upload the proof of payment below</li>
            <li>Click "Confirm Payment" to submit for verification</li>
          </ol>
        </div>

        {/* Proof of Payment Upload */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Upload Proof of Payment</h3>
          <ImageUpload
            images={proofImages}
            onImagesChange={setProofImages}
            maxImages={5}
            bucketName="product-images"
          />
          <p className="text-sm text-muted-foreground">
            Upload screenshots or photos of your transaction confirmation (max 5 images)
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmitPayment} 
          disabled={isSubmitting || proofImages.length === 0}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Submitting Payment...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirm Payment
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your payment will be verified by our team within 24 hours. You will receive an email confirmation once verified.
        </p>
      </CardContent>
    </Card>
  );
}