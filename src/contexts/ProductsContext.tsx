import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/store';
import { toast } from '@/hooks/use-toast';

interface ProductsContextType {
  products: Product[];
  featuredProducts: Product[];
  mostPickedProducts: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchMostPickedProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image || '',
        images: product.images || [],
        description: product.description || '',
        category: product.category,
        stock: product.stock || 0,
        collectionId: product.collection_id,
        isFeatured: product.is_featured || false,
        isMostPicked: product.is_most_picked || false,
        featuredOrder: product.featured_order || 0,
        mostPickedOrder: product.most_picked_order || 0
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('featured_order', { ascending: true });

      if (error) throw error;

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image || '',
        images: product.images || [],
        description: product.description || '',
        category: product.category,
        stock: product.stock || 0,
        collectionId: product.collection_id,
        isFeatured: product.is_featured || false,
        isMostPicked: product.is_most_picked || false,
        featuredOrder: product.featured_order || 0,
        mostPickedOrder: product.most_picked_order || 0
      }));

      setFeaturedProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchMostPickedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_most_picked', true)
        .order('most_picked_order', { ascending: true });

      if (error) throw error;

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image || '',
        images: product.images || [],
        description: product.description || '',
        category: product.category,
        stock: product.stock || 0,
        collectionId: product.collection_id,
        isFeatured: product.is_featured || false,
        isMostPicked: product.is_most_picked || false,
        featuredOrder: product.featured_order || 0,
        mostPickedOrder: product.most_picked_order || 0
      }));

      setMostPickedProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching most picked products:', error);
    }
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        image: data.image || '',
        images: data.images || [],
        description: data.description || '',
        category: data.category,
        stock: data.stock || 0,
        collectionId: data.collection_id,
        isFeatured: data.is_featured || false,
        isMostPicked: data.is_most_picked || false,
        featuredOrder: data.featured_order || 0,
        mostPickedOrder: data.most_picked_order || 0
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { error } = await supabase.from('products').insert({
        name: product.name,
        price: product.price,
        image: product.image,
        images: product.images,
        description: product.description,
        category: product.category,
        stock: product.stock,
        collection_id: product.collectionId,
        is_featured: product.isFeatured || false,
        is_most_picked: product.isMostPicked || false,
        featured_order: product.featuredOrder || 0,
        most_picked_order: product.mostPickedOrder || 0
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully"
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          image: product.image,
          images: product.images,
          description: product.description,
          category: product.category,
          stock: product.stock,
          collection_id: product.collectionId,
          is_featured: product.isFeatured,
          is_most_picked: product.isMostPicked,
          featured_order: product.featuredOrder,
          most_picked_order: product.mostPickedOrder
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully"
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully"
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const updateFeaturedProducts = async (productIds: string[]) => {
    try {
      // First, remove all featured flags
      await supabase
        .from('products')
        .update({ is_featured: false, featured_order: 0 })
        .eq('is_featured', true);

      // Then set the new featured products with their order
      for (let i = 0; i < productIds.length; i++) {
        await supabase
          .from('products')
          .update({ is_featured: true, featured_order: i + 1 })
          .eq('id', productIds[i]);
      }

      toast({
        title: "Success",
        description: "Featured products updated successfully"
      });

      await fetchProducts();
      await fetchFeaturedProducts();
    } catch (error) {
      console.error('Error updating featured products:', error);
      toast({
        title: "Error",
        description: "Failed to update featured products",
        variant: "destructive"
      });
    }
  };

  const updateMostPickedProducts = async (productIds: string[]) => {
    try {
      // First, remove all most picked flags
      await supabase
        .from('products')
        .update({ is_most_picked: false, most_picked_order: 0 })
        .eq('is_most_picked', true);

      // Then set the new most picked products with their order
      for (let i = 0; i < productIds.length; i++) {
        await supabase
          .from('products')
          .update({ is_most_picked: true, most_picked_order: i + 1 })
          .eq('id', productIds[i]);
      }

      toast({
        title: "Success",
        description: "Most picked products updated successfully"
      });

      await fetchProducts();
      await fetchMostPickedProducts();
    } catch (error) {
      console.error('Error updating most picked products:', error);
      toast({
        title: "Error",
        description: "Failed to update most picked products",
        variant: "destructive"
      });
    }
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
    fetchProductById,
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
