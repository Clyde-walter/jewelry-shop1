import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { PendingCryptoPayment } from '@/components/checkout/PendingCryptoPayment';

export function Checkout() {
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
    // Show different confirmation page for crypto payments
    if (orderCreated.paymentMethod === 'crypto' && orderCreated.status === 'pending_verification') {
      return <PendingCryptoPayment orderCreated={orderCreated} finalTotal={finalTotal} />;
    }
    return <OrderConfirmation orderCreated={orderCreated} finalTotal={finalTotal} />;
  }

  return <CheckoutForm onOrderCreated={handleOrderCreated} />;
}