
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, CreditCard, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';

export function Profile() {
  const { orders } = useStore();
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-2">John Doe</h2>
                <p className="text-gray-600 mb-4">john.doe@example.com</p>
                <Badge variant="secondary">Premium Member</Badge>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    My Wishlist
                  </Button>
                </Link>
                <Link to="/profile/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
                <Link to="/manage-addresses">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Manage Addresses
                  </Button>
                </Link>
                <Link to="/payment-methods">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="font-medium">John Doe</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="font-medium">john.doe@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="font-medium">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Member Since</label>
                      <p className="font-medium">January 2024</p>
                    </div>
                  </div>
                </div>
                <Link to="/edit-information">
                  <Button className="mt-4 bg-ecommerce-600 hover:bg-ecommerce-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Information
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link to="/orders">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No orders yet</p>
                    <Link to="/products">
                      <Button className="mt-4 bg-ecommerce-600 hover:bg-ecommerce-700">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <Badge 
                            variant={order.status === 'delivered' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Link to="/manage-addresses">
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Home</h3>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    123 Main Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
