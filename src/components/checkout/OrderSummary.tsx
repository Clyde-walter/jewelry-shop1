
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/types/store';
import { Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  cart: CartItem[];
  total: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  isProcessing: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  paymentMethod?: string;
  renderPaymentButton?: () => React.ReactNode;
}

export function OrderSummary({ 
  cart, 
  total, 
  shipping, 
  tax, 
  finalTotal, 
  isProcessing, 
  onSubmit,
  paymentMethod = 'stripe',
  renderPaymentButton
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <hr />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Button */}
        {paymentMethod === 'paystack' && renderPaymentButton ? (
          renderPaymentButton()
        ) : (
          onSubmit && (
            <form onSubmit={onSubmit}>
              <Button
                type="submit"
                className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </Button>
            </form>
          )
        )}
        
        <p className="text-xs text-gray-500 text-center">
          By placing your order, you agree to our terms and conditions.
        </p>
      </CardContent>
    </Card>
  );
}
