
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
}

export function ProductQuantitySelector({ quantity, onQuantityChange, maxQuantity = 99 }: ProductQuantitySelectorProps) {
  const handleDecrease = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(Math.min(maxQuantity, quantity + 1));
  };

  return (
    <div className="flex items-center space-x-4">
      <label className="font-medium">Quantity:</label>
      <div className="flex items-center border rounded-md">
        <button 
          onClick={handleDecrease}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-2 border-x">{quantity}</span>
        <button 
          onClick={handleIncrease}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={quantity >= maxQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
}
