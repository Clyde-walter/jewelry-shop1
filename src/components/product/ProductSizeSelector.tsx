
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProductSizeSelectorProps {
  category: string;
  ringSizes?: string[];
  watchSizes?: string[];
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
}

export function ProductSizeSelector({ 
  category, 
  ringSizes, 
  watchSizes, 
  selectedSize, 
  onSizeSelect 
}: ProductSizeSelectorProps) {
  const availableSizes = category === 'rings' ? ringSizes : watchSizes;
  
  if (!availableSizes || availableSizes.length === 0) {
    return null;
  }

  const sizeLabel = category === 'rings' ? 'Ring Size' : 'Watch Size';

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{sizeLabel}</Label>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSizeSelect(size)}
            className={`min-w-[50px] ${
              selectedSize === size 
                ? 'bg-ecommerce-600 hover:bg-ecommerce-700 text-white' 
                : 'hover:bg-gray-50'
            }`}
          >
            {category === 'rings' ? `Size ${size}` : size}
          </Button>
        ))}
      </div>
      {selectedSize && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Selected:</span>
          <Badge variant="secondary">
            {category === 'rings' ? `Size ${selectedSize}` : selectedSize}
          </Badge>
        </div>
      )}
    </div>
  );
}
