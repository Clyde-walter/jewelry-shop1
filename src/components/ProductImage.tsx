
import React, { useState } from 'react';

interface ProductImageProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductImage({ images, productName, className = "w-full h-full object-cover" }: ProductImageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const validImages = images.filter(img => 
    img && 
    img !== '/placeholder.svg' && 
    (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/'))
  );

  const defaultImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
  const displayImages = validImages.length > 0 ? validImages : [defaultImage];
  const currentImage = displayImages[currentImageIndex] || defaultImage;

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      if (currentImageIndex < displayImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  const handleImageClick = () => {
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      setImageError(false);
    }
  };

  return (
    <div className="relative group">
      <img
        src={currentImage}
        alt={productName}
        className={`${className} ${displayImages.length > 1 ? 'cursor-pointer' : ''}`}
        onClick={handleImageClick}
        onError={handleImageError}
      />
      {displayImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {displayImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
