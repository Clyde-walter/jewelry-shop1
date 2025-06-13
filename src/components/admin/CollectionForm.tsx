
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collection } from '@/types/store';
import { ImageUpload } from '@/components/ImageUpload';

interface CollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (collection: Omit<Collection, 'id' | 'productCount'>) => Promise<void>;
  collection?: Collection;
  mode: 'create' | 'edit';
}

export function CollectionForm({ isOpen, onClose, onSubmit, collection, mode }: CollectionFormProps) {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    category: collection?.category || 'rings' as Collection['category'],
    status: collection?.status || 'Active' as 'Active' | 'Inactive',
    images: collection?.images || []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'rings',
        status: 'Active',
        images: []
      });
    } catch (error) {
      console.error('Error submitting collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Collection' : 'Edit Collection'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: Collection['category']) => 
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Active' | 'Inactive') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Collection Images</Label>
            
            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={5}
              bucketName="product-images"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Collection' : 'Update Collection')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
