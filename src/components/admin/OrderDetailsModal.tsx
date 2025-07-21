
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import { Order } from '@/types/store';
import { OrderLocationManager } from './OrderLocationManager';

interface OrderDetailsModalProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export function OrderDetailsModal({ order, onStatusChange }: OrderDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <p>{order.customerInfo.name}</p>
                    <p>{order.customerInfo.email}</p>
                    <p>{order.customerInfo.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p>{order.customerInfo.address}</p>
                    <p>{order.customerInfo.city}</p>
                    <p>{order.customerInfo.zipCode}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Total: ${order.total.toFixed(2)}</span>
                  <Select
                    value={order.status}
                    onValueChange={(value) => onStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Order Timeline</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Order Created</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Current Status: {order.status}</p>
                    <p className="text-xs text-gray-500">Last updated: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <OrderLocationManager orderId={order.id} orderNumber={order.orderNumber} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
