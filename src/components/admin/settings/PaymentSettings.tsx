
import React from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { saveToLocalStorage } from '@/utils/adminSettings';

interface PaymentSettingsType {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  stripeApiKey: string;
  paystackPublicKey: string;
  paystackSecretKey: string;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
}

interface PaymentSettingsProps {
  paymentSettings: PaymentSettingsType;
  setPaymentSettings: (settings: PaymentSettingsType) => void;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
}

export function PaymentSettings({ 
  paymentSettings, 
  setPaymentSettings, 
  showApiKey, 
  setShowApiKey 
}: PaymentSettingsProps) {
  const [showPaystackKeys, setShowPaystackKeys] = React.useState(false);
  const [showFlutterwaveKeys, setShowFlutterwaveKeys] = React.useState(false);

  const handleSavePayments = () => {
    saveToLocalStorage('paymentSettings', paymentSettings);
    toast({
      title: "Payment settings saved!",
      description: "Payment configuration has been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                💳
              </div>
              <div>
                <p className="font-medium">Stripe</p>
                <p className="text-sm text-gray-600">Credit cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <Switch 
              checked={paymentSettings.stripeEnabled}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, stripeEnabled: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                🅿️
              </div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-600">PayPal payments</p>
              </div>
            </div>
            <Switch 
              checked={paymentSettings.paypalEnabled}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paypalEnabled: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                🏦
              </div>
              <div>
                <p className="font-medium">Paystack</p>
                <p className="text-sm text-gray-600">African payment gateway - Cards, Bank transfers, Mobile money</p>
              </div>
            </div>
            <Switch 
              checked={paymentSettings.paystackEnabled}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paystackEnabled: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                🦋
              </div>
              <div>
                <p className="font-medium">Flutterwave</p>
                <p className="text-sm text-gray-600">African payment gateway - Cards, Bank transfers, Mobile money</p>
              </div>
            </div>
            <Switch 
              checked={paymentSettings.flutterwaveEnabled}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, flutterwaveEnabled: checked})}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stripeKey">Stripe API Key</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="stripeKey"
                type={showApiKey ? "text" : "password"}
                placeholder="sk_test_..."
                className="flex-1"
                value={paymentSettings.stripeApiKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, stripeApiKey: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="paystackPublicKey">Paystack Public Key</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="paystackPublicKey"
                type={showPaystackKeys ? "text" : "password"}
                placeholder="pk_test_..."
                className="flex-1"
                value={paymentSettings.paystackPublicKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, paystackPublicKey: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowPaystackKeys(!showPaystackKeys)}
              >
                {showPaystackKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="paystackSecretKey">Paystack Secret Key</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="paystackSecretKey"
                type={showPaystackKeys ? "text" : "password"}
                placeholder="sk_test_..."
                className="flex-1"
                value={paymentSettings.paystackSecretKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, paystackSecretKey: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowPaystackKeys(!showPaystackKeys)}
              >
                {showPaystackKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="flutterwavePublicKey">Flutterwave Public Key</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="flutterwavePublicKey"
                type={showFlutterwaveKeys ? "text" : "password"}
                placeholder="FLWPUBK_TEST-..."
                className="flex-1"
                value={paymentSettings.flutterwavePublicKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, flutterwavePublicKey: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowFlutterwaveKeys(!showFlutterwaveKeys)}
              >
                {showFlutterwaveKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="flutterwaveSecretKey">Flutterwave Secret Key</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="flutterwaveSecretKey"
                type={showFlutterwaveKeys ? "text" : "password"}
                placeholder="FLWSECK_TEST-..."
                className="flex-1"
                value={paymentSettings.flutterwaveSecretKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, flutterwaveSecretKey: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowFlutterwaveKeys(!showFlutterwaveKeys)}
              >
                {showFlutterwaveKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <Button onClick={handleSavePayments} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Payment Settings
        </Button>
      </CardContent>
    </Card>
  );
}
