
import React, { createContext, useContext, useEffect } from 'react';
import { CartProvider, useCart } from './CartContext';
import { WishlistProvider, useWishlist } from './WishlistContext';
import { AuthProvider } from './AuthContext';
import { OrdersProvider, useOrders } from './OrdersContext';
import { NotificationsProvider } from './NotificationsContext';
import { LanguageProvider } from './LanguageContext';
import { ChatProvider } from './ChatContext';
import { LocationProvider } from './LocationContext';
import { CustomersProvider, useCustomers } from './CustomersContext';
import { ProductsProvider, useProducts } from './ProductsContext';
import { supabase } from '@/integrations/supabase/client';

// Import types
export type { Product, CartItem, WishlistItem, Order } from '@/types/store';

interface StoreContextType {
  // Orders
  orders: Order[];
  createOrder: (customerInfo: any, cartItems: CartItem[], total: number) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Customers
  customers: any[];
  addCustomer: (customer: any) => Promise<void>;
  updateCustomer: (id: string, customer: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Cart functions from CartContext
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Wishlist functions from WishlistContext  
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Products from context
  products: Product[];
  collections: any[];
  
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function StoreContextInner({ children }: { children: React.ReactNode }) {
  const orders = useOrders();
  const cart = useCart();
  const wishlist = useWishlist();
  const customers = useCustomers();
  const products = useProducts();

  // Set up real-time subscriptions for remaining tables
  useEffect(() => {
    console.log('Setting up real-time subscriptions...');
    
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Orders changed:', payload);
          window.dispatchEvent(new CustomEvent('ordersUpdated', { 
            detail: { timestamp: Date.now(), payload } 
          }));
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions...');
      supabase.removeChannel(channel);
    };
  }, []);

  const value: StoreContextType = {
    // Orders
    orders: orders.orders,
    createOrder: orders.createOrder,
    updateOrderStatus: orders.updateOrderStatus,
    
    // Customers
    customers: customers.customers,
    addCustomer: customers.addCustomer,
    updateCustomer: customers.updateCustomer,
    deleteCustomer: customers.deleteCustomer,
    
    // Cart
    cart: cart.cart,
    addToCart: cart.addToCart,
    removeFromCart: cart.removeFromCart,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    getCartTotal: cart.getCartTotal,
    
    // Wishlist
    wishlist: wishlist.wishlist,
    addToWishlist: wishlist.addToWishlist,
    removeFromWishlist: wishlist.removeFromWishlist,
    isInWishlist: wishlist.isInWishlist,
    
    // Products from context
    products: products.products,
    collections: [],
    
    loading: orders.loading || customers.loading || products.loading
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <LanguageProvider>
          <LocationProvider>
            <ChatProvider>
              <OrdersProvider>
                <CustomersProvider>
                  <ProductsProvider>
                    <CartProvider>
                      <WishlistProvider>
                        <StoreContextInner>
                          {children}
                        </StoreContextInner>
                      </WishlistProvider>
                    </CartProvider>
                  </ProductsProvider>
                </CustomersProvider>
              </OrdersProvider>
            </ChatProvider>
          </LocationProvider>
        </LanguageProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
