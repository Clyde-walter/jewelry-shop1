
import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentInfoFormProps {
  // No props needed since we only support Flutterwave
}

export function PaymentInfoForm({}: PaymentInfoFormProps) {
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
          <label className="block text-sm font-medium mb-3">Payment Method</label>
          <div className="flex items-center space-x-2 p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              🦋
            </div>
            <div className="flex-1">
              <div className="font-medium text-orange-800">Flutterwave</div>
              <div className="text-sm text-orange-600">Secure payments - Cards, Bank Transfer, Mobile Money</div>
            </div>
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
