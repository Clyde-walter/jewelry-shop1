
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function Returns() {
  const { user } = useAuth();
  const [returnForm, setReturnForm] = useState({
    orderNumber: '',
    reason: '',
    description: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('return_requests')
        .insert({
          user_id: user?.id || null,
          order_number: returnForm.orderNumber,
          customer_email: returnForm.email,
          reason: returnForm.reason,
          description: returnForm.description,
          status: 'pending',
          priority: 'medium'
        });

      if (error) throw error;

      toast({
        title: "Return request submitted!",
        description: "We'll send you a return label within 24 hours.",
      });

      setReturnForm({ orderNumber: '', reason: '', description: '', email: '' });
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast({
        title: "Error submitting return",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We want you to love your jewelry. If you're not completely satisfied, we're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Return Policy */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="w-5 h-5 mr-2 text-ecommerce-600" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">30-Day Return Window</p>
                  <p className="text-gray-600 text-sm">Returns must be initiated within 30 days of delivery.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Original Condition Required</p>
                  <p className="text-gray-600 text-sm">Items must be unworn with original packaging and tags.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Free Return Shipping</p>
                  <p className="text-gray-600 text-sm">We provide prepaid return labels for your convenience.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Custom Items</p>
                  <p className="text-gray-600 text-sm">Custom designed pieces are final sale unless defective.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-ecommerce-600" />
                Return Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-ecommerce-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p>Submit return request form</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-ecommerce-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p>Receive prepaid return label via email</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-ecommerce-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p>Package item securely and ship</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-ecommerce-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p>Receive refund within 3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Return Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReturn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  value={returnForm.orderNumber}
                  onChange={(e) => setReturnForm({ ...returnForm, orderNumber: e.target.value })}
                  placeholder="e.g., ORD-123456"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={returnForm.email}
                  onChange={(e) => setReturnForm({ ...returnForm, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Return</Label>
                <Select value={returnForm.reason} onValueChange={(value) => setReturnForm({ ...returnForm, reason: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Wrong Size</SelectItem>
                    <SelectItem value="style">Not as Expected</SelectItem>
                    <SelectItem value="quality">Quality Issue</SelectItem>
                    <SelectItem value="damaged">Damaged in Shipping</SelectItem>
                    <SelectItem value="defective">Defective Item</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={returnForm.description}
                  onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                  placeholder="Please provide additional details about your return..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Information */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Need an Exchange?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              For exchanges, please process a return for your current item and place a new order for the desired item. 
              This ensures the fastest processing time and availability of your preferred choice.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-ecommerce-600 hover:bg-ecommerce-700">
                Browse Products
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
