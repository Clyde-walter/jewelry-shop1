
import { useState } from 'react';
import { Order, CartItem } from '@/types/store';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { generateOrderNumber } from '@/utils/orderUtils';

export function useOrderOperations() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      // Only fetch orders for the current user
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      const formattedOrders: Order[] = data.map((item: any) => ({
        id: item.id,
        orderNumber: item.order_number || generateOrderNumber(),
        items: Array.isArray(item.items) ? item.items as unknown as CartItem[] : [],
        total: parseFloat(item.total.toString()),
        status: item.status as Order['status'],
        createdAt: item.created_at,
        customerInfo: typeof item.customer_info === 'object' ? item.customer_info : JSON.parse(item.customer_info as string)
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (customerInfo: any, cartItems: CartItem[], cartTotal: number): Promise<Order | null> => {
    if (!user) {
      toast({
        title: t('order.error.auth.title') || "Authentication required",
        description: t('order.error.auth.description') || "Please log in to create an order.",
        variant: "destructive"
      });
      return null;
    }

    try {
      // Generate professional order number
      const orderNumber = generateOrderNumber();
      console.log('Creating order with number:', orderNumber);

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          items: cartItems as any,
          total: cartTotal,
          status: 'pending',
          customer_info: customerInfo as any
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        toast({
          title: t('order.error.create.title') || "Error creating order",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      const newOrder: Order = {
        id: data.id,
        orderNumber: data.order_number,
        items: Array.isArray(data.items) ? data.items as unknown as CartItem[] : [],
        total: parseFloat(data.total.toString()),
        status: data.status as Order['status'],
        createdAt: data.created_at,
        customerInfo: typeof data.customer_info === 'object' ? data.customer_info : JSON.parse(data.customer_info as string)
      };

      await fetchOrders();
      
      // Send order confirmation email
      try {
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            orderNumber: orderNumber,
            orderTotal: cartTotal,
            orderItems: cartItems.map(item => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity
            })),
            shippingAddress: customerInfo
          }
        });
        console.log('Order confirmation email sent for:', orderNumber);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order creation if email fails
      }
      
      addNotification({
        title: t('notification.new.order') || 'New Order',
        message: `${t('notification.order.created') || 'Order created'} ${orderNumber}`,
        type: 'success'
      });

      toast({
        title: t('order.success.create.title') || "Order created successfully!",
        description: `${t('order.success.create.description') || 'Your order'} ${orderNumber} ${t('order.success.create.placed') || 'has been placed'}.`
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: t('order.error.create.title') || "Error creating order",
        description: t('order.error.create.generic') || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        toast({
          title: t('order.error.update.title') || "Error updating order",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchOrders();
      
      const order = orders.find(o => o.id === orderId);
      
      // Send shipping alert email for status changes
      if (order && ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'].includes(status)) {
        try {
          await supabase.functions.invoke('send-shipping-alert', {
            body: {
              customerName: order.customerInfo?.name || 'Customer',
              customerEmail: order.customerInfo?.email,
              orderNumber: order.orderNumber,
              status: status,
              trackingNumber: undefined,
              estimatedDelivery: undefined,
              shippingCarrier: undefined
            }
          });
          console.log('Shipping alert email sent for:', order.orderNumber, 'Status:', status);
        } catch (emailError) {
          console.error('Error sending shipping alert email:', emailError);
          // Don't fail the status update if email fails
        }
      }
      
      addNotification({
        title: t('notification.order.status.changed') || 'Order Status Changed',
        message: `${t('order.status') || 'Status'}: ${order?.orderNumber || orderId} - ${t(`status.${status}`) || status}`,
        type: 'info'
      });

      toast({
        title: t('order.success.update.title') || "Order status updated",
        description: `${t('order.success.update.description') || 'Order status changed to'} ${t(`status.${status}`) || status}`
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: t('order.error.update.title') || "Error updating order",
        description: t('order.error.update.generic') || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    createOrder,
    updateOrderStatus
  };
}
