
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  lastUpdated: number;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const formattedProducts: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        description: item.description || '',
        category: item.category,
        stock: item.stock || 0,
        image: item.image || (item.images && Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'),
        images: item.images && Array.isArray(item.images) && item.images.length > 0 
          ? item.images 
          : [item.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'],
        collectionId: item.collection_id
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Listen for external updates
    const handleProductsUpdated = () => {
      console.log('Products updated event received, refetching...');
      fetchProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const triggerUpdate = () => {
    setLastUpdated(Date.now());
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { 
        timestamp: Date.now(),
        products: products
      } 
    }));
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      console.log('Adding product with data:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          image: productData.image,
          images: productData.images || [productData.image],
          collection_id: productData.collectionId || null
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Error adding product",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Product added successfully:', data);
      await fetchProducts();
      triggerUpdate();
      
      toast({
        title: "Product added successfully!",
        description: `${productData.name} has been added to your inventory.`
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
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          image: productData.image,
          images: productData.images,
          collection_id: productData.collectionId || null,
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
      triggerUpdate();
      
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
      triggerUpdate();
      
      toast({
        title: "Product deleted successfully!",
        description: "The product has been removed from your inventory."
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
        lastUpdated,
        loading
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
