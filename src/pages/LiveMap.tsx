
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/contexts/OrdersContext';
import { useLocation } from '@/contexts/LocationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { OrderMap } from '@/components/map/OrderMap';
import { OrderSearchForm } from '@/components/livemap/OrderSearchForm';
import { OrderDetailsCard } from '@/components/livemap/OrderDetailsCard';
import { OrderTimeline } from '@/components/livemap/OrderTimeline';

export function LiveMap() {
  const { orders, loading } = useOrders();
  const { getOrderLocation } = useLocation();
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState('');
  const [orderFound, setOrderFound] = useState(false);

  // Enhanced mock tracking data for demo - includes all current orders
  const mockTrackingData: Record<string, any> = {};
  
  // Generate mock tracking data for all orders
  orders.forEach((order, index) => {
    const locations = [
      { name: 'Distribution Center - New York', lat: 40.7128, lng: -74.0060 },
      { name: 'Warehouse - California', lat: 34.0522, lng: -118.2437 },
      { name: 'Processing Center - Texas', lat: 32.7767, lng: -96.7970 },
      { name: 'Distribution Hub - Florida', lat: 25.7617, lng: -80.1918 },
      { name: 'Shipping Center - Chicago', lat: 41.8781, lng: -87.6298 }
    ];
    
    const location = locations[index % locations.length];
    mockTrackingData[order.id] = {
      currentLocation: location.name,
      coordinates: { lat: location.lat, lng: location.lng },
      trackingNumber: `TRK-${order.id.slice(-6)}-2024`,
    };
  });

  const handleOrderFound = (orderId: string) => {
    setSelectedOrder(orderId);
    setOrderFound(true);
  };

  const handleOrderNotFound = () => {
    setOrderFound(false);
    setSelectedOrder('');
  };

  const currentOrder = selectedOrder ? orders.find(order => order.id === selectedOrder) : null;
  const orderLocation = selectedOrder ? getOrderLocation(selectedOrder) : undefined;
  const trackingInfo = selectedOrder ? mockTrackingData[selectedOrder] : undefined;

  // Use mock coordinates if no real location data exists
  const displayCoordinates = orderLocation?.coordinates || trackingInfo?.coordinates;
  const displayLocation = orderLocation?.currentLocation || trackingInfo?.currentLocation;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ecommerce-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('livemap.title')}</h1>
        <p className="text-gray-600">Track your orders in real-time and see their current location on the map.</p>
      </div>
      
      <OrderSearchForm 
        orders={orders}
        onOrderFound={handleOrderFound}
        onOrderNotFound={handleOrderNotFound}
      />

      {orders.length === 0 && (
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              You don't have any orders to track yet. Place an order to see live tracking information.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedOrder && orderFound && currentOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('livemap.location.tracking')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderMap
                  coordinates={displayCoordinates}
                  location={displayLocation}
                  orderId={selectedOrder}
                />
                {(orderLocation || trackingInfo) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>{t('order.last.updated')}:</strong> {
                        orderLocation ? 
                        new Date(orderLocation.lastUpdated).toLocaleString() :
                        'Demo data - Updated 2 hours ago'
                      }
                    </p>
                    {!orderLocation && (
                      <p className="text-xs text-green-600 mt-1">
                        * This is demo tracking data for demonstration purposes
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <OrderDetailsCard
              order={currentOrder}
              selectedOrder={selectedOrder}
              orderLocation={orderLocation}
              trackingInfo={trackingInfo}
            />

            <OrderTimeline
              order={currentOrder}
              orderLocation={orderLocation}
            />
          </div>
        </div>
      )}

      {!selectedOrder && orders.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders Available for Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleOrderFound(order.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm text-blue-600">{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {order.customerInfo?.name || 'Customer'}
                  </p>
                  <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
