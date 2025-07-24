
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  Home,
  Truck,
  Mail,
  MessageSquare,
  Shield,
  RotateCcw,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Collections', href: '/admin/collections', icon: Package },
    { name: 'Shipping', href: '/admin/shipping', icon: Truck },
    { name: 'Email Marketing', href: '/admin/emails', icon: Mail },
    { name: 'Support', href: '/admin/support', icon: MessageSquare },
    { name: 'Warranty', href: '/admin/warranty', icon: Shield },
    { name: 'Contact', href: '/admin/contact', icon: Phone },
    { name: 'Returns', href: '/admin/returns', icon: RotateCcw },
    
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <Link to="/admin" className="flex items-center">
              <img 
                src="/lovable-uploads/06008771-3946-4cde-95f5-eed2a260f2ae.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold">Admin</span>
            </Link>
          </div>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-ecommerce-100 text-ecommerce-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          isActive ? 'text-ecommerce-600' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
