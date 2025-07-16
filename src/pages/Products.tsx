
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Search, ShoppingCart, Heart } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useStore } from '@/contexts/StoreContext';

export function Products() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart, addToWishlist, isInWishlist } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Intersection Observer for scroll animations
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    });

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const categories = ['all', 'rings', 'necklaces', 'earrings', 'bracelets', 'watches', 'pendants'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCustomDesign = () => {
    navigate('/custom-design');
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-shimmer"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-shimmer"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg animate-shimmer" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-stagger-1">
            Explore our exquisite collection of handcrafted jewelry pieces
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up animate-stagger-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-pulse-soft" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 hover:scale-105 transition-transform duration-300 focus:scale-105"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 hover:scale-105 transition-transform duration-300">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 fade-in-section">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className={`overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer group hover-lift hover-glow animate-scale-in animate-stagger-${(index % 4) + 1}`}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1 group-hover:text-ecommerce-600 transition-colors duration-300">{product.name}</h3>
                      <Badge variant="secondary" className="ml-2 text-xs animate-fade-in">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-ecommerce-600 animate-glow">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'} animate-pulse-soft`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-ecommerce-600 hover:bg-ecommerce-700 hover:scale-105 transition-all duration-300 btn-sparkle"
                        size="sm"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1 animate-bounce-subtle" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleAddToWishlist(e, product)}
                        className={`hover:scale-110 transition-all duration-300 ${isInWishlist(product.id) ? 'text-red-500 border-red-300 animate-heartbeat' : ''}`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6 animate-float" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm || categoryFilter !== 'all' ? 'No products found' : 'Products Coming Soon'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'We\'re currently adding our beautiful jewelry pieces to the catalog. Check back soon or contact us for custom designs.'
              }
            </p>
            <Button 
              className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300 btn-sparkle"
              onClick={handleCustomDesign}
            >
              Request Custom Design
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-2xl p-12 shadow-lg fade-in-section hover-lift">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-down">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animate-stagger-1">
            Our expert jewelers can create custom pieces tailored to your unique style and preferences. 
            Contact us to discuss your vision.
          </p>
          <Button 
            className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300 btn-sparkle animate-bounce-gentle"
            onClick={handleCustomDesign}
          >
            Request Custom Design
          </Button>
        </div>
      </div>
    </div>
  );
}
