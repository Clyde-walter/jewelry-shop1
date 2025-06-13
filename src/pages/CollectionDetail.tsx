
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCollections } from '@/contexts/CollectionsContext';
import { useStore } from '@/contexts/StoreContext';
import { ImageViewer } from '@/components/ImageViewer';
import { Product } from '@/types/store';

export function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCollectionById, getCollectionProducts } = useCollections();
  const { addToCart, addToWishlist, isInWishlist } = useStore();
  
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewingImages, setViewingImages] = useState<string[]>([]);

  useEffect(() => {
    const loadCollectionData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      // Get collection info
      const collectionData = getCollectionById(id);
      setCollection(collectionData);
      
      // Get collection products
      const collectionProducts = await getCollectionProducts(id);
      setProducts(collectionProducts);
      
      setLoading(false);
    };

    loadCollectionData();
  }, [id, getCollectionById, getCollectionProducts]);

  const handleCustomDesign = () => {
    navigate('/custom-design');
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}/${id}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleToggleWishlist = (product: Product) => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      description: product.description
    };
    addToWishlist(wishlistItem);
  };

  const openImageViewer = (images: string[], startIndex: number = 0) => {
    setViewingImages(images);
    setCurrentImageIndex(startIndex);
    setImageViewerOpen(true);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? viewingImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === viewingImages.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
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
              Collection Not Found
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The collection you're looking for doesn't exist or has been removed.
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
          
          <div className="text-center mb-8">
            <Badge className="mb-4 capitalize text-lg px-4 py-2">
              {collection.category}
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {collection.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {collection.description}
            </p>
          </div>
        </div>

        {/* Collection Images */}
        {collection.images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Collection Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {collection.images.slice(0, 5).map((image, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openImageViewer(collection.images, index)}
                >
                  <img
                    src={image}
                    alt={`${collection.name} ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {products.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Collection Products ({products.length} items)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    {/* Product Images */}
                    <div className="grid grid-cols-5 gap-1 h-48">
                      {/* Main image */}
                      <div 
                        className="col-span-3 cursor-pointer group"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      
                      {/* Additional images */}
                      <div className="col-span-2 grid grid-rows-4 gap-1">
                        {(product.images || []).slice(0, 4).map((image, imageIndex) => (
                          <div 
                            key={imageIndex}
                            className="cursor-pointer group overflow-hidden"
                            onClick={() => {
                              const allImages = [product.image, ...(product.images || [])].filter(Boolean);
                              openImageViewer(allImages, imageIndex + 1);
                            }}
                          >
                            <img
                              src={image}
                              alt={`${product.name} ${imageIndex + 2}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        ))}
                        {/* Show "+X more" if there are more images */}
                        {(product.images || []).length > 4 && (
                          <div 
                            className="bg-black/70 flex items-center justify-center text-white text-xs cursor-pointer hover:bg-black/80 transition-colors"
                            onClick={() => {
                              const allImages = [product.image, ...(product.images || [])].filter(Boolean);
                              openImageViewer(allImages, 5);
                            }}
                          >
                            +{(product.images || []).length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-ecommerce-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 bg-ecommerce-600 hover:bg-ecommerce-700"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleToggleWishlist(product)}
                        className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products in this collection</h3>
            <p className="text-gray-500 mb-6">
              Products will be added to this collection soon.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Looking for Something Unique?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our expert jewelers can create custom pieces inspired by this collection or completely new designs tailored to your preferences.
          </p>
          <Button 
            className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg"
            onClick={handleCustomDesign}
          >
            Request Custom Design
          </Button>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        images={viewingImages}
        currentIndex={currentImageIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
    </div>
  );
}
