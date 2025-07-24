import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export function FlutterwaveCheckout() {
  const { cart, getCartTotal } = useStore();
  const [orderCreated, setOrderCreated] = useState<any>(null);

  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleOrderCreated = (order: any) => {
    setOrderCreated(order);
  };

  if (cart.length === 0 && !orderCreated) {
    return <EmptyCart />;
  }

  // Show order confirmation if order was created
  if (orderCreated) {
    return <OrderConfirmation orderCreated={orderCreated} finalTotal={finalTotal} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flutterwave Payment</h1>
      <CheckoutForm onOrderCreated={handleOrderCreated} />
    </div>
  );
}