
import React from 'react';
import { ImageViewer } from '@/components/ImageViewer';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImageIndex: number;
  imageViewerOpen: boolean;
  onImageSelect: (index: number) => void;
  onImageViewerOpen: (index?: number) => void;
  onImageViewerClose: () => void;
  onPreviousImage: () => void;
  onNextImage: () => void;
}

export function ProductImageGallery({
  images,
  productName,
  selectedImageIndex,
  imageViewerOpen,
  onImageSelect,
  onImageViewerOpen,
  onImageViewerClose,
  onPreviousImage,
  onNextImage
}: ProductImageGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onImageViewerOpen(selectedImageIndex)}
      >
        <img
          src={images[selectedImageIndex]}
          alt={productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
          }}
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index 
                  ? 'border-ecommerce-600 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Viewer */}
      <ImageViewer
        images={images}
        currentIndex={selectedImageIndex}
        isOpen={imageViewerOpen}
        onClose={onImageViewerClose}
        onPrevious={onPreviousImage}
        onNext={onNextImage}
      />
    </div>
  );
}
