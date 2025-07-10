
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, WishlistItem } from '@/types/store';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | WishlistItem, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product | WishlistItem, selectedSize?: string) => {
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description || '',
      category: 'category' in product ? product.category : 'General',
      stock: 'stock' in product ? product.stock : 999,
      ringSizes: 'ringSizes' in product ? product.ringSizes : undefined,
      watchSizes: 'watchSizes' in product ? product.watchSizes : undefined,
      specifications: 'specifications' in product ? product.specifications : undefined
    };

    setCart(currentCart => {
      const existingItem = currentCart.find(item => 
        item.product.id === cartProduct.id && item.selectedSize === selectedSize
      );
      
      if (existingItem) {
        return currentCart.map(item =>
          item.product.id === cartProduct.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentCart, { product: cartProduct, quantity: 1, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart(currentCart => currentCart.filter(item => 
      !(item.product.id === productId && item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
