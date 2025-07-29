
import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('flutterwave');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
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

  const handleCPTPayment = async (formData: any, method: string) => {
    if (!validateRequiredFields()) return;
    
    setIsProcessing(true);
    
    try {
      if (!formData?.screenshot) {
        throw new Error('Screenshot is required for CPT payment');
      }

      // Upload screenshot to storage
      const fileExt = formData.screenshot.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`payment-screenshots/${fileName}`, formData.screenshot);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`payment-screenshots/${fileName}`);

      // Create order with a simple order number first, then update with proper number
      const tempOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create order first
      const orderData = {
        user_id: user?.id || null,
        order_number: tempOrderNumber,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: Number(finalTotal.toFixed(2)),
        customer_info: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.zipCode}, ${customerInfo.country}`
        },
        status: 'pending'
      };

      console.log('Creating order with data:', orderData);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Save payment confirmation
      const { error: confirmationError } = await supabase
        .from('payment_confirmations')
        .insert({
          order_id: order.id,
          user_id: user?.id,
          payment_method: method === 'bank-transfer' ? 'bank-transfer' : 'crypto',
          payment_type: method === 'bank-transfer' ? null : method,
          screenshot_url: publicUrl,
          notes: formData.notes || ''
        });

      if (confirmationError) throw confirmationError;

      toast({
        title: "Payment Confirmation Submitted",
        description: "Your payment confirmation has been submitted for admin review. Your order will be processed once payment is confirmed.",
      });
      
      handlePaymentSuccess(order);
      clearCart();
      
    } catch (error) {
      console.error('Error submitting CPT payment:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      toast({
        title: "Submission Failed",
        description: `Failed to submit payment confirmation: ${error.message}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentButton = () => {
    if (paymentMethod === 'cpt') {
      return (
              <CPTPaymentForm 
                onSubmit={handleCPTPayment}
                isProcessing={isProcessing}
                totalAmount={finalTotal}
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
