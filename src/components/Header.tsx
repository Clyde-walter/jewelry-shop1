
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Settings } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CartSidebar } from './CartSidebar';
import { MobileNav } from './MobileNav';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="relative">
                <img 
                  src="/lovable-uploads/06008771-3946-4cde-95f5-eed2a260f2ae.png" 
                  alt="Jewelryport Logo" 
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-ecommerce-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 bg-clip-text text-transparent group-hover:from-ecommerce-700 group-hover:to-ecommerce-800 transition-all duration-300">
                Jewelryport
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link 
                to="/" 
                className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-ecommerce-600 transition-all duration-300 group"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-ecommerce-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
              </Link>
              <Link 
                to="/products" 
                className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-ecommerce-600 transition-all duration-300 group"
              >
                <span className="relative z-10">Products</span>
                <div className="absolute inset-0 bg-ecommerce-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
              </Link>
              <Link 
                to="/collections" 
                className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-ecommerce-600 transition-all duration-300 group"
              >
                <span className="relative z-10">Collections</span>
                <div className="absolute inset-0 bg-ecommerce-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
              </Link>
              <Link 
                to="/live-map" 
                className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-ecommerce-600 transition-all duration-300 group"
              >
                <span className="relative z-10">Live Tracking</span>
                <div className="absolute inset-0 bg-ecommerce-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
              </Link>
              <Link 
                to="/contact" 
                className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-ecommerce-600 transition-all duration-300 group"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-ecommerce-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></div>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              
              {/* Search - Desktop and Tablet */}
              <button className="hidden md:flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 text-gray-400 hover:text-ecommerce-600 hover:bg-ecommerce-50 rounded-lg transition-all duration-300 group">
                <Search className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 text-gray-400 hover:text-ecommerce-600 hover:bg-ecommerce-50 rounded-lg transition-all duration-300 group"
              >
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ecommerce-600 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 text-gray-400 hover:text-ecommerce-600 hover:bg-ecommerce-50 rounded-lg transition-all duration-300 group"
              >
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ecommerce-600 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {isAdmin && (
                    <Link to="/admin" className="hidden lg:block">
                      <Button variant="outline" size="sm" className="hover:bg-ecommerce-50 hover:border-ecommerce-300 hover:text-ecommerce-700 transition-all duration-300">
                        <Settings className="w-4 h-4 mr-1" />
                        <span className="hidden xl:inline">Admin</span>
                      </Button>
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="hidden sm:flex items-center space-x-2 px-2 lg:px-3 py-2 text-gray-700 hover:text-ecommerce-600 hover:bg-ecommerce-50 rounded-lg transition-all duration-300 group"
                  >
                    <User className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden md:inline text-xs lg:text-sm truncate max-w-24 lg:max-w-32">{user.email}</span>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    size="sm"
                    className="hidden md:flex hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300 text-xs lg:text-sm"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 text-white border-0 hover:from-ecommerce-700 hover:to-ecommerce-800 hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4"
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-400 hover:text-ecommerce-600 hover:bg-ecommerce-50 rounded-lg transition-all duration-300 group"
              >
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
