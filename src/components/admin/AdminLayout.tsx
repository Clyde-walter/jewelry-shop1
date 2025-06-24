
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  Tag,
  Truck,
  Home,
  LogOut,
  MessageSquare,
  Mail
} from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';

function AdminLayoutContent() {
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Tag, label: 'Collections', path: '/admin/collections' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: MessageSquare, label: 'Support', path: '/admin/support' },
    { icon: Mail, label: 'Emails', path: '/admin/emails' },
    { icon: Truck, label: 'Shipping', path: '/admin/shipping' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600">ShopEase Management</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                  isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <LogOut className="w-5 h-5 mr-2" />
            Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <AuthGuard>
      <AdminLayoutContent />
    </AuthGuard>
  );
}
