
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowRight } from 'lucide-react';
import { useCollections } from '@/contexts/CollectionsContext';

export function Collections() {
  const navigate = useNavigate();
  const { collections, loading } = useCollections();

  const handleCustomDesign = () => {
    navigate('/custom-design');
  };

  const handleViewCollection = (id: string) => {
    navigate(`/collection/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading collections...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {collections.length > 0 ? (
          <>
            {/* Featured Collections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {collections
                .filter(collection => collection.status === 'Active')
                .map((collection, index) => (
                <Card key={collection.id} className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-105">
                  <div className="relative">
                    {collection.images.length > 0 ? (
                      <img
                        src={collection.images[0]}
                        alt={collection.name}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge 
                      className="absolute top-4 right-4 bg-white/90 text-gray-800 hover:bg-white capitalize"
                    >
                      {collection.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-ecommerce-600 transition-colors duration-300">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-500">
                        {collection.productCount} piece{collection.productCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm text-gray-500">
                        {collection.images.length} image{collection.images.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-ecommerce-600 hover:bg-ecommerce-700 text-white group hover:scale-105 transition-all duration-300"
                      onClick={() => handleViewCollection(collection.id)}
                    >
                      Explore Collection
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
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
              className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
              onClick={handleCustomDesign}
            >
              Request Custom Design
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-white rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our expert jewelers can create custom pieces tailored to your unique style and preferences. 
            Contact us to discuss your vision.
          </p>
          <Button 
            className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
            onClick={handleCustomDesign}
          >
            Request Custom Design
          </Button>
        </div>
      </div>
    </div>
  );
}
