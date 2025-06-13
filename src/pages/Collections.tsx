
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Package, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Collections() {
  const navigate = useNavigate();

  const handleCustomDesign = () => {
    navigate('/custom-design');
  };

  // Since collections management is removed, show empty state
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
