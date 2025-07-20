import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingCryptoPaymentProps {
  orderCreated: any;
  finalTotal: number;
}

export function PendingCryptoPayment({ orderCreated, finalTotal }: PendingCryptoPaymentProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Clock className="w-16 h-16 text-amber-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <Mail className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl text-amber-800">Payment Confirmation Pending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-lg">Thank you for your cryptocurrency payment!</p>
              <p className="text-muted-foreground">
                We've received your payment confirmation and our team is currently verifying the transaction.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600" />
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Order ID:</strong> {orderCreated.orderNumber}</p>
                <p><strong>Amount:</strong> ${finalTotal.toFixed(2)}</p>
                <p><strong>Status:</strong> Pending Verification</p>
                <p><strong>Payment Method:</strong> Cryptocurrency</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                What's Next?
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>✅ <strong>Email Sent:</strong> We've sent a confirmation email to {orderCreated.customerInfo?.email}</p>
                <p>⏳ <strong>Verification in Progress:</strong> Our team is verifying your cryptocurrency payment</p>
                <p>📧 <strong>Final Confirmation:</strong> You'll receive another email once your payment is confirmed</p>
                <p>🚚 <strong>Order Processing:</strong> Your order will begin processing immediately after confirmation</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Processing Time:</strong> Verification typically takes 15-30 minutes depending on network confirmation times.
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Continue Shopping
                </Button>
                <Button onClick={() => navigate('/orders')}>
                  View My Orders
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Questions? Contact our support team for assistance.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}