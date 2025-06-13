
import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';
import { CustomerInfoForm } from './CustomerInfoForm';
import { ShippingAddressForm } from './ShippingAddressForm';
import { PaymentInfoForm } from './PaymentInfoForm';
import { OrderSummary } from './OrderSummary';
import { PaystackPayment } from './PaystackPayment';

interface CheckoutFormProps {
  onOrderCreated: (order: any) => void;
}

export function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
  const { cart, getCartTotal, createOrder } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = await createOrder(customerInfo, cart, finalTotal);
      if (order) {
        onOrderCreated(order);
        
        toast({
          title: "Order placed successfully!",
          description: `Order #${order.orderNumber || order.id} has been created.`
        });
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackSuccess = (order: any) => {
    onOrderCreated(order);
    toast({
      title: "Payment successful!",
      description: `Your order has been confirmed.`
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="space-y-6">
            <CustomerInfoForm 
              customerInfo={customerInfo}
              onInputChange={handleInputChange}
            />
            <ShippingAddressForm 
              customerInfo={customerInfo}
              onInputChange={handleInputChange}
            />
            <PaymentInfoForm 
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              cart={cart}
              total={total}
              shipping={shipping}
              tax={tax}
              finalTotal={finalTotal}
              isProcessing={isProcessing}
              onSubmit={paymentMethod === 'stripe' ? handleStripeSubmit : undefined}
              paymentMethod={paymentMethod}
              renderPaymentButton={() => 
                paymentMethod === 'paystack' ? (
                  <PaystackPayment
                    amount={finalTotal}
                    email={customerInfo.email}
                    customerInfo={customerInfo}
                    cartItems={cart}
                    onSuccess={handlePaystackSuccess}
                  />
                ) : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
