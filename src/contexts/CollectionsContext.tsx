
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Collection } from '@/types/store';
import { useToast } from '@/hooks/use-toast';

interface CollectionsContextType {
  collections: Collection[];
  loading: boolean;
  fetchCollections: () => Promise<void>;
  getCollectionById: (id: string) => Collection | undefined;
  getCollectionProducts: (collectionId: string) => Promise<any[]>;
  addCollection: (collection: Omit<Collection, 'id' | 'productCount'>) => Promise<void>;
  updateCollection: (id: string, collection: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addProductToCollection: (collectionId: string, productId: string) => Promise<void>;
  removeProductFromCollection: (collectionId: string, productId: string) => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const formattedCollections: Collection[] = data.map(collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description || '',
        images: collection.images || [],
        productCount: collection.product_count,
        status: collection.status as 'Active' | 'Inactive',
        category: collection.category as Collection['category']
      }));

      setCollections(formattedCollections);
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCollectionById = (id: string) => {
    return collections.find(collection => collection.id === id);
  };

  const getCollectionProducts = async (collectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('collection_products')
        .select(`
          sort_order,
          products (
            id, name, price, description, category, stock, image, images
          )
        `)
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data.map(item => item.products).filter(Boolean);
    } catch (error: any) {
      console.error('Error fetching collection products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collection products",
        variant: "destructive"
      });
      return [];
    }
  };

  const addCollection = async (collection: Omit<Collection, 'id' | 'productCount'>) => {
    try {
      const { error } = await supabase
        .from('collections')
        .insert({
          name: collection.name,
          description: collection.description,
          category: collection.category,
          images: collection.images,
          status: collection.status,
          sort_order: collections.length + 1
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collection created successfully"
      });

      await fetchCollections();
    } catch (error: any) {
      console.error('Error adding collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive"
      });
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>) => {
    try {
      const { error } = await supabase
        .from('collections')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          images: updates.images,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collection updated successfully"
      });

      await fetchCollections();
    } catch (error: any) {
      console.error('Error updating collection:', error);
      toast({
        title: "Error",
        description: "Failed to update collection",
        variant: "destructive"
      });
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collection deleted successfully"
      });

      await fetchCollections();
    } catch (error: any) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive"
      });
    }
  };

  const addProductToCollection = async (collectionId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('collection_products')
        .insert({
          collection_id: collectionId,
          product_id: productId,
          sort_order: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added to collection"
      });
    } catch (error: any) {
      console.error('Error adding product to collection:', error);
      toast({
        title: "Error",
        description: "Failed to add product to collection",
        variant: "destructive"
      });
    }
  };

  const removeProductFromCollection = async (collectionId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('collection_products')
        .delete()
        .eq('collection_id', collectionId)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product removed from collection"
      });
    } catch (error: any) {
      console.error('Error removing product from collection:', error);
      toast({
        title: "Error",
        description: "Failed to remove product from collection",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('collections-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'collections' }, 
        () => {
          console.log('Collections changed, refetching...');
          fetchCollections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value: CollectionsContextType = {
    collections,
    loading,
    fetchCollections,
    getCollectionById,
    getCollectionProducts,
    addCollection,
    updateCollection,
    deleteCollection,
    addProductToCollection,
    removeProductFromCollection
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}
