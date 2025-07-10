
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Product, Collection } from '@/types/store';

interface ProductInfoProps {
  product: Product;
  collection?: Collection | null;
}

export function ProductInfo({ product, collection }: ProductInfoProps) {
  // Helper function to format description into paragraphs
  const formatDescription = (description: string) => {
    if (!description) return null;
    
    // Split by double line breaks for paragraphs, or single line breaks if no double breaks exist
    const paragraphs = description.includes('\n\n') 
      ? description.split('\n\n').filter(p => p.trim())
      : description.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-600 leading-relaxed mb-3 last:mb-0">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-3xl font-semibold text-ecommerce-600">${Number(product.price).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant="secondary" className="text-sm capitalize">
          {product.category}
        </Badge>
        <span className={`text-sm font-medium ${
          product.stock > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
        {collection && (
          <Badge variant="outline" className="text-xs">
            {collection.name} Collection
          </Badge>
        )}
      </div>

      {/* Enhanced Description with paragraph support */}
      {product.description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <div className="prose prose-sm max-w-none">
            {formatDescription(product.description)}
          </div>
        </div>
      )}
    </div>
  );
}
