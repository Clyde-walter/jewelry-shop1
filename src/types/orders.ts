
import { Order, CartItem } from '@/types/store';

export interface OrdersContextType {
  orders: Order[];
  createOrder: (customerInfo: any, cartItems: CartItem[], cartTotal: number) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  loading: boolean;
}
