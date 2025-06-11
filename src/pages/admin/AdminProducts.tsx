import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, Package, X } from 'lucide-react';
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

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    images: [] as string[]
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500' };
    if (stock <= 5) return { label: 'Limited Stock', color: 'bg-yellow-500' };
    return { label: 'In Stock', color: 'bg-green-500' };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const updatedImages = productForm.images.filter((_, i) => i !== index);
    setProductForm({...productForm, images: updatedImages});
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.description || !productForm.category) {
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
      category: productForm.category,
      stock: parseInt(productForm.stock) || 0,
      image: productForm.images.length > 0 ? productForm.images[0] : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      images: productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop']
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "Product updated successfully!"
      });
    } else {
      addProduct(productData);
      toast({
        title: "Product added successfully!"
      });
    }

    resetForm();
    setIsProductDialogOpen(false);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      images: []
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      images: product.images || [product.image]
    });
    setIsProductDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      toast({
        title: "Product deleted successfully!"
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your product inventory, pricing, and stock levels</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Rings">Rings</SelectItem>
            <SelectItem value="Necklaces">Necklaces</SelectItem>
            <SelectItem value="Earrings">Earrings</SelectItem>
            <SelectItem value="Bracelets">Bracelets</SelectItem>
            <SelectItem value="Watches">Watches</SelectItem>
            <SelectItem value="Pendants">Pendants</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
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
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rings">Rings</SelectItem>
                    <SelectItem value="Necklaces">Necklaces</SelectItem>
                    <SelectItem value="Earrings">Earrings</SelectItem>
                    <SelectItem value="Bracelets">Bracelets</SelectItem>
                    <SelectItem value="Watches">Watches</SelectItem>
                    <SelectItem value="Pendants">Pendants</SelectItem>
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
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Images
                        </span>
                      </Button>
                    </label>
                  </div>
                  {productForm.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {productForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
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
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const productImages = product.images || [product.image];
                const validImages = productImages.filter(img => 
                  img && 
                  img !== '/placeholder.svg' && 
                  (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/'))
                );
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {validImages.slice(0, 3).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded-full border-2 border-white"
                            />
                          ))}
                          {validImages.length > 3 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs">
                              +{validImages.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={`text-white ${stockStatus.color}`}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
