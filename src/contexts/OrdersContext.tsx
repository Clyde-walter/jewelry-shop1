
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '@/types/store';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationsContext';
import { useLanguage } from './LanguageContext';
import { toast } from '@/hooks/use-toast';

interface OrdersContextType {
  orders: Order[];
  createOrder: (customerInfo: any, cartItems: CartItem[], cartTotal: number) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Generate a consistent order number format (ORD-1234567890)
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  return `ORD-${timestamp}`;
};

export function OrdersProvider({ children }: { children: React.ReactNode }) {
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

  useEffect(() => {
    fetchOrders();
  }, [user]);

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
      // Generate consistent order number
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

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        loading
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within a OrdersProvider');
  }
  return context;
}
