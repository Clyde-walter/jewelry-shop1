import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentConfirmationForm {
  screenshot: File | null;
  notes: string;
}

interface CPTPaymentFormProps {
  onSubmit: (formData: PaymentConfirmationForm, method: string) => void;
  isProcessing: boolean;
  totalAmount: number;
}

interface PaymentSettings {
  bank_name: string;
  account_name: string;
  account_number: string;
  sort_code: string;
  btc_address: string;
  usdt_address: string;
}

export function CPTPaymentForm({ onSubmit, isProcessing, totalAmount }: CPTPaymentFormProps) {
  const [activeTab, setActiveTab] = useState('bank-transfer');
  const [cryptoType, setCryptoType] = useState('btc'); // Track specific crypto type
  const [formData, setFormData] = useState<PaymentConfirmationForm>({
    screenshot: null,
    notes: ''
  });
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [cryptoRates, setCryptoRates] = useState<{ btc: number; usdt: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentSettings();
    fetchCryptoRates();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const fetchCryptoRates = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd');
      const data = await response.json();
      setCryptoRates({
        btc: data.bitcoin?.usd || 0,
        usdt: data.tether?.usd || 1
      });
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
      // Fallback rates
      setCryptoRates({ btc: 50000, usdt: 1 });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, screenshot: file }));
      toast({
        title: "Screenshot uploaded",
        description: "Payment screenshot ready for submission",
      });
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.screenshot) {
      toast({
        title: "Screenshot required",
        description: "Please upload a payment confirmation screenshot",
        variant: "destructive"
      });
      return;
    }
    
    // Pass the specific payment method: 'bank-transfer', 'btc', or 'usdt'
    const method = activeTab === 'bank-transfer' ? 'bank-transfer' : cryptoType;
    onSubmit(formData, method);
  };

  const paymentMethods = [
    {
      id: 'bank-transfer',
      title: 'Bank Transfer',
      description: 'Transfer funds directly to our bank account'
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      description: 'Pay with Bitcoin or USDT'
    }
  ];

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          {paymentMethods.map((method) => (
            <TabsTrigger key={method.id} value={method.id} className="text-xs">
              {method.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {paymentMethods.map((method) => (
          <TabsContent key={method.id} value={method.id}>
            <Card>
              <CardContent className="p-6">
                {/* Payment Details Section */}
                {method.id === 'bank-transfer' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">Bank Account Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-700">Bank Name:</span>
                        <span className="text-blue-900">{settings?.bank_name || 'Loading...'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-700">Account Name:</span>
                        <span className="text-blue-900">{settings?.account_name || 'Loading...'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-700">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-900 font-mono">{settings?.account_number || 'Loading...'}</span>
                          {settings?.account_number && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(settings.account_number, 'Account number')}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-700">Sort Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-900 font-mono">{settings?.sort_code || 'Loading...'}</span>
                          {settings?.sort_code && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(settings.sort_code, 'Sort code')}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-orange-800 mb-4">Cryptocurrency Payment</h3>
                    
                    {/* Payment Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h4>
                      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Choose your preferred cryptocurrency (BTC or USDT) by clicking on it below</li>
                        <li>Send the exact amount shown to the corresponding address</li>
                        <li>Take a screenshot of your transaction confirmation</li>
                        <li>Upload the screenshot and submit this form</li>
                      </ol>
                    </div>

                    {/* Amount Conversion */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-800 mb-3">Amount to Send:</h4>
                      <div className="text-lg font-bold text-center mb-2">
                        USD ${totalAmount.toFixed(2)}
                      </div>
                     {cryptoRates ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div 
                            className={`bg-white p-4 rounded-lg border text-center cursor-pointer transition-all ${
                              cryptoType === 'btc' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setCryptoType('btc')}
                          >
                            <div className="text-orange-600 font-semibold text-sm mb-2">
                              Bitcoin {cryptoType === 'btc' && '✓'}
                            </div>
                            <div className="font-mono text-base sm:text-lg font-bold break-all">
                              {(totalAmount / cryptoRates.btc).toFixed(8)} BTC
                            </div>
                          </div>
                          <div 
                            className={`bg-white p-4 rounded-lg border text-center cursor-pointer transition-all ${
                              cryptoType === 'usdt' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setCryptoType('usdt')}
                          >
                            <div className="text-green-600 font-semibold text-sm mb-2">
                              USDT {cryptoType === 'usdt' && '✓'}
                            </div>
                            <div className="font-mono text-base sm:text-lg font-bold break-all">
                              {(totalAmount / cryptoRates.usdt).toFixed(2)} USDT
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">Loading conversion rates...</div>
                      )}
                    </div>

                    {/* Selected Cryptocurrency Address */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        Send Payment To This Address:
                      </h4>
                      <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-orange-700">
                            {cryptoType === 'btc' ? 'Bitcoin (BTC) Address:' : 'USDT Address:'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            cryptoType === 'btc' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {cryptoType.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-sm text-orange-900 break-all flex-1 mr-2">
                            {cryptoType === 'btc' 
                              ? (settings?.btc_address || 'Loading...') 
                              : (settings?.usdt_address || 'Loading...')
                            }
                          </div>
                          {((cryptoType === 'btc' && settings?.btc_address) || 
                            (cryptoType === 'usdt' && settings?.usdt_address)) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(
                                cryptoType === 'btc' ? settings!.btc_address : settings!.usdt_address, 
                                `${cryptoType.toUpperCase()} address`
                              )}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2 font-medium">
                        ⚠️ Only send {cryptoType.toUpperCase()} to this address. Sending other cryptocurrencies will result in permanent loss.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bold Description */}
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-foreground mb-1">{method.title} Payment</h4>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>

                {/* Payment Confirmation Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`screenshot-${method.id}`} className="text-sm font-semibold">
                      Upload Payment Screenshot
                    </Label>
                    <div className="mt-2">
                      <Input
                        id={`screenshot-${method.id}`}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {formData.screenshot && (
                        <div className="mt-2 flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">{formData.screenshot.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`notes-${method.id}`} className="text-sm font-semibold">
                      Additional Notes (Optional)
                    </Label>
                    <textarea
                      id={`notes-${method.id}`}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional information about your payment..."
                      className="mt-2 w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={isProcessing || !formData.screenshot}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Payment Confirmation
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}