
import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';
import { CustomerInfoForm } from './CustomerInfoForm';
import { ShippingAddressForm } from './ShippingAddressForm';
import { PaymentInfoForm } from './PaymentInfoForm';
import { OrderSummary } from './OrderSummary';
import { PaystackPayment } from './PaystackPayment';
import { FlutterwavePayment } from './FlutterwavePayment';
import { CPTPaymentForm } from './CPTPaymentForm';

interface CheckoutFormProps {
  onOrderCreated: (order: any) => void;
}

export function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
  const { cart, getCartTotal, createOrder } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('flutterwave');
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

  const validateRequiredFields = () => {
    if (!customerInfo.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }
    
    if (!customerInfo.email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return false;
    }
    
    if (!customerInfo.address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your shipping address",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = (order: any) => {
    onOrderCreated(order);
    toast({
      title: "Payment successful!",
      description: `Your order has been confirmed.`
    });
  };

  const handlePaymentValidation = () => {
    return validateRequiredFields();
  };

  const handleCPTPayment = (formData: any, method: string) => {
    if (!validateRequiredFields()) return;
    
    setIsProcessing(true);
    // Simulate CPT payment processing
    setTimeout(() => {
      setIsProcessing(false);
      const order = {
        id: `CPT-${Date.now()}`,
        items: cart,
        total: finalTotal,
        customerInfo,
        paymentMethod: `cpt-${method}`,
        status: 'pending-verification'
      };
      handlePaymentSuccess(order);
      toast({
        title: "CPT Payment submitted",
        description: "We'll verify your payment and process your order shortly",
      });
    }, 2000);
  };

  const renderPaymentButton = () => {
    if (paymentMethod === 'cpt') {
      return (
        <CPTPaymentForm
          onSubmit={handleCPTPayment}
          isProcessing={isProcessing}
        />
      );
    }
    
    return (
      <FlutterwavePayment
        amount={finalTotal}
        email={customerInfo.email}
        customerInfo={customerInfo}
        cartItems={cart}
        onSuccess={handlePaymentSuccess}
        onValidate={handlePaymentValidation}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          <div>
            <OrderSummary
              cart={cart}
              total={total}
              shipping={shipping}
              tax={tax}
              finalTotal={finalTotal}
              isProcessing={isProcessing}
              paymentMethod={paymentMethod}
              renderPaymentButton={renderPaymentButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
