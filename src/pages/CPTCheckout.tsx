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

const CPTCheckout = () => {
  const [activeTab, setActiveTab] = useState('bank-transfer');
  const [formData, setFormData] = useState<PaymentConfirmationForm>({
    screenshot: null,
    notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, tabId: string) => {
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

  const handleSubmit = async (tabId: string) => {
    if (!formData.screenshot) {
      toast({
        title: "Screenshot required",
        description: "Please upload a payment confirmation screenshot",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Payment confirmation submitted",
        description: "We'll verify your payment and process your order shortly",
      });
      // Reset form
      setFormData({ screenshot: null, notes: '' });
    }, 2000);
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-primary/90 to-primary-foreground/90 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop"
          alt="Secure Payment"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Complete Your Payment</h1>
            <p className="text-xl opacity-90">Choose your preferred payment method and upload confirmation</p>
          </div>
        </div>
      </div>

      {/* Payment Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {paymentMethods.map((method) => (
              <TabsTrigger key={method.id} value={method.id} className="text-sm">
                {method.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {paymentMethods.map((method) => (
            <TabsContent key={method.id} value={method.id}>
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-8">
                  {/* Tab Hero Image */}
                  <div className="relative h-48 mb-8 rounded-lg overflow-hidden">
                    <img
                      src={method.image}
                      alt={method.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h2 className="text-3xl font-bold text-white">{method.title}</h2>
                    </div>
                  </div>

                  {/* Bold Description */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{method.title} Payment</h3>
                    <p className="text-lg text-muted-foreground">{method.description}</p>
                  </div>

                  {/* Payment Confirmation Form */}
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <Label htmlFor={`screenshot-${method.id}`} className="text-base font-semibold">
                        Upload Payment Screenshot
                      </Label>
                      <div className="mt-2">
                        <div className="relative">
                          <Input
                            id={`screenshot-${method.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, method.id)}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                          />
                        </div>
                        {formData.screenshot && (
                          <div className="mt-2 flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm">{formData.screenshot.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`notes-${method.id}`} className="text-base font-semibold">
                        Additional Notes (Optional)
                      </Label>
                      <textarea
                        id={`notes-${method.id}`}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional information about your payment..."
                        className="mt-2 w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <Button 
                      onClick={() => handleSubmit(method.id)}
                      disabled={uploading || !formData.screenshot}
                      className="w-full"
                    >
                      {uploading ? (
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
    </div>
  );
};

export default CPTCheckout;