import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentConfirmationForm {
  screenshot: File | null;
  notes: string;
}

interface CPTPaymentFormProps {
  onSubmit: (formData: PaymentConfirmationForm, method: string) => void;
  isProcessing: boolean;
}

export function CPTPaymentForm({ onSubmit, isProcessing }: CPTPaymentFormProps) {
  const [activeTab, setActiveTab] = useState('bank-transfer');
  const [formData, setFormData] = useState<PaymentConfirmationForm>({
    screenshot: null,
    notes: ''
  });
  const { toast } = useToast();

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

  const handleSubmit = () => {
    if (!formData.screenshot) {
      toast({
        title: "Screenshot required",
        description: "Please upload a payment confirmation screenshot",
        variant: "destructive"
      });
      return;
    }
    onSubmit(formData, activeTab);
  };

  const paymentMethods = [
    {
      id: 'bank-transfer',
      title: 'Bank Transfer',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      description: 'Transfer funds directly to our bank account'
    },
    {
      id: 'mobile-money',
      title: 'Mobile Money',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
      description: 'Pay using your mobile money wallet'
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
      description: 'Pay with Bitcoin, Ethereum, or other cryptocurrencies'
    },
    {
      id: 'cash-deposit',
      title: 'Cash Deposit',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop',
      description: 'Make a cash deposit at our partner locations'
    }
  ];

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
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
                {/* Tab Hero Image */}
                <div className="relative h-32 mb-6 rounded-lg overflow-hidden">
                  <img
                    src={method.image}
                    alt={method.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">{method.title}</h3>
                  </div>
                </div>

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