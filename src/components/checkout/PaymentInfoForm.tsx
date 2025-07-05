
import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentInfoFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export function PaymentInfoForm({ paymentMethod, onPaymentMethodChange }: PaymentInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-ecommerce-50 p-4 rounded-lg border border-ecommerce-200">
          <div className="flex items-center gap-2 text-ecommerce-700">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Secure Payment Processing</span>
          </div>
          <p className="text-sm text-ecommerce-600 mt-1">
            Your payment information is encrypted and secure.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Select Payment Method</label>
          <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="paystack" id="paystack" />
              <Label htmlFor="paystack" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  🏦
                </div>
                <div>
                  <div className="font-medium">Paystack</div>
                  <div className="text-sm text-gray-500">Cards, Bank Transfer, USSD</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  💳
                </div>
                <div>
                  <div className="font-medium">Stripe</div>
                  <div className="text-sm text-gray-500">Credit/Debit Cards</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="flutterwave" id="flutterwave" />
              <Label htmlFor="flutterwave" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  🦋
                </div>
                <div>
                  <div className="font-medium">Flutterwave</div>
                  <div className="text-sm text-gray-500">Cards, Bank Transfer, Mobile Money</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'stripe' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Card Number</label>
              <Input placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <Input placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVC</label>
                <Input placeholder="123" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
