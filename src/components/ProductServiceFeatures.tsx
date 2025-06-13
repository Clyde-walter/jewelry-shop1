
import React from 'react';
import { Truck, Shield, RotateCcw } from 'lucide-react';

export function ProductServiceFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center space-x-2 text-sm">
        <Truck className="w-5 h-5 text-ecommerce-600" />
        <span>Free Shipping</span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <Shield className="w-5 h-5 text-ecommerce-600" />
        <span>Lifetime Warranty</span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <RotateCcw className="w-5 h-5 text-ecommerce-600" />
        <span>30-Day Returns</span>
      </div>
    </div>
  );
}
