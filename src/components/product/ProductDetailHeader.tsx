
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Collection } from '@/types/store';

interface ProductDetailHeaderProps {
  onBackNavigation: () => void;
  collection: Collection | null;
  collectionId?: string;
}

export function ProductDetailHeader({ 
  onBackNavigation, 
  collection, 
  collectionId 
}: ProductDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button variant="ghost" onClick={onBackNavigation}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        {collectionId ? 'Back to Collection Management' : collection ? `Back to ${collection.name}` : 'Back to Products'}
      </Button>

      {collection && (
        <Badge variant="outline" className="text-sm">
          From {collection.name} Collection
        </Badge>
      )}
    </div>
  );
}
