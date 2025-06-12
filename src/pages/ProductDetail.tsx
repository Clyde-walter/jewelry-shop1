
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';

// Collection products data structure
const collectionProductsData = {
  // Diamond Elegance Collection
  '101': {
    name: 'Diamond Solitaire Ring',
    price: 3500,
    originalPrice: 4200,
    description: 'A stunning solitaire diamond ring featuring a brilliant cut 1.5 carat diamond set in 18k white gold. This timeless piece represents eternal love and commitment.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    ],
    inStock: true,
    stock: 10,
    rating: 4.8,
    reviews: 124,
    specs: { 'Diamond Carat': '1.5', 'Metal': '18k White Gold', 'Diamond Cut': 'Brilliant', 'Setting': 'Prong' },
    category: 'Diamond Elegance',
    collectionId: '1'
  },
  '102': {
    name: 'Diamond Tennis Bracelet',
    price: 8500,
    originalPrice: 9200,
    description: 'Elegant tennis bracelet featuring 50 brilliant cut diamonds totaling 5 carats in 18k white gold setting.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    ],
    inStock: true,
    stock: 8,
    rating: 4.9,
    reviews: 87,
    specs: { 'Total Carats': '5.0', 'Metal': '18k White Gold', 'Diamond Count': '50', 'Length': '7 inches' },
    category: 'Diamond Elegance',
    collectionId: '1'
  },
  // Add more collection products here...
  '201': {
    name: 'Gold Chain Necklace',
    price: 1200,
    originalPrice: 1400,
    description: 'Classic 18k yellow gold chain necklace with timeless rope design, perfect for any occasion.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
    ],
    inStock: true,
    stock: 15,
    rating: 4.6,
    reviews: 89,
    specs: { 'Metal': '18k Yellow Gold', 'Length': '20 inches', 'Width': '4mm', 'Clasp': 'Lobster' },
    category: 'Golden Heritage',
    collectionId: '2'
  }
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { products, addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  // Check if it's a regular product first
  const regularProduct = products.find(p => p.id === id);
  
  // If not found in regular products, check collection products
  const collectionProduct = collectionProductsData[id as keyof typeof collectionProductsData];
  
  // Create unified product object
  const product = regularProduct || (collectionProduct ? {
    id: id!,
    name: collectionProduct.name,
    price: collectionProduct.price,
    image: collectionProduct.images[0],
    description: collectionProduct.description,
    category: collectionProduct.category,
    stock: collectionProduct.stock,
    images: collectionProduct.images
  } : null);

  // Ensure we have proper images array for display
  const getProductImages = () => {
    if (collectionProduct) {
      return collectionProduct.images;
    }
    
    if (regularProduct) {
      // Check if product has images array
      if (regularProduct.images && Array.isArray(regularProduct.images) && regularProduct.images.length > 0) {
        return regularProduct.images;
      }
      // Fall back to single image if available
      if (regularProduct.image && regularProduct.image !== '/placeholder.svg') {
        return [regularProduct.image];
      }
    }
    
    // Default fallback image
    return ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'];
  };

  const productDetail = collectionProduct || {
    name: regularProduct?.name || '',
    price: regularProduct?.price || 0,
    originalPrice: undefined,
    description: regularProduct?.description || '',
    images: getProductImages(),
    inStock: (regularProduct?.stock || 0) > 0,
    stock: regularProduct?.stock || 0,
    rating: 4.5,
    reviews: 50,
    specs: {
      'Category': regularProduct?.category || 'General',
      'Stock': `${regularProduct?.stock || 0} units`,
      'Price': `$${regularProduct?.price || 0}`
    },
    category: regularProduct?.category || 'General',
    collectionId: regularProduct?.collectionId || undefined
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

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

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleBackClick = () => {
    if (productDetail.collectionId) {
      navigate(`/collection/${productDetail.collectionId}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={handleBackClick}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {productDetail.collectionId ? 'Back to Collection' : 'Back to Products'}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images with Carousel */}
        <div className="space-y-4">
          <ProductImageCarousel 
            images={productDetail.images} 
            productName={product.name} 
          />
        </div>

        {/* Product Info */}
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

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                className="flex-1 bg-ecommerce-600 hover:bg-ecommerce-700"
                onClick={handleAddToCart}
                disabled={!productDetail.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className={`${
                  isInWishlist(product.id) 
                    ? 'text-red-500 border-red-500' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleBuyNow}
              disabled={!productDetail.inStock}
            >
              Buy Now
            </Button>
          </div>

          {/* Product Specifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(productDetail.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Features */}
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
        </div>
      </div>
    </div>
  );
}
