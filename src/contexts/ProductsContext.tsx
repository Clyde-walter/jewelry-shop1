
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/store';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        return;
      }

      const formattedProducts: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        images: Array.isArray(item.images) ? item.images : [item.image],
        stock: item.stock || 0,
        collectionId: item.collection_id
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const handleProductsUpdated = () => {
      console.log('Products updated event received, refetching...');
      fetchProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          image: productData.image,
          images: productData.images,
          stock: productData.stock,
          collection_id: productData.collectionId
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding product",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchProducts();
      
      toast({
        title: "Product added successfully!",
        description: `${productData.name} has been created.`
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          image: productData.image,
          images: productData.images,
          stock: productData.stock,
          collection_id: productData.collectionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating product",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchProducts();
      
      toast({
        title: "Product updated successfully!",
        description: "Your product has been updated."
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting product",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchProducts();
      
      toast({
        title: "Product deleted successfully!",
        description: "The product has been removed."
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        loading,
        error
      }}
    >
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
