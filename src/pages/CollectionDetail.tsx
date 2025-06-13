
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

export function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCustomDesign = () => {
    navigate('/custom-design');
  };

  // Since collections management is removed, show not found state
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
          
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Collection Not Available
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              This collection is not currently available. We're working on bringing you amazing 
              jewelry collections soon.
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
    </div>
  );
}
