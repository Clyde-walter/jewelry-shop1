
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductsProvider, useProducts } from './ProductsContext';
import { CollectionsProvider, useCollections } from './CollectionsContext';
import { CartProvider, useCart } from './CartContext';
import { WishlistProvider, useWishlist } from './WishlistContext';
import { OrdersProvider, useOrders } from './OrdersContext';
import { NotificationsProvider } from './NotificationsContext';
import { ChatProvider } from './ChatContext';
import { LocationProvider } from './LocationContext';
import { LanguageProvider } from './LanguageContext';
import { Product, CartItem, WishlistItem, Order } from '@/types/store';
import { Collection } from './CollectionsContext';

interface StoreContextType {
  products: Product[];
  collections: Collection[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  addToCart: (product: Product | WishlistItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id'>) => Promise<void>;
  updateCollection: (id: string, collection: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  createOrder: (customerInfo: any) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  lastUpdated: number;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function StoreContextProvider({ children }: { children: React.ReactNode }) {
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProducts();
  const { collections, addCollection, updateCollection, deleteCollection, loading: collectionsLoading } = useCollections();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { orders, createOrder: createOrderBase, updateOrderStatus, loading: ordersLoading } = useOrders();
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const loading = productsLoading || collectionsLoading || ordersLoading;

  // Listen for real-time updates
  useEffect(() => {
    const handleProductsUpdate = () => setLastUpdated(Date.now());
    const handleCollectionsUpdate = () => setLastUpdated(Date.now());

    window.addEventListener('productsUpdated', handleProductsUpdate);
    window.addEventListener('collectionsUpdated', handleCollectionsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdate);
    };
  }, []);

  const createOrder = async (customerInfo: any): Promise<Order | null> => {
    const order = await createOrderBase(customerInfo, cart, getCartTotal());
    if (order) {
      clearCart();
    }
    return order;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        collections,
        cart,
        wishlist,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        addCollection,
        updateCollection,
        deleteCollection,
        createOrder,
        updateOrderStatus,
        lastUpdated,
        loading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <NotificationsProvider>
        <LanguageProvider>
          <LocationProvider>
            <ProductsProvider>
              <CollectionsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrdersProvider>
                      <StoreContextProvider>
                        {children}
                      </StoreContextProvider>
                    </OrdersProvider>
                  </WishlistProvider>
                </CartProvider>
              </CollectionsProvider>
            </ProductsProvider>
          </LocationProvider>
        </LanguageProvider>
      </NotificationsProvider>
    </ChatProvider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

// Re-export types for convenience
export type { Product, CartItem, WishlistItem, Order, Collection };
