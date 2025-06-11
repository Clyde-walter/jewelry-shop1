
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Package } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';

export function Collections() {
  const navigate = useNavigate();
  const { collections } = useStore();

  const handleExploreCollection = (collectionId: string) => {
    navigate(`/collection/${collectionId}`);
  };

  const handleCustomDesign = () => {
    navigate('/custom-design');
  };

  // Show empty state if no collections
  if (collections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Jewelry Collections
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collections of exquisite jewelry, each piece carefully selected 
              to bring elegance and sophistication to your style
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Collections Coming Soon
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We're currently curating amazing jewelry collections for you. 
              Check back soon or contact us for custom designs.
            </p>
            <Button 
              className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg"
              onClick={handleCustomDesign}
            >
              Request Custom Design
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Jewelry Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collections of exquisite jewelry, each piece carefully selected 
            to bring elegance and sophistication to your style
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => {
            const validImages = collection.images?.filter(img => 
              img && 
              img !== '/placeholder.svg' && 
              (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/'))
            ) || [];

            return (
              <Card key={collection.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-lg">
                <div className="relative overflow-hidden">
                  <div className="h-64">
                    <ProductImageCarousel 
                      images={validImages.length > 0 ? validImages : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop']}
                      productName={collection.name}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-ecommerce-600 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {collection.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {collection.productCount} pieces
                      </span>
                      <span className={`font-medium ${collection.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                        {collection.status}
                      </span>
                    </div>
                    
                    {collection.productCount === 0 ? (
                      <div className="text-center py-4">
                        <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Coming Soon</p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-ecommerce-600 hover:bg-ecommerce-700 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300"
                        onClick={() => handleExploreCollection(collection.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Explore Collection
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our expert jewelers can create custom pieces tailored to your unique style and preferences. 
            Contact us to discuss your vision.
          </p>
          <Button 
            className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg"
            onClick={handleCustomDesign}
          >
            Request Custom Design
          </Button>
        </div>
      </div>
    </div>
  );
}
