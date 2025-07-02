
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';

export function Orders() {
  const { orderId } = useParams();
  const { orders } = useStore();

  if (orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <Link to="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      );
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'pending':
          return <Clock className="w-5 h-5 text-yellow-500" />;
        case 'processing':
          return <Package className="w-5 h-5 text-blue-500" />;
        case 'shipped':
          return <Truck className="w-5 h-5 text-purple-500" />;
        case 'delivered':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'cancelled':
          return <XCircle className="w-5 h-5 text-red-500" />;
        default:
          return <Clock className="w-5 h-5 text-gray-500" />;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'shipped': return 'bg-purple-100 text-purple-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/orders" className="text-ecommerce-600 hover:text-ecommerce-700 mb-4 inline-block">
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Order confirmed
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Processing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Shipped
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      Delivered
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">{item.product.description}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.product.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(order.total * 0.08).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(order.total + order.total * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-medium">{order.customerInfo.name}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address:</p>
                    <p className="text-sm">{order.customerInfo.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <p className="text-gray-600">Track and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">When you place your first order, it will appear here.</p>
          <Link to="/products">
            <Button className="bg-ecommerce-600 hover:bg-ecommerce-700">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Order {order.orderNumber}</h3>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
