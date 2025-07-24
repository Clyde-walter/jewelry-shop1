import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CryptoPayment } from '@/components/checkout/CryptoPayment';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';

export function Checkout() {
  const { cart, getCartTotal } = useStore();
  const [searchParams] = useSearchParams();
  const [orderCreated, setOrderCreated] = useState<any>(null);
  
  const paymentMethod = searchParams.get('method');

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

  // Show crypto payment if method=crypto
  if (paymentMethod === 'crypto') {
    return (
      <CryptoPayment
        amount={finalTotal}
        customerInfo={{}}
        cartItems={cart}
        onPaymentComplete={handleOrderCreated}
      />
    );
  }

  return <CheckoutForm onOrderCreated={handleOrderCreated} />;
}