
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { ProductQuantitySelector } from './ProductQuantitySelector';

interface ProductDetailInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  productDetail: {
    originalPrice?: number;
    inStock: boolean;
    rating: number;
    reviews: number;
  };
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
  onBuyNow: () => void;
  isInWishlist: boolean;
}

export function ProductDetailInfo({
  product,
  productDetail,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWishlistToggle,
  onBuyNow,
  isInWishlist
}: ProductDetailInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(productDetail.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({productDetail.reviews} reviews)</span>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl font-bold text-ecommerce-600">${product.price.toLocaleString()}</span>
          {productDetail.originalPrice && (
            <span className="text-xl text-gray-500 line-through">${productDetail.originalPrice.toLocaleString()}</span>
          )}
          {productDetail.inStock ? (
            <Badge className="bg-green-100 text-green-800">In Stock</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
          )}
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      <div className="space-y-4">
        <ProductQuantitySelector 
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />

        <div className="flex space-x-4">
          <Button 
            className="flex-1 bg-ecommerce-600 hover:bg-ecommerce-700"
            onClick={onAddToCart}
            disabled={!productDetail.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={`${
              isInWishlist 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-500 hover:text-red-500'
            }`}
            onClick={onWishlistToggle}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={onBuyNow}
          disabled={!productDetail.inStock}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
