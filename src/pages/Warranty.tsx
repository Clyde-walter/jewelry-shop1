
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, CheckCircle, FileText, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function Warranty() {
  const { user } = useAuth();
  const [warrantyForm, setWarrantyForm] = useState({
    orderNumber: '',
    productName: '',
    issueDescription: '',
    email: '',
    purchaseDate: '',
    customerName: '',
    customerPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('warranty_claims')
        .insert({
          user_id: user?.id || null,
          order_number: warrantyForm.orderNumber,
          product_name: warrantyForm.productName,
          purchase_date: warrantyForm.purchaseDate,
          issue_description: warrantyForm.issueDescription,
          customer_email: warrantyForm.email,
          customer_name: warrantyForm.customerName,
          customer_phone: warrantyForm.customerPhone,
          status: 'pending',
          priority: 'medium'
        });

      if (error) throw error;

      toast({
        title: "Warranty claim submitted!",
        description: "We'll review your claim and contact you within 2 business days.",
      });

      setWarrantyForm({
        orderNumber: '',
        productName: '',
        issueDescription: '',
        email: '',
        purchaseDate: '',
        customerName: '',
        customerPhone: ''
      });
    } catch (error) {
      console.error('Error submitting warranty claim:', error);
      toast({
        title: "Error submitting claim",
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
        <h1 className="text-4xl font-bold mb-4">Lifetime Warranty</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We stand behind the quality of our jewelry with our comprehensive lifetime warranty program.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Warranty Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-ecommerce-600" />
                What's Covered
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Manufacturing Defects</p>
                  <p className="text-gray-600 text-sm">Faulty settings, loose stones, or structural issues.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Stone Loss</p>
                  <p className="text-gray-600 text-sm">Lost gemstones due to setting failure under normal wear.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Metal Issues</p>
                  <p className="text-gray-600 text-sm">Tarnishing, discoloration, or metal degradation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Free Repairs</p>
                  <p className="text-gray-600 text-sm">Professional cleaning, polishing, and minor repairs.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warranty Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                • Warranty is valid for the original purchaser only
              </p>
              <p className="text-sm text-gray-600">
                • Proof of purchase required for all warranty claims
              </p>
              <p className="text-sm text-gray-600">
                • Normal wear and tear is covered; damage from abuse is not
              </p>
              <p className="text-sm text-gray-600">
                • Custom pieces are covered under the same warranty terms
              </p>
              <p className="text-sm text-gray-600">
                • Warranty covers repair or replacement at our discretion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-ecommerce-600" />
                Care Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Store jewelry in individual pouches or compartments</p>
                <p>• Remove jewelry before swimming, showering, or exercising</p>
                <p>• Clean with a soft cloth and mild soap solution</p>
                <p>• Avoid exposure to harsh chemicals and perfumes</p>
                <p>• Have your jewelry professionally inspected annually</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warranty Claim Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Warranty Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitClaim} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name</Label>
                <Input
                  id="customerName"
                  value={warrantyForm.customerName}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, customerName: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  value={warrantyForm.orderNumber}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, orderNumber: e.target.value })}
                  placeholder="e.g., ORD-123456"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={warrantyForm.email}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
                <Input
                  id="customerPhone"
                  value={warrantyForm.customerPhone}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, customerPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={warrantyForm.productName}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, productName: e.target.value })}
                  placeholder="e.g., Diamond Solitaire Ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={warrantyForm.purchaseDate}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, purchaseDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDescription">Issue Description</Label>
                <Textarea
                  id="issueDescription"
                  value={warrantyForm.issueDescription}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, issueDescription: e.target.value })}
                  placeholder="Please describe the issue with your jewelry in detail..."
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Warranty Claim'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Repairs */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Need Emergency Repair?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              For urgent repairs needed for special occasions, contact our priority service team. 
              Rush repairs may be available for an additional fee.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-ecommerce-600 hover:bg-ecommerce-700">
                Call Priority Service
              </Button>
              <Button variant="outline">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
