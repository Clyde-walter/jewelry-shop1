
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/types/store';

interface OrderTimelineProps {
  order: Order;
  orderLocation?: {
    lastUpdated: string;
  };
}

export function OrderTimeline({ order, orderLocation }: OrderTimelineProps) {
  const { t } = useLanguage();

  const getStatusIndex = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStatusIndex = getStatusIndex(order.status);

  const timelineItems = [
    { 
      status: 'Order Placed', 
      time: order.createdAt, 
      completed: true,
      description: 'Your order has been received and is being processed'
    },
    { 
      status: 'Processing', 
      time: order.status !== 'pending' ? order.createdAt : '', 
      completed: currentStatusIndex >= 1,
      description: 'Your order is being prepared for shipment'
    },
    { 
      status: 'Shipped', 
      time: ['shipped', 'delivered'].includes(order.status) ? order.createdAt : '', 
      completed: currentStatusIndex >= 2,
      description: 'Your order has left our facility'
    },
    { 
      status: 'In Transit', 
      time: orderLocation?.lastUpdated || '', 
      completed: currentStatusIndex >= 2 || !!orderLocation,
      description: 'Your order is on the way to your address'
    },
    { 
      status: 'Delivered', 
      time: order.status === 'delivered' ? order.createdAt : '', 
      completed: order.status === 'delivered',
      description: 'Your order has been delivered'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                item.completed ? 'bg-green-600' : 'bg-gray-300'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    item.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {item.status}
                  </p>
                  {item.time && (
                    <p className="text-sm text-gray-500">
                      {new Date(item.time).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {item.description}
                </p>
                {!item.completed && index === currentStatusIndex + 1 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Expected next step
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!orderLocation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Live tracking data will be available once your order is shipped and location updates are provided by the carrier.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
