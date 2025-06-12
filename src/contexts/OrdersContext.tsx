
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

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      const formattedOrders: Order[] = data.map((item: any) => ({
        id: item.id,
        orderNumber: item.order_number,
        items: item.items,
        total: parseFloat(item.total),
        status: item.status,
        createdAt: item.created_at,
        customerInfo: item.customer_info
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
  }, []);

  const createOrder = async (customerInfo: any, cartItems: CartItem[], cartTotal: number): Promise<Order | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an order.",
        variant: "destructive"
      });
      return null;
    }

    try {
      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      const orderNumber = orderNumberData || `ORD-${Date.now()}`;

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: orderNumber,
          items: cartItems,
          total: cartTotal,
          status: 'pending',
          customer_info: customerInfo
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating order",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      const newOrder: Order = {
        id: data.id,
        orderNumber: data.order_number,
        items: data.items,
        total: parseFloat(data.total),
        status: data.status,
        createdAt: data.created_at,
        customerInfo: data.customer_info
      };

      await fetchOrders();
      
      addNotification({
        title: t('notification.new.order'),
        message: `${t('notification.order.created')} ${orderNumber}`,
        type: 'success'
      });

      toast({
        title: "Order created successfully!",
        description: `Your order ${orderNumber} has been placed.`
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error creating order",
        description: "Something went wrong. Please try again.",
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
          title: "Error updating order",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchOrders();
      
      const order = orders.find(o => o.id === orderId);
      addNotification({
        title: t('notification.order.status.changed'),
        message: `${t('order.status')}: ${order?.orderNumber || orderId} - ${t(`status.${status}`)}`,
        type: 'info'
      });

      toast({
        title: "Order status updated",
        description: `Order status changed to ${status}`
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error updating order",
        description: "Something went wrong. Please try again.",
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
