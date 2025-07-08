
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/store';
import { toast } from '@/hooks/use-toast';

export const useProductsApi = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(product => ({
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
      mostPickedOrder: product.most_picked_order || 0,
      ...(product.specifications && { specifications: product.specifications }),
      ...(product.ring_sizes && { ringSizes: product.ring_sizes }),
      ...(product.watch_sizes && { watchSizes: product.watch_sizes })
    }));
  };

  const fetchFeaturedProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true });

    if (error) throw error;

    return data.map(product => ({
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
      mostPickedOrder: product.most_picked_order || 0,
      ...(product.specifications && { specifications: product.specifications }),
      ...(product.ring_sizes && { ringSizes: product.ring_sizes }),
      ...(product.watch_sizes && { watchSizes: product.watch_sizes })
    }));
  };

  const fetchMostPickedProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_most_picked', true)
      .order('most_picked_order', { ascending: true });

    if (error) throw error;

    return data.map(product => ({
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
      mostPickedOrder: product.most_picked_order || 0,
      ...(product.specifications && { specifications: product.specifications }),
      ...(product.ring_sizes && { ringSizes: product.ring_sizes }),
      ...(product.watch_sizes && { watchSizes: product.watch_sizes })
    }));
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
      mostPickedOrder: data.most_picked_order || 0,
      ...(data.specifications && { specifications: data.specifications }),
      ...(data.ring_sizes && { ringSizes: data.ring_sizes }),
      ...(data.watch_sizes && { watchSizes: data.watch_sizes })
    };
  };

  return {
    fetchProducts,
    fetchFeaturedProducts,
    fetchMostPickedProducts,
    fetchProductById
  };
};
