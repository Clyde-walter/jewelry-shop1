
import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/types/store';

interface OrderSearchFormProps {
  orders: Order[];
  onOrderFound: (orderNumber: string) => void;
  onOrderNotFound: () => void;
}

export function OrderSearchForm({ orders, onOrderFound, onOrderNotFound }: OrderSearchFormProps) {
  const { t } = useLanguage();
  const [orderInput, setOrderInput] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [orderFound, setOrderFound] = useState(false);

  const handleTrackOrder = () => {
    setSearchAttempted(true);
    const trimmedInput = orderInput.trim().toUpperCase();
    
    const actualOrder = orders.find(order => order.orderNumber.toUpperCase() === trimmedInput);
    
    if (actualOrder) {
      setOrderFound(true);
      onOrderFound(actualOrder.orderNumber);
      console.log(`Order found: ${actualOrder.orderNumber}`, actualOrder);
    } else {
      setOrderFound(false);
      onOrderNotFound();
      console.log(`Order not found: ${trimmedInput}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderInput(e.target.value);
    if (searchAttempted) {
      setSearchAttempted(false);
      setOrderFound(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTrackOrder();
    }
  };

  const handleQuickSelect = (orderNumber: string) => {
    setOrderInput(orderNumber);
    setOrderFound(true);
    setSearchAttempted(true);
    onOrderFound(orderNumber);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t('livemap.track.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Input
            placeholder={t('livemap.input.placeholder')}
            value={orderInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleTrackOrder} 
            className="bg-ecommerce-600 hover:bg-ecommerce-700"
            disabled={!orderInput.trim()}
          >
            <Search className="w-4 h-4 mr-2" />
            {t('livemap.track.button')}
          </Button>
        </div>
        
        {searchAttempted && !orderFound && orderInput.trim() && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {t('livemap.error.notfound').replace('ORDER_NUMBER', orderInput.trim().toUpperCase())}
            </AlertDescription>
          </Alert>
        )}

        {orders.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-2">{t('livemap.recent.orders')}</p>
            <div className="flex flex-wrap gap-2">
              {orders.slice(-5).map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleQuickSelect(order.orderNumber)}
                  className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded transition-colors"
                >
                  {order.orderNumber}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
