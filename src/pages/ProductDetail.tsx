import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus, Package, Shield, Truck, RefreshCcw } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCollections } from '@/contexts/CollectionsContext';
import { useStore } from '@/contexts/StoreContext';
import { Product, Collection } from '@/types/store';
import { ImageViewer } from '@/components/ImageViewer';

export function ProductDetail() {
  const { id, collectionId } = useParams<{ id: string; collectionId?: string }>();
  const navigate = useNavigate();
  const { fetchProductById } = useProducts();
  const { getCollectionById } = useCollections();
  const { addToCart, addToWishlist, isInWishlist } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
        
        // If we have a collectionId from URL or product has collectionId, load collection data
        const targetCollectionId = collectionId || productData?.collectionId;
        if (targetCollectionId) {
          const collectionData = getCollectionById(targetCollectionId);
          setCollection(collectionData);
        }
        
        setLoading(false);
      }
    };

    loadProductData();
  }, [id, collectionId, fetchProductById, getCollectionById]);

  const handleBackNavigation = () => {
    if (collectionId) {
      navigate(`/admin/collections/${collectionId}/products`);
    } else if (collection) {
      navigate(`/collection/${collection.id}`);
    } else {
      navigate('/products');
    }
  };

  const openImageViewer = (startIndex: number = 0) => {
    setSelectedImageIndex(startIndex);
    setImageViewerOpen(true);
  };

  const handlePreviousImage = () => {
    const images = getDisplayImages();
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    const images = getDisplayImages();
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const getDisplayImages = () => {
    if (!product) return [];
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images?.length) images.push(...product.images);
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'];
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      description: product.description
    });
  };

  const getProductSpecifications = (product: Product) => {
    const specs = [
      { label: 'Brand', value: 'Jewelry Port' },
      { label: 'Material', value: getProductMaterial(product.category) },
      { label: 'Gender', value: 'Unisex' },
      { label: 'Category', value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
      { label: 'Stock Status', value: product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK' },
      { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
      { label: 'Weight', value: getProductWeight(product.category) },
      { label: 'Dimensions', value: getProductDimensions(product.category) },
      { label: 'Finish', value: getProductFinish(product.category) },
      { label: 'Care Instructions', value: 'Clean with soft cloth' },
      { label: 'Warranty', value: 'Lifetime warranty included' },
      { label: 'Country of Origin', value: 'Handcrafted' }
    ];

    if (collection) {
      specs.splice(4, 0, { label: 'Collection', value: collection.name });
    }

    return specs;
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
        <Button onClick={handleBackNavigation} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
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
  const specifications = getProductSpecifications(product);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={handleBackNavigation}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {collectionId ? 'Back to Collection Management' : collection ? `Back to ${collection.name}` : 'Back to Products'}
        </Button>

        {collection && (
          <Badge variant="outline" className="text-sm">
            From {collection.name} Collection
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div 
            className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openImageViewer(selectedImageIndex)}
          >
            <img
              src={displayImages[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
              }}
            />
          </div>

          {/* Thumbnail Images */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {displayImages.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-ecommerce-600 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
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

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              className="w-full bg-ecommerce-600 hover:bg-ecommerce-700" 
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart ({quantity})
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleAddToWishlist}
            >
              <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
              {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Product Specifications */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2 text-ecommerce-600" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Free Standard Shipping</p>
                    <p className="text-gray-600">On orders over $100. Delivery in 5-7 business days.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Express Shipping Available</p>
                    <p className="text-gray-600">2-3 business days delivery for urgent orders.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">International Shipping</p>
                    <p className="text-gray-600">Worldwide delivery available with tracking.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCcw className="w-5 h-5 mr-2 text-ecommerce-600" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">30-Day Return Window</p>
                    <p className="text-gray-600">Return or exchange within 30 days of purchase.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Free Return Shipping</p>
                    <p className="text-gray-600">We cover return shipping costs for eligible items.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Money-Back Guarantee</p>
                    <p className="text-gray-600">Full refund if you're not completely satisfied.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-ecommerce-600" />
                Warranty & Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Lifetime Warranty</p>
                    <p className="text-gray-600">Coverage against manufacturing defects.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Professional Cleaning</p>
                    <p className="text-gray-600">Complimentary cleaning service available.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Repair Services</p>
                    <p className="text-gray-600">Expert repair and maintenance services.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        images={displayImages}
        currentIndex={selectedImageIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
    </div>
  );
}
