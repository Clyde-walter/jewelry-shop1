
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { Product, Collection } from '@/types/store';

interface ProductSpecificationsProps {
  product: Product;
  collection?: Collection | null;
}

export function ProductSpecifications({ product, collection }: ProductSpecificationsProps) {
  const productWithSpecs = product as Product & {
    specifications?: Record<string, any>;
    ringSizes?: string[];
    watchSizes?: string[];
  };

  const getProductMaterial = (category: string) => {
    const materials = {
      rings: 'Sterling Silver / Gold Plated',
      necklaces: 'Sterling Silver Chain',
      earrings: 'Hypoallergenic Metal',
      bracelets: 'Stainless Steel',
      watches: 'Stainless Steel Case',
      pendants: 'Sterling Silver'
    };
    return materials[category as keyof typeof materials] || 'Premium Metal';
  };

  const getProductWeight = (category: string) => {
    const weights = {
      rings: '3-5g',
      necklaces: '8-12g',
      earrings: '2-4g',
      bracelets: '15-25g',
      watches: '45-65g',
      pendants: '5-8g'
    };
    return weights[category as keyof typeof weights] || '5-10g';
  };

  const getProductDimensions = (category: string) => {
    const dimensions = {
      rings: 'Size 6-10 available',
      necklaces: '16-20 inch length',
      earrings: '1-2 inch drop',
      bracelets: '7-8 inch circumference',
      watches: '40-42mm case diameter',
      pendants: '1-1.5 inch pendant'
    };
    return dimensions[category as keyof typeof dimensions] || 'Standard size';
  };

  const getProductFinish = (category: string) => {
    const finishes = {
      rings: 'Polished / Matte options',
      necklaces: 'High polish finish',
      earrings: 'Mirror polish',
      bracelets: 'Brushed steel finish',
      watches: 'Polished case',
      pendants: 'Satin finish'
    };
    return finishes[category as keyof typeof finishes] || 'Premium finish';
  };

  const specifications = [
    { label: 'Brand', value: 'Jewelry Port' },
    { 
      label: 'Material', 
      value: productWithSpecs.specifications?.material || getProductMaterial(product.category) 
    },
    { label: 'Gender', value: 'Unisex' },
    { label: 'Category', value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
    { label: 'Stock Status', value: product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK' },
    { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
    { 
      label: 'Weight', 
      value: productWithSpecs.specifications?.weight || getProductWeight(product.category) 
    },
    { 
      label: 'Dimensions', 
      value: productWithSpecs.specifications?.dimensions || getProductDimensions(product.category) 
    },
    { 
      label: 'Finish', 
      value: productWithSpecs.specifications?.finish || getProductFinish(product.category) 
    },
    { 
      label: 'Care Instructions', 
      value: productWithSpecs.specifications?.care_instructions || 'Clean with soft cloth' 
    },
    { label: 'Warranty', value: 'Lifetime warranty included' },
    { label: 'Country of Origin', value: 'Handcrafted' }
  ];

  if (collection) {
    specifications.splice(4, 0, { label: 'Collection', value: collection.name });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2 text-ecommerce-600" />
          Product Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description || `This exquisite ${product.category.slice(0, -1)} features premium craftsmanship and attention to detail. Each piece is carefully designed to complement your style and make a lasting impression.`}
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 font-medium">{spec.label}</span>
                <span className={`font-medium ${
                  spec.label === 'Stock Status' 
                    ? product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    : 'text-gray-900'
                }`}>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Available Sizes */}
          {product.category === 'rings' && productWithSpecs.ringSizes && productWithSpecs.ringSizes.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Available Ring Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {productWithSpecs.ringSizes.map((size) => (
                  <Badge key={size} variant="outline" className="text-sm">
                    Size {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.category === 'watches' && productWithSpecs.watchSizes && productWithSpecs.watchSizes.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Available Watch Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {productWithSpecs.watchSizes.map((size) => (
                  <Badge key={size} variant="outline" className="text-sm">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
