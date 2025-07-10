
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Product } from '@/types/store';
import { ProductSizeSelector } from './ProductSizeSelector';

interface ProductActionsProps {
  product: Product;
  quantity: number;
  selectedSize: string;
  requiresSizeSelection: boolean;
  isInWishlist: (productId: string) => boolean;
  onQuantityChange: (newQuantity: number) => void;
  onSizeSelect: (size: string) => void;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
}

export function ProductActions({
  product,
  quantity,
  selectedSize,
  requiresSizeSelection,
  isInWishlist,
  onQuantityChange,
  onSizeSelect,
  onAddToCart,
  onAddToWishlist
}: ProductActionsProps) {
  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {requiresSizeSelection && (
        <ProductSizeSelector
          category={product.category}
          ringSizes={product.ringSizes}
          watchSizes={product.watchSizes}
          selectedSize={selectedSize}
          onSizeSelect={onSizeSelect}
        />
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button 
          className="w-full bg-ecommerce-600 hover:bg-ecommerce-700" 
          size="lg"
          onClick={onAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart ({quantity})
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          onClick={onAddToWishlist}
        >
          <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
          {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>

      {/* Size requirement notice */}
      {requiresSizeSelection && !selectedSize && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please select a {product.category === 'rings' ? 'ring' : 'watch'} size before adding to cart.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
