
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Collection } from '@/types/store';
import { useProducts } from '@/contexts/ProductsContext';
import { useCollections } from '@/contexts/CollectionsContext';
import { useStore } from '@/contexts/StoreContext';

export function useProductDetail(id?: string, collectionId?: string) {
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
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
        
        // Auto-select first available size if only one option
        if (productData) {
          const availableSizes = productData.category === 'rings' 
            ? productData.ringSizes 
            : productData.watchSizes;
          if (availableSizes && availableSizes.length === 1) {
            setSelectedSize(availableSizes[0]);
          }
        }
        
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

  const getDisplayImages = () => {
    if (!product) return [];
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images?.length) images.push(...product.images);
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'];
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

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if size selection is required
    const requiresSize = (product.category === 'rings' && product.ringSizes && product.ringSizes.length > 0) ||
                        (product.category === 'watches' && product.watchSizes && product.watchSizes.length > 0);
    
    if (requiresSize && !selectedSize) {
      alert(`Please select a ${product.category === 'rings' ? 'ring' : 'watch'} size before adding to cart.`);
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
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

  return {
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
  };
}
