
import React from 'react';
import { useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductSpecifications } from '@/components/product/ProductSpecifications';
import { ProductServiceInfo } from '@/components/product/ProductServiceInfo';
import { ProductDetailHeader } from '@/components/product/ProductDetailHeader';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductActions } from '@/components/product/ProductActions';
import { useProductDetail } from '@/hooks/useProductDetail';

export function ProductDetail() {
  const { id, collectionId } = useParams<{ id: string; collectionId?: string }>();
  
  const {
    product,
    collection,
    loading,
    selectedImageIndex,
    quantity,
    imageViewerOpen,
    selectedSize,
    handleBackNavigation,
    getDisplayImages,
    handlePreviousImage,
    handleNextImage,
    handleAddToCart,
    handleAddToWishlist,
    setSelectedImageIndex,
    setQuantity,
    setImageViewerOpen,
    setSelectedSize,
    isInWishlist
  } = useProductDetail(id, collectionId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ProductDetailHeader 
          onBackNavigation={handleBackNavigation}
          collection={collection}
          collectionId={collectionId}
        />
        <div className="text-center py-16">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const displayImages = getDisplayImages();
  const requiresSizeSelection = product && (
    (product.category === 'rings' && product.ringSizes && product.ringSizes.length > 0) ||
    (product.category === 'watches' && product.watchSizes && product.watchSizes.length > 0)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <ProductDetailHeader 
        onBackNavigation={handleBackNavigation}
        collection={collection}
        collectionId={collectionId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <ProductImageGallery
          images={displayImages}
          productName={product.name}
          selectedImageIndex={selectedImageIndex}
          imageViewerOpen={imageViewerOpen}
          onImageSelect={setSelectedImageIndex}
          onImageViewerOpen={(index = 0) => {
            setSelectedImageIndex(index);
            setImageViewerOpen(true);
          }}
          onImageViewerClose={() => setImageViewerOpen(false)}
          onPreviousImage={handlePreviousImage}
          onNextImage={handleNextImage}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <ProductInfo product={product} collection={collection} />
          
          <ProductActions
            product={product}
            quantity={quantity}
            selectedSize={selectedSize}
            requiresSizeSelection={requiresSizeSelection}
            isInWishlist={isInWishlist}
            onQuantityChange={setQuantity}
            onSizeSelect={setSelectedSize}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </div>

      {/* Detailed Product Specifications and Service Information */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductSpecifications product={product} collection={collection} />
        <ProductServiceInfo />
      </div>
    </div>
  );
}
