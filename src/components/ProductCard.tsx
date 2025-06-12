
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/store';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={handleProductClick}
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 ${
            isInWishlist(product.id) 
              ? 'text-red-500 bg-white' 
              : 'text-gray-500 hover:text-red-500 bg-white/80 backdrop-blur-sm'
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </Button>
        {product.stock <= 5 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Only {product.stock} left!
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 
              className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-ecommerce-600 transition-colors"
              onClick={handleProductClick}
            >
              {product.name}
            </h3>
            <span className="text-ecommerce-600 font-bold text-lg">${product.price}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-gray-500">
              {product.stock} in stock
            </span>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-ecommerce-600 hover:bg-ecommerce-700 text-white group"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce-subtle" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
