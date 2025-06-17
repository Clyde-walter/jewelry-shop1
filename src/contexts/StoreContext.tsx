
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { useOrders } from './OrdersContext';
import { useProducts } from './ProductsContext';
import { useCustomers } from './CustomersContext';

interface StoreContextType {
  // Cart functions
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Wishlist functions
  wishlist: any[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Orders functions
  orders: any[];
  createOrder: (customerInfo: any, cartItems: any[], cartTotal: number) => Promise<any>;
  updateOrderStatus: (orderId: string, status: any) => Promise<void>;
  loading: boolean;
  
  // Products functions
  products: any[];
  
  // Customers functions
  customers: any[];
  addCustomer: (customer: any) => Promise<void>;
  updateCustomer: (customerId: string, updates: any) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  
  // Auth functions
  user: any;
  session: any;
  authLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading: authLoading } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { orders, createOrder: originalCreateOrder, updateOrderStatus, loading } = useOrders();
  const { products } = useProducts();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  // Wrap createOrder to clear cart after successful order creation
  const createOrder = async (customerInfo: any, cartItems: any[], cartTotal: number) => {
    const order = await originalCreateOrder(customerInfo, cartItems, cartTotal);
    if (order) {
      // Clear the cart after successful order creation
      clearCart();
    }
    return order;
  };

  return (
    <StoreContext.Provider
      value={{
        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        
        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        
        // Orders
        orders,
        createOrder,
        updateOrderStatus,
        loading,
        
        // Products
        products,
        
        // Customers
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        
        // Auth
        user,
        session,
        authLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
