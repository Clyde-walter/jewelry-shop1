
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import { useCollections } from '@/contexts/CollectionsContext';
import { CollectionForm } from '@/components/admin/CollectionForm';
import { Collection } from '@/types/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function AdminCollections() {
  const { collections, loading, addCollection, updateCollection, deleteCollection } = useCollections();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCollection = () => {
    setEditingCollection(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (collectionData: Omit<Collection, 'id' | 'productCount'>) => {
    if (formMode === 'create') {
      await addCollection(collectionData);
    } else if (editingCollection) {
      await updateCollection(editingCollection.id, collectionData);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections Management</h1>
          <p className="text-gray-600 mt-1">Manage your jewelry collections</p>
        </div>
        <Button onClick={handleCreateCollection} className="bg-ecommerce-600 hover:bg-ecommerce-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Collection
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {collection.images.length > 0 ? (
                <img
                  src={collection.images[0]}
                  alt={collection.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <Badge
                className={`absolute top-2 right-2 ${
                  collection.status === 'Active' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {collection.status}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg">{collection.name}</span>
                <Badge variant="outline" className="capitalize">
                  {collection.category}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {collection.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {collection.productCount} products
                </span>
                <span className="text-sm text-gray-500">
                  {collection.images.length} images
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`/collection/${collection.id}`, '_blank')}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCollection(collection)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{collection.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCollection(collection.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first collection.'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateCollection} className="bg-ecommerce-600 hover:bg-ecommerce-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          )}
        </div>
      )}

      {/* Collection Form Modal */}
      <CollectionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        collection={editingCollection}
        mode={formMode}
      />
    </div>
  );
}
