
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/store';
import { useProductsApi } from '@/hooks/useProductsApi';
import { useProductMutations } from '@/hooks/useProductMutations';

interface ProductsContextType {
  products: Product[];
  featuredProducts: Product[];
  mostPickedProducts: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchMostPickedProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (product: Omit<Product, 'id'> & { specifications?: Record<string, any>; ringSizes?: string[]; watchSizes?: string[] }) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product> & { specifications?: Record<string, any>; ringSizes?: string[]; watchSizes?: string[] }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateFeaturedProducts: (productIds: string[]) => Promise<void>;
  updateMostPickedProducts: (productIds: string[]) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [mostPickedProducts, setMostPickedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const api = useProductsApi();
  const mutations = useProductMutations();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await api.fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const fetchedProducts = await api.fetchFeaturedProducts();
      setFeaturedProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchMostPickedProducts = async () => {
    try {
      const fetchedProducts = await api.fetchMostPickedProducts();
      setMostPickedProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching most picked products:', error);
    }
  };

  const createProduct = async (product: Omit<Product, 'id'> & { specifications?: Record<string, any>; ringSizes?: string[]; watchSizes?: string[] }) => {
    await mutations.createProduct(product);
    await fetchProducts();
  };

  const updateProduct = async (id: string, product: Partial<Product> & { specifications?: Record<string, any>; ringSizes?: string[]; watchSizes?: string[] }) => {
    await mutations.updateProduct(id, product);
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await mutations.deleteProduct(id);
    await fetchProducts();
  };

  const updateFeaturedProducts = async (productIds: string[]) => {
    await mutations.updateFeaturedProducts(productIds);
    await fetchProducts();
    await fetchFeaturedProducts();
  };

  const updateMostPickedProducts = async (productIds: string[]) => {
    await mutations.updateMostPickedProducts(productIds);
    await fetchProducts();
    await fetchMostPickedProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
    fetchMostPickedProducts();
  }, []);

  const value = {
    products,
    featuredProducts,
    mostPickedProducts,
    loading,
    fetchProducts,
    fetchFeaturedProducts,
    fetchMostPickedProducts,
    fetchProductById: api.fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFeaturedProducts,
    updateMostPickedProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
