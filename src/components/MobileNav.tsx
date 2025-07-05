
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Package, Layers, ShoppingBag, MapPin, Diamond, User, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LanguageSelector } from './LanguageSelector';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/collections', label: 'Collections', icon: Layers },
    { path: '/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/live-map', label: 'Live Map', icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 sm:w-96 p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-left flex items-center space-x-2">
                <Diamond className="w-6 h-6 text-ecommerce-600" />
                <span className="text-ecommerce-600 font-bold text-xl">Jewelryport</span>
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto">
              {/* Search Bar for Mobile */}
              <div className="px-6 py-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecommerce-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="px-6 py-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-ecommerce-100 text-ecommerce-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-base">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* User Section */}
              {user && (
                <div className="px-6 py-4 border-t">
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-base block">Profile</span>
                        <span className="text-sm text-gray-500 truncate block">{user.email}</span>
                      </div>
                    </Link>
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="text-base">Admin Panel</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Language Selector */}
              <div className="px-6 py-4 border-t">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Language:</span>
                  <LanguageSelector />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t bg-gray-50">
              {user ? (
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300"
                >
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={onClose}>
                  <Button 
                    className="w-full bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 text-white hover:from-ecommerce-700 hover:to-ecommerce-800 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
