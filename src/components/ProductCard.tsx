
import React, { useState } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get valid images array
  const getValidImages = () => {
    const images = product.images && Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.image];
    
    return images.filter(img => 
      img && 
      img !== '/placeholder.svg' && 
      (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/'))
    );
  };

  const validImages = getValidImages();
  const currentImage = validImages[currentImageIndex] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop';

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

  const handleImageHover = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={handleProductClick}
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop';
            }
          }}
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
        {/* Image indicator dots */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {validImages.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
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
