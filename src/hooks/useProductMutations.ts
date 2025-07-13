
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/store';
import { toast } from '@/hooks/use-toast';

export const useProductMutations = () => {
  const createProduct = async (product: Omit<Product, 'id'> & { specifications?: Record<string, any>; ringSizes?: string[]; watchSizes?: string[] }) => {
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
      most_picked_order: product.mostPickedOrder || 0,
      specifications: product.specifications || {},
      ring_sizes: product.ringSizes || [],
      watch_sizes: product.watchSizes || []
    });

    if (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Product created successfully"
    });
  };

  const updateProduct = async (id: string, product: Partial<Product> & { specifications?: Record<string, any>; ringSizes?: string[]; watchSizes?: string[] }) => {
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
        most_picked_order: product.mostPickedOrder,
        specifications: product.specifications,
        ring_sizes: product.ringSizes,
        watch_sizes: product.watchSizes
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Product updated successfully"
    });
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  const updateFeaturedProducts = async (productIds: string[]) => {
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
  };

  const updateMostPickedProducts = async (productIds: string[]) => {
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
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateFeaturedProducts,
    updateMostPickedProducts
  };
};
