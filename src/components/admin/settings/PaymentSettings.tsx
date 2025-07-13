
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
  flutterwaveEnabled: boolean;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
  cryptomusEnabled: boolean;
  cryptomusApiKey: string;
  cryptomusMerchantId: string;
}

interface PaymentSettingsProps {
  paymentSettings: PaymentSettingsType;
  setPaymentSettings: (settings: PaymentSettingsType) => void;
}

export function PaymentSettings({ 
  paymentSettings, 
  setPaymentSettings
}: PaymentSettingsProps) {
  const [showFlutterwaveKeys, setShowFlutterwaveKeys] = React.useState(false);
  const [showCryptomusKeys, setShowCryptomusKeys] = React.useState(false);

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
        {/* Flutterwave Section */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 text-orange-700">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span className="text-sm font-medium">Flutterwave Payment Gateway</span>
          </div>
          <p className="text-sm text-orange-600 mt-1">
            Secure payment processing for cards, bank transfers, and mobile money across Africa and globally.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border-2 border-orange-200 bg-orange-50/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              🦋
            </div>
            <div>
              <p className="font-medium text-orange-800">Flutterwave</p>
              <p className="text-sm text-orange-600">Cards, Bank transfers, Mobile money</p>
            </div>
          </div>
          <Switch 
            checked={paymentSettings.flutterwaveEnabled}
            onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, flutterwaveEnabled: checked})}
          />
        </div>
        
        <div className="space-y-4">
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

        <Separator />

        {/* Cryptomus Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium">Cryptomus Cryptocurrency Gateway</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            Accept Bitcoin, Ethereum, USDT and other cryptocurrencies with automatic conversion to fiat.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border-2 border-blue-200 bg-blue-50/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              ₿
            </div>
            <div>
              <p className="font-medium text-blue-800">Cryptomus</p>
              <p className="text-sm text-blue-600">Bitcoin, Ethereum, USDT & more</p>
            </div>
          </div>
          <Switch 
            checked={paymentSettings.cryptomusEnabled}
            onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, cryptomusEnabled: checked})}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cryptomusApiKey">Cryptomus API Key</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="cryptomusApiKey"
                type={showCryptomusKeys ? "text" : "password"}
                placeholder="Your Cryptomus API Key"
                className="flex-1"
                value={paymentSettings.cryptomusApiKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, cryptomusApiKey: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowCryptomusKeys(!showCryptomusKeys)}
              >
                {showCryptomusKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="cryptomusMerchantId">Cryptomus Merchant ID</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="cryptomusMerchantId"
                type={showCryptomusKeys ? "text" : "password"}
                placeholder="Your Cryptomus Merchant ID"
                className="flex-1"
                value={paymentSettings.cryptomusMerchantId}
                onChange={(e) => setPaymentSettings({...paymentSettings, cryptomusMerchantId: e.target.value})}
              />
              <Button
                variant="outline"
                onClick={() => setShowCryptomusKeys(!showCryptomusKeys)}
              >
                {showCryptomusKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
