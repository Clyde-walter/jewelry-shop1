
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProductSpecificationsFormProps {
  category: string;
  specifications: Record<string, any>;
  ringSizes: string[];
  watchSizes: string[];
  onSpecificationsChange: (specifications: Record<string, any>) => void;
  onRingSizesChange: (sizes: string[]) => void;
  onWatchSizesChange: (sizes: string[]) => void;
}

const COMMON_RING_SIZES = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
const COMMON_WATCH_SIZES = ['38mm', '40mm', '42mm', '44mm', '45mm', '46mm'];

export function ProductSpecificationsForm({
  category,
  specifications,
  ringSizes,
  watchSizes,
  onSpecificationsChange,
  onRingSizesChange,
  onWatchSizesChange
}: ProductSpecificationsFormProps) {
  const updateSpecification = (key: string, value: string) => {
    onSpecificationsChange({
      ...specifications,
      [key]: value
    });
  };

  const toggleRingSize = (size: string) => {
    if (ringSizes.includes(size)) {
      onRingSizesChange(ringSizes.filter(s => s !== size));
    } else {
      onRingSizesChange([...ringSizes, size]);
    }
  };

  const toggleWatchSize = (size: string) => {
    if (watchSizes.includes(size)) {
      onWatchSizesChange(watchSizes.filter(s => s !== size));
    } else {
      onWatchSizesChange([...watchSizes, size]);
    }
  };

  const addCustomRingSize = (customSize: string) => {
    if (customSize && !ringSizes.includes(customSize)) {
      onRingSizesChange([...ringSizes, customSize]);
    }
  };

  const addCustomWatchSize = (customSize: string) => {
    if (customSize && !watchSizes.includes(customSize)) {
      onWatchSizesChange([...watchSizes, customSize]);
    }
  };

  const removeSize = (size: string, type: 'ring' | 'watch') => {
    if (type === 'ring') {
      onRingSizesChange(ringSizes.filter(s => s !== size));
    } else {
      onWatchSizesChange(watchSizes.filter(s => s !== size));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Specifications</h3>
      
      {/* Basic Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={specifications.material || ''}
            onChange={(e) => updateSpecification('material', e.target.value)}
            placeholder="e.g., Sterling Silver, Gold Plated"
          />
        </div>
        
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={specifications.weight || ''}
            onChange={(e) => updateSpecification('weight', e.target.value)}
            placeholder="e.g., 5-8g"
          />
        </div>
        
        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={specifications.dimensions || ''}
            onChange={(e) => updateSpecification('dimensions', e.target.value)}
            placeholder="e.g., 1-1.5 inch pendant"
          />
        </div>
        
        <div>
          <Label htmlFor="finish">Finish</Label>
          <Input
            id="finish"
            value={specifications.finish || ''}
            onChange={(e) => updateSpecification('finish', e.target.value)}
            placeholder="e.g., Polished, Matte, Brushed"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="care_instructions">Care Instructions</Label>
        <Textarea
          id="care_instructions"
          value={specifications.care_instructions || ''}
          onChange={(e) => updateSpecification('care_instructions', e.target.value)}
          placeholder="How to care for this product..."
          rows={3}
        />
      </div>

      {/* Ring Sizes */}
      {category === 'rings' && (
        <div>
          <Label>Available Ring Sizes</Label>
          <div className="mt-2 space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {COMMON_RING_SIZES.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ring-size-${size}`}
                    checked={ringSizes.includes(size)}
                    onCheckedChange={() => toggleRingSize(size)}
                  />
                  <Label htmlFor={`ring-size-${size}`} className="text-sm">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Custom size"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomRingSize(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            
            {ringSizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ringSizes.map((size) => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSize(size, 'ring')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watch Sizes */}
      {category === 'watches' && (
        <div>
          <Label>Available Watch Sizes</Label>
          <div className="mt-2 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {COMMON_WATCH_SIZES.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`watch-size-${size}`}
                    checked={watchSizes.includes(size)}
                    onCheckedChange={() => toggleWatchSize(size)}
                  />
                  <Label htmlFor={`watch-size-${size}`} className="text-sm">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Custom size (e.g., 47mm)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomWatchSize(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            
            {watchSizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchSizes.map((size) => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    {size}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSize(size, 'watch')}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
