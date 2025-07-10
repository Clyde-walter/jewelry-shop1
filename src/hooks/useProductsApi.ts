
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/store';
import { toast } from '@/hooks/use-toast';

export const useProductsApi = () => {
  const convertDbProductToProduct = (dbProduct: any): Product => {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      price: Number(dbProduct.price),
      image: dbProduct.image || '',
      images: dbProduct.images || [],
      description: dbProduct.description || '',
      category: dbProduct.category,
      stock: dbProduct.stock || 0,
      collectionId: dbProduct.collection_id,
      isFeatured: dbProduct.is_featured || false,
      isMostPicked: dbProduct.is_most_picked || false,
      featuredOrder: dbProduct.featured_order || 0,
      mostPickedOrder: dbProduct.most_picked_order || 0,
      specifications: (dbProduct.specifications && typeof dbProduct.specifications === 'object' && !Array.isArray(dbProduct.specifications)) 
        ? dbProduct.specifications as Record<string, any>
        : {},
      ringSizes: dbProduct.ring_sizes || [],
      watchSizes: dbProduct.watch_sizes || []
    };
  };

  const fetchProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(convertDbProductToProduct);
  };

  const fetchFeaturedProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true });

    if (error) throw error;

    return data.map(convertDbProductToProduct);
  };

  const fetchMostPickedProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_most_picked', true)
      .order('most_picked_order', { ascending: true });

    if (error) throw error;

    return data.map(convertDbProductToProduct);
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return convertDbProductToProduct(data);
  };

  return {
    fetchProducts,
    fetchFeaturedProducts,
    fetchMostPickedProducts,
    fetchProductById
  };
};
