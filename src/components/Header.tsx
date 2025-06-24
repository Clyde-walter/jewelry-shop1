
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
        title: t('auth.signout.success') || "Signed out successfully",
        description: t('auth.signout.description') || "You have been logged out of your account."
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: t('auth.signout.error') || "Error signing out",
        description: t('auth.signout.error.description') || "There was an error signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-ecommerce-600 hover:text-ecommerce-700 transition-colors">
              ShopEase
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-ecommerce-600 transition-colors">
                {t('nav.home') || 'Home'}
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-ecommerce-600 transition-colors">
                {t('nav.products') || 'Products'}
              </Link>
              <Link to="/collections" className="text-gray-700 hover:text-ecommerce-600 transition-colors">
                {t('nav.collections') || 'Collections'}
              </Link>
              <Link to="/live-map" className="text-gray-700 hover:text-ecommerce-600 transition-colors">
                {t('nav.tracking') || 'Live Tracking'}
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-ecommerce-600 transition-colors">
                {t('nav.contact') || 'Contact'}
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {/* Search - Desktop only */}
              <button className="hidden md:block p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ecommerce-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ecommerce-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-1">
                        <Settings className="w-4 h-4" />
                        <span>Admin</span>
                      </Button>
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-ecommerce-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline text-sm">{user.email}</span>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    size="sm"
                    className="hidden md:block"
                  >
                    {t('auth.signout') || 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    {t('auth.signin') || 'Sign In'}
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
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
