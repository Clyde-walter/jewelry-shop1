
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, ArrowLeft, Filter, SortAsc } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';

export function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [filterBy, setFilterBy] = useState('all');
  const { collections, products, addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  // Find the collection by ID
  const collection = collections.find(c => c.id === id);
  
  // Get products that belong to this specific collection
  const collectionProducts = products.filter(product => product.collectionId === id);

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
        <Button onClick={() => navigate('/collections')}>Back to Collections</Button>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (product: any) => {
    const wishlistItem = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    };

    if (isInWishlist(product.id.toString())) {
      removeFromWishlist(product.id.toString());
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

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Sort products
  const sortedProducts = [...collectionProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Filter products
  const filteredProducts = sortedProducts.filter(product => {
    if (filterBy === 'in-stock') return product.stock > 0;
    if (filterBy === 'out-of-stock') return product.stock === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/collections')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {collection.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {collection.description}
            </p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <select 
              className="px-3 py-2 border rounded-md"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
            <select 
              className="px-3 py-2 border rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const validImages = product.images?.filter(img => 
              img && 
              img !== '/placeholder.svg' && 
              (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/'))
            ) || [product.image];

            return (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <div className="h-64">
                    <ProductImageCarousel 
                      images={validImages.length > 0 ? validImages : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop']}
                      productName={product.name}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 ${
                      isInWishlist(product.id.toString()) 
                        ? 'text-red-500 bg-white' 
                        : 'bg-white/80 hover:bg-white'
                    }`}
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? 'fill-current' : ''}`} />
                  </Button>
                  {product.stock === 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 
                    className="text-lg font-semibold mb-2 cursor-pointer hover:text-ecommerce-600 transition-colors" 
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-ecommerce-600 mb-4">
                    ${product.price.toLocaleString()}
                  </p>
                  <Button 
                    className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
                    disabled={product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-gray-600">This collection doesn't have any products yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
