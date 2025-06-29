
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  Truck,
  Mail,
  MessageSquare,
  Shield,
  RotateCcw,
  Phone
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import existing admin pages
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCustomers from './admin/AdminCustomers';
import AdminSettings from './admin/AdminSettings';
import AdminCollections from './admin/AdminCollections';
import AdminShipping from './admin/AdminShipping';
import AdminEmails from './admin/AdminEmails';

// Import new admin pages
import { AdminSupport } from './admin/AdminSupport';
import { AdminWarranty } from './admin/AdminWarranty';
import { AdminContact } from './admin/AdminContact';
import { AdminReturns } from './admin/AdminReturns';

function AdminDashboard() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/products', icon: Package, label: 'Products', color: 'bg-blue-500' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders', color: 'bg-green-500' },
    { path: '/admin/customers', icon: Users, label: 'Customers', color: 'bg-purple-500' },
    { path: '/admin/collections', icon: Package, label: 'Collections', color: 'bg-orange-500' },
    { path: '/admin/shipping', icon: Truck, label: 'Shipping', color: 'bg-teal-500' },
    { path: '/admin/emails', icon: Mail, label: 'Email Marketing', color: 'bg-pink-500' },
    { path: '/admin/support', icon: MessageSquare, label: 'Support', color: 'bg-indigo-500', badge: 'New' },
    { path: '/admin/warranty', icon: Shield, label: 'Warranty', color: 'bg-yellow-500', badge: 'New' },
    { path: '/admin/contact', icon: Phone, label: 'Contact', color: 'bg-red-500', badge: 'New' },
    { path: '/admin/returns', icon: RotateCcw, label: 'Returns', color: 'bg-gray-500', badge: 'New' },
    { path: '/admin/settings', icon: Settings, label: 'Settings', color: 'bg-gray-600' },
  ];

  const stats = [
    { title: 'Total Products', value: '1,234', change: '+12%', color: 'text-blue-600' },
    { title: 'Active Orders', value: '156', change: '+5%', color: 'text-green-600' },
    { title: 'Total Customers', value: '8,432', change: '+18%', color: 'text-purple-600' },
    { title: 'Monthly Revenue', value: '$45,678', change: '+22%', color: 'text-orange-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your e-commerce platform</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${isActive ? 'ring-2 ring-ecommerce-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${item.color} text-white flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{item.label}</h3>
                  <p className="text-gray-600 text-sm">
                    Manage {item.label.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="products/*" element={<AdminProducts />} />
        <Route path="orders/*" element={<AdminOrders />} />
        <Route path="customers/*" element={<AdminCustomers />} />
        <Route path="collections/*" element={<AdminCollections />} />
        <Route path="shipping/*" element={<AdminShipping />} />
        <Route path="emails/*" element={<AdminEmails />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="warranty" element={<AdminWarranty />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="returns" element={<AdminReturns />} />
        <Route path="settings/*" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
}
