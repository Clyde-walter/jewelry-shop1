
import React from 'react';
import { Save, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { saveToLocalStorage } from '@/utils/adminSettings';

interface SecurePaymentSettingsType {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  paystackEnabled: boolean;
  stripeConfigured: boolean;
  paystackConfigured: boolean;
}

interface SecurePaymentSettingsProps {
  paymentSettings: SecurePaymentSettingsType;
  setPaymentSettings: (settings: SecurePaymentSettingsType) => void;
}

export function SecurePaymentSettings({ 
  paymentSettings, 
  setPaymentSettings 
}: SecurePaymentSettingsProps) {
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
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Secure Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Security Notice</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            Payment credentials are securely stored in server-side environment variables and never exposed to the client.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                💳
              </div>
              <div>
                <p className="font-medium">Stripe</p>
                <p className="text-sm text-gray-600">Credit cards, Apple Pay, Google Pay</p>
                <div className="flex items-center gap-1 mt-1">
                  {paymentSettings.stripeConfigured ? (
                    <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">Configured</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-yellow-500" /><span className="text-xs text-yellow-600">Not configured</span></>
                  )}
                </div>
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
                <div className="flex items-center gap-1 mt-1">
                  {paymentSettings.paystackConfigured ? (
                    <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">Configured</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-yellow-500" /><span className="text-xs text-yellow-600">Not configured</span></>
                  )}
                </div>
              </div>
            </div>
            <Switch 
              checked={paymentSettings.paystackEnabled}
              onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paystackEnabled: checked})}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Payment credentials must be configured in the server environment. 
            Contact your system administrator to set up payment gateway credentials securely.
          </p>
        </div>
        
        <Button onClick={handleSavePayments} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Payment Settings
        </Button>
      </CardContent>
    </Card>
  );
}
