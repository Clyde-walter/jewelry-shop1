import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Search, Upload, X, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useStore } from '@/contexts/StoreContext';

export function AdminCollections() {
  const { collections, addCollection, updateCollection, deleteCollection, products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    category: 'rings' as 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'watches' | 'pendants',
    images: [] as string[]
  });
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    collectionId: '',
    images: [] as string[]
  });

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCollectionProducts = (collectionId: string) => {
    return products.filter(product => product.collectionId === collectionId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).slice(0, 5).map(file => {
        return URL.createObjectURL(file);
      });
      
      const updatedImages = [...collectionForm.images, ...newImages].slice(0, 5);
      setCollectionForm({...collectionForm, images: updatedImages});
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).slice(0, 5).map(file => {
        return URL.createObjectURL(file);
      });
      
      const updatedImages = [...productForm.images, ...newImages].slice(0, 5);
      setProductForm({...productForm, images: updatedImages});
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = collectionForm.images.filter((_, i) => i !== index);
    setCollectionForm({...collectionForm, images: updatedImages});
  };

  const removeProductImage = (index: number) => {
    const updatedImages = productForm.images.filter((_, i) => i !== index);
    setProductForm({...productForm, images: updatedImages});
  };

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
      images: collectionForm.images.length > 0 ? collectionForm.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'],
      productCount: editingCollection ? getCollectionProducts(editingCollection.id).length : 0,
      status: 'Active' as const
    };

    if (editingCollection) {
      updateCollection(editingCollection.id, collectionData);
      toast({
        title: "Collection updated successfully!",
        description: "Changes are now live across the store."
      });
    } else {
      addCollection(collectionData);
      toast({
        title: "Collection created successfully!",
        description: "New collection is now available in the store."
      });
    }

    resetCollectionForm();
    setIsCollectionDialogOpen(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.description || !productForm.collectionId) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      description: productForm.description,
      category: productForm.category || 'Jewelry',
      stock: parseInt(productForm.stock) || 0,
      collectionId: productForm.collectionId,
      image: productForm.images[0],
      images: productForm.images
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "Product updated successfully!"
      });
    } else {
      addProduct(productData);
      // Update collection product count
      const collection = collections.find(c => c.id === productForm.collectionId);
      if (collection) {
        updateCollection(collection.id, {
          productCount: getCollectionProducts(collection.id).length + 1
        });
      }
      toast({
        title: "Product added successfully!"
      });
    }

    resetProductForm();
    setIsProductDialogOpen(false);
  };

  const resetCollectionForm = () => {
    setCollectionForm({
      name: '',
      description: '',
      category: 'rings',
      images: []
    });
    setEditingCollection(null);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      collectionId: selectedCollection?.id || '',
      images: []
    });
    setEditingProduct(null);
  };

  const handleEditCollection = (collection: any) => {
    setEditingCollection(collection);
    setCollectionForm({
      name: collection.name,
      description: collection.description,
      category: collection.category || 'rings',
      images: collection.images || []
    });
    setIsCollectionDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      collectionId: product.collectionId,
      images: product.images || [product.image]
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      deleteCollection(collectionId);
      toast({
        title: "Collection deleted successfully!",
        description: "Collection has been removed from the store."
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const product = products.find(p => p.id === productId);
      deleteProduct(productId);
      
      // Update collection product count
      if (product?.collectionId) {
        const collection = collections.find(c => c.id === product.collectionId);
        if (collection) {
          updateCollection(collection.id, {
            productCount: Math.max(0, getCollectionProducts(collection.id).length - 1)
          });
        }
      }
      
      toast({
        title: "Product deleted successfully!"
      });
    }
  };

  const handleManageProducts = (collection: any) => {
    setSelectedCollection(collection);
    setProductForm({...productForm, collectionId: collection.id});
  };

  if (selectedCollection) {
    const collectionProducts = getCollectionProducts(selectedCollection.id);
    
    return (
      <div className="p-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedCollection(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collections
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Manage Products - {selectedCollection.name}
          </h1>
          <p className="text-gray-600">
            Add and manage products for this collection
          </p>
        </div>

        {/* Product Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {collectionProducts.length} products in this collection
          </div>
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetProductForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                    <Input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Rings">Rings</SelectItem>
                      <SelectItem value="Necklaces">Necklaces</SelectItem>
                      <SelectItem value="Earrings">Earrings</SelectItem>
                      <SelectItem value="Bracelets">Bracelets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Images (Up to 5)</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label htmlFor="product-image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Images
                          </span>
                        </Button>
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {productForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          {productForm.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProductImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Collection Products ({collectionProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {collectionProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-500 mb-4">Add products to this collection to get started.</p>
                <Button onClick={() => setIsProductDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {(product.images || [product.image]).slice(0, 3).map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded-full border-2 border-white"
                              />
                            ))}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description.slice(0, 50)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collections Management</h1>
        <p className="text-gray-600">Create and manage product collections - changes update immediately across the store</p>
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
        <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetCollectionForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
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
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select value={collectionForm.category} onValueChange={(value: any) => setCollectionForm({...collectionForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jewelry category" />
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
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm({...collectionForm, description: e.target.value})}
                  placeholder="Enter collection description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collection Images (Up to 5)</label>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="collection-image-upload"
                    />
                    <label htmlFor="collection-image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Images
                        </span>
                      </Button>
                    </label>
                  </div>
                  {collectionForm.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {collectionForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Collection ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingCollection ? 'Update Collection' : 'Create Collection'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Collections ({filteredCollections.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((collection) => {
                const collectionProducts = getCollectionProducts(collection.id);
                const validImages = collection.images.filter(img => img && img !== '/placeholder.svg');
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
                              className="w-10 h-10 object-cover rounded border-2 border-white"
                              onError={(e) => {
                                console.log('Collection image failed to load:', image);
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                              }}
                            />
                          ))}
                          {validImages.length > 3 && (
                            <div className="w-10 h-10 bg-gray-200 rounded border-2 border-white flex items-center justify-center text-xs">
                              +{validImages.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-sm text-gray-500">{collection.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{collectionProducts.length} products</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageProducts(collection)}
                        >
                          <Package className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 text-white">
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCollection(collection)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="text-red-5 hover:text-red-700"
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
