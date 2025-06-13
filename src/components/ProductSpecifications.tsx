
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductSpecificationsProps {
  specs: Record<string, string>;
}

export function ProductSpecifications({ specs }: ProductSpecificationsProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('product.specifications') || 'Specifications'}</h3>
        <div className="space-y-2">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{key}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
