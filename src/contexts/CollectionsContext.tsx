
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Collection {
  id: string;
  name: string;
  description: string;
  images: string[];
  productCount: number;
  status: 'Active' | 'Inactive';
  category: string;
}

interface CollectionsContextType {
  collections: Collection[];
  addCollection: (collection: Omit<Collection, 'id'>) => Promise<void>;
  updateCollection: (id: string, collection: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  lastUpdated: number;
  loading: boolean;
  error: string | null;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
        setError(error.message);
        toast({
          title: "Error loading collections",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const formattedCollections: Collection[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        images: Array.isArray(item.images) ? item.images : [],
        productCount: item.product_count || 0,
        status: item.status as 'Active' | 'Inactive',
        category: item.category
      }));

      setCollections(formattedCollections);
      // DO NOT dispatch event here - this was causing the infinite loop
    } catch (error) {
      console.error('Error in fetchCollections:', error);
      setError('Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();

    // Listen for external updates from StoreContext real-time subscriptions
    const handleCollectionsUpdated = (event: any) => {
      console.log('Collections updated event received, refetching...');
      fetchCollections();
    };

    window.addEventListener('collectionsUpdated', handleCollectionsUpdated);
    
    return () => {
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdated);
    };
  }, []);

  const triggerUpdate = () => {
    setLastUpdated(Date.now());
    // Only dispatch event from CRUD operations, not from fetch
    window.dispatchEvent(new CustomEvent('collectionsUpdated', { 
      detail: { 
        timestamp: Date.now(),
        collections: collections
      } 
    }));
  };

  const addCollection = async (collectionData: Omit<Collection, 'id'>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('collections')
        .insert([{
          name: collectionData.name,
          description: collectionData.description,
          category: collectionData.category.toLowerCase(),
          images: collectionData.images,
          product_count: 0,
          status: collectionData.status
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding collection",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchCollections();
      triggerUpdate();
      
      toast({
        title: "Collection added successfully!",
        description: `${collectionData.name} has been created.`
      });
    } catch (error) {
      console.error('Error adding collection:', error);
      toast({
        title: "Error adding collection",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateCollection = async (id: string, collectionData: Partial<Collection>) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('collections')
        .update({
          name: collectionData.name,
          description: collectionData.description,
          category: collectionData.category?.toLowerCase(),
          images: collectionData.images,
          status: collectionData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating collection",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchCollections();
      triggerUpdate();
      
      toast({
        title: "Collection updated successfully!",
        description: "Your collection has been updated."
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: "Error updating collection",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting collection",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      await fetchCollections();
      triggerUpdate();
      
      toast({
        title: "Collection deleted successfully!",
        description: "The collection has been removed."
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Error deleting collection",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        lastUpdated,
        loading,
        error
      }}
    >
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
