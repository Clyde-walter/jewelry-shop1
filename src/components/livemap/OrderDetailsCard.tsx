
import React from 'react';
import { Package, Truck, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/types/store';

interface OrderDetailsCardProps {
  order: Order;
  selectedOrder: string;
  orderLocation?: {
    currentLocation: string;
    coordinates: { lat: number; lng: number };
    lastUpdated: string;
  };
  trackingInfo?: {
    trackingNumber: string;
    currentLocation?: string;
  };
}

export function OrderDetailsCard({ order, selectedOrder, orderLocation, trackingInfo }: OrderDetailsCardProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-600';
      case 'in transit':
      case 'shipped':
        return 'bg-blue-600';
      case 'processing':
        return 'bg-yellow-600';
      case 'pending':
        return 'bg-orange-600';
      default:
        return 'bg-ecommerce-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Order Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Order ID:</span>
          <span className="font-mono text-sm">{selectedOrder}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Customer:</span>
          <span>{order.customerInfo?.name || 'Customer'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Status:</span>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Tracking #:</span>
          <span className="font-mono text-sm">{trackingInfo?.trackingNumber || `TRK-${selectedOrder.slice(-6)}`}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Order Date:</span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Carrier:</span>
          <span className="flex items-center">
            <Truck className="w-4 h-4 mr-1" />
            Express Delivery
          </span>
        </div>
        {(orderLocation?.currentLocation || trackingInfo?.currentLocation) && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Current Location:</span>
            <span className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1 text-blue-600" />
              {orderLocation?.currentLocation || trackingInfo?.currentLocation}
            </span>
          </div>
        )}
        <div>
          <span className="font-medium">Items:</span>
          <ul className="text-sm text-gray-600 mt-1">
            {order.items.map((item, index) => (
              <li key={index} className="ml-2">• {item.product.name} (x{item.quantity})</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium text-lg">Total:</span>
          <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
