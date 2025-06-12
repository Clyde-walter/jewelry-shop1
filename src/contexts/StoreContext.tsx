
import React, { createContext, useContext, useEffect } from 'react';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { AuthProvider } from './AuthContext';
import { ProductsProvider, useProducts } from './ProductsContext';
import { CollectionsProvider, useCollections } from './CollectionsContext';
import { OrdersProvider, useOrders } from './OrdersContext';
import { NotificationsProvider } from './NotificationsContext';
import { LanguageProvider } from './LanguageContext';
import { ChatProvider } from './ChatContext';
import { LocationProvider } from './LocationContext';
import { Product, CartItem, WishlistItem, Order } from '@/types/store';

// Re-export the Collection interface from CollectionsContext
export type { Collection } from './CollectionsContext';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Collections  
  collections: any[];
  addCollection: (collection: any) => Promise<void>;
  updateCollection: (id: string, collection: any) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  
  // Orders
  orders: Order[];
  createOrder: (customerInfo: any, cartItems: CartItem[], total: number) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Cart functions from CartContext
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Wishlist functions from WishlistContext  
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function StoreContextInner({ children }: { children: React.ReactNode }) {
  const products = useProducts();
  const collections = useCollections();
  const orders = useOrders();

  // Listen for collection updates
  useEffect(() => {
    const handleCollectionsUpdate = (event: CustomEvent) => {
      console.log('Collections updated:', event.detail);
    };

    window.addEventListener('collectionsUpdated', handleCollectionsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdate as EventListener);
    };
  }, []);

  const value: Omit<StoreContextType, 'cartItems' | 'addToCart' | 'removeFromCart' | 'updateQuantity' | 'clearCart' | 'cartTotal' | 'wishlistItems' | 'addToWishlist' | 'removeFromWishlist' | 'isInWishlist'> = {
    // Products
    products: products.products,
    addProduct: products.addProduct,
    updateProduct: products.updateProduct,
    deleteProduct: products.deleteProduct,
    
    // Collections
    collections: collections.collections,
    addCollection: collections.addCollection,
    updateCollection: collections.updateCollection,
    deleteCollection: collections.deleteCollection,
    
    // Orders
    orders: orders.orders,
    createOrder: orders.createOrder,
    updateOrderStatus: orders.updateOrderStatus,
    
    loading: products.loading || collections.loading || orders.loading
  };

  return (
    <StoreContext.Provider value={value as StoreContextType}>
      {children}
    </StoreContext.Provider>
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationsProvider>
          <LocationProvider>
            <ChatProvider>
              <ProductsProvider>
                <CollectionsProvider>
                  <OrdersProvider>
                    <CartProvider>
                      <WishlistProvider>
                        <StoreContextInner>
                          {children}
                        </StoreContextInner>
                      </WishlistProvider>
                    </CartProvider>
                  </OrdersProvider>
                </CollectionsProvider>
              </ProductsProvider>
            </ChatProvider>
          </LocationProvider>
        </NotificationsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
