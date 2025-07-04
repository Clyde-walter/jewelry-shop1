
import React, { createContext, useContext, useEffect } from 'react';
import { OrdersContextType } from '@/types/orders';
import { useOrderOperations } from '@/hooks/useOrderOperations';
import { useAuth } from './AuthContext';

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { orders, loading, fetchOrders, createOrder, updateOrderStatus } = useOrderOperations();

  useEffect(() => {
    fetchOrders();
  }, [user]);

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
