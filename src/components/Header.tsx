
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Bell, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { CartSidebar } from './CartSidebar';
import { LanguageSelector } from './LanguageSelector';
import { MobileNav } from './MobileNav';

export function Header() {
  const location = useLocation();
  const { cart } = useStore();
  const { unreadCount } = useNotifications();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Always on the left */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-ecommerce-600 hover:text-ecommerce-700 transition-colors">
                ShopEase
              </Link>
            </div>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium transition-colors hover:text-ecommerce-600 ${
                  isActive('/') ? 'text-ecommerce-600' : 'text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`font-medium transition-colors hover:text-ecommerce-600 ${
                  isActive('/products') ? 'text-ecommerce-600' : 'text-gray-700'
                }`}
              >
                Products
              </Link>
              <Link
                to="/collections"
                className={`font-medium transition-colors hover:text-ecommerce-600 ${
                  isActive('/collections') ? 'text-ecommerce-600' : 'text-gray-700'
                }`}
              >
                Collections
              </Link>
              <Link
                to="/orders"
                className={`font-medium transition-colors hover:text-ecommerce-600 ${
                  isActive('/orders') ? 'text-ecommerce-600' : 'text-gray-700'
                }`}
              >
                Orders
              </Link>
              <Link
                to="/live-map"
                className={`font-medium transition-colors hover:text-ecommerce-600 ${
                  isActive('/live-map') ? 'text-ecommerce-600' : 'text-gray-700'
                }`}
              >
                Live Map
              </Link>
            </nav>

            {/* Actions - Mobile menu included here on the right */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:bg-ecommerce-50"
              >
                <Search className="w-5 h-5" />
              </Button>

              <Link to="/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-ecommerce-50"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

              <div className="hidden md:block">
                <Link to="/chat">
                  <Button variant="ghost" size="icon" className="hover:bg-ecommerce-50">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-ecommerce-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-ecommerce-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="ghost" size="icon" className="hover:bg-ecommerce-50">
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              {/* Mobile Menu - Now on the right */}
              <MobileNav />
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="mt-4 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ecommerce-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
