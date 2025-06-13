
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';

export function AdminCollections() {
  const { collections, addCollection, updateCollection, deleteCollection } = useStore();
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    category: '',
    status: 'Active' as 'Active' | 'Inactive',
    images: [] as string[]
  });

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || collection.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collectionForm.name || !collectionForm.description || !collectionForm.category) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const collectionData = {
      name: collectionForm.name,
      description: collectionForm.description,
      category: collectionForm.category,
      status: collectionForm.status,
      images: collectionForm.images.length > 0 ? collectionForm.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop'],
      productCount: 0
    };

    if (editingCollection) {
      updateCollection(editingCollection.id, collectionData);
      toast({
        title: "Collection updated successfully!"
      });
    } else {
      addCollection(collectionData);
      toast({
        title: "Collection added successfully!"
      });
    }

    resetForm();
    setIsCollectionDialogOpen(false);
  };

  const resetForm = () => {
    setCollectionForm({
      name: '',
      description: '',
      category: '',
      status: 'Active',
      images: []
    });
    setEditingCollection(null);
  };

  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    setCollectionForm({
      name: collection.name,
      description: collection.description,
      category: collection.category,
      status: collection.status,
      images: collection.images || []
    });
    setIsCollectionDialogOpen(true);
  };

  const handleDelete = (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(collectionId);
      toast({
        title: "Collection deleted successfully!"
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collections Management</h1>
        <p className="text-gray-600">Manage your product collections and categories</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Collection Name *</label>
                <Input
                  value={collectionForm.name}
                  onChange={(e) => setCollectionForm({...collectionForm, name: e.target.value})}
                  placeholder="Enter collection name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Select value={collectionForm.category} onValueChange={(value) => setCollectionForm({...collectionForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rings">Rings</SelectItem>
                      <SelectItem value="necklaces">Necklaces</SelectItem>
                      <SelectItem value="earrings">Earrings</SelectItem>
                      <SelectItem value="bracelets">Bracelets</SelectItem>
                      <SelectItem value="watches">Watches</SelectItem>
                      <SelectItem value="pendants">Pendants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={collectionForm.status} onValueChange={(value: 'Active' | 'Inactive') => setCollectionForm({...collectionForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collection Images</label>
                <ImageUpload
                  images={collectionForm.images}
                  onImagesChange={(images) => setCollectionForm({...collectionForm, images})}
                  maxImages={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm({...collectionForm, description: e.target.value})}
                  placeholder="Enter collection description"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCollection ? 'Update Collection' : 'Add Collection'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="w-5 h-5" />
            Collections ({filteredCollections.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((collection) => {
                const validImages = collection.images?.filter(img => 
                  img && 
                  img !== '/placeholder.svg' && 
                  (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/'))
                ) || [];
                
                return (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {validImages.slice(0, 3).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={collection.name}
                              className="w-8 h-8 object-cover rounded-full border-2 border-white"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                              }}
                            />
                          ))}
                          {validImages.length > 3 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs">
                              +{validImages.length - 3}
                            </div>
                          )}
                          {validImages.length === 0 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                              <Package2 className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-sm text-gray-500">{collection.description.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{collection.category}</Badge>
                    </TableCell>
                    <TableCell>{collection.productCount}</TableCell>
                    <TableCell>
                      <Badge className={collection.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(collection)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(collection.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
