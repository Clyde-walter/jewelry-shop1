
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface OrderConfirmationProps {
  orderCreated: any;
  finalTotal: number;
}

export function OrderConfirmation({ orderCreated, finalTotal }: OrderConfirmationProps) {
  const navigate = useNavigate();

  const copyOrderNumber = () => {
    if (orderCreated) {
      navigator.clipboard.writeText(orderCreated.orderNumber || orderCreated.id);
      toast({
        title: "Order number copied!",
        description: "You can now use this number to track your order."
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Order Number</h3>
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <span className="text-2xl font-mono font-bold text-ecommerce-600">
                    {orderCreated.orderNumber || orderCreated.id}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyOrderNumber}
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Save this number to track your order status
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Amount:</span>
                    <p className="font-semibold">${finalTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-semibold text-blue-600">Processing</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/live-map')}
            className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
          >
            Track Your Order
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/orders')}
            className="w-full"
          >
            View All Orders
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/products')}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
