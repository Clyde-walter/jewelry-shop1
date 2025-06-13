
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProducts } from '@/contexts/ProductsContext';
import { useCollections } from '@/contexts/CollectionsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, loading, error } = useProducts();
  const { collections } = useCollections();
  const { t } = useLanguage();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    collectionId: '',
    images: [] as string[]
  });

  console.log('AdminProducts rendering with:', { 
    productsCount: products.length, 
    loading, 
    error,
    collectionsCount: collections.length
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: t('admin.products.stock.outOfStock') || 'Out of Stock', color: 'bg-red-500' };
    if (stock <= 5) return { label: t('admin.products.stock.limited') || 'Limited Stock', color: 'bg-yellow-500' };
    return { label: t('admin.products.stock.inStock') || 'In Stock', color: 'bg-green-500' };
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.description || !productForm.category) {
      toast({
        title: t('admin.products.error.fillFields') || "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const productData = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        category: productForm.category,
        stock: parseInt(productForm.stock) || 0,
        collectionId: productForm.collectionId || undefined,
        image: productForm.images.length > 0 ? productForm.images[0] : 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        images: productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop']
      };

      if (editingProduct) {
        console.log('Updating product:', editingProduct.id, productData);
        await updateProduct(editingProduct.id, productData);
      } else {
        console.log('Adding new product:', productData);
        await addProduct(productData);
      }

      resetForm();
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: t('admin.products.error.save') || "Error saving product",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      collectionId: '',
      images: []
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      collectionId: product.collectionId || '',
      images: product.images || [product.image]
    });
    setIsProductDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm(t('admin.products.confirm.delete') || 'Are you sure you want to delete this product?')) {
      try {
        console.log('Deleting product:', productId);
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: t('admin.products.error.delete') || "Error deleting product",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNewProduct = () => {
    console.log('Opening add product dialog');
    resetForm();
    setIsProductDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-ecommerce-600" />
            <p className="text-gray-600">{t('admin.products.loading') || 'Loading products...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.products.title') || 'Products Management'}</h1>
        <p className="text-gray-600">{t('admin.products.description') || 'Manage your product inventory, pricing, and stock levels'}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t('admin.products.search.placeholder') || "Search products..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={t('admin.products.filter.placeholder') || "Filter by category"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.products.filter.all') || 'All Categories'}</SelectItem>
            <SelectItem value="Rings">{t('categories.rings') || 'Rings'}</SelectItem>
            <SelectItem value="Necklaces">{t('categories.necklaces') || 'Necklaces'}</SelectItem>
            <SelectItem value="Earrings">{t('categories.earrings') || 'Earrings'}</SelectItem>
            <SelectItem value="Bracelets">{t('categories.bracelets') || 'Bracelets'}</SelectItem>
            <SelectItem value="Watches">{t('categories.watches') || 'Watches'}</SelectItem>
            <SelectItem value="Pendants">{t('categories.pendants') || 'Pendants'}</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNewProduct}>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.products.add') || 'Add Product'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? (t('admin.products.edit') || 'Edit Product') : (t('admin.products.add') || 'Add New Product')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.products.form.name') || 'Product Name'} *</label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder={t('admin.products.form.name.placeholder') || "Enter product name"}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.products.form.price') || 'Price'} *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('admin.products.form.stock') || 'Stock Quantity'}</label>
                  <Input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.products.form.category') || 'Category'} *</label>
                <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.products.form.category.placeholder') || "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rings">{t('categories.rings') || 'Rings'}</SelectItem>
                    <SelectItem value="Necklaces">{t('categories.necklaces') || 'Necklaces'}</SelectItem>
                    <SelectItem value="Earrings">{t('categories.earrings') || 'Earrings'}</SelectItem>
                    <SelectItem value="Bracelets">{t('categories.bracelets') || 'Bracelets'}</SelectItem>
                    <SelectItem value="Watches">{t('categories.watches') || 'Watches'}</SelectItem>
                    <SelectItem value="Pendants">{t('categories.pendants') || 'Pendants'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.products.form.collection') || 'Collection'} ({t('admin.products.form.optional') || 'Optional'})</label>
                <Select value={productForm.collectionId} onValueChange={(value) => setProductForm({...productForm, collectionId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.products.form.collection.placeholder') || "Select collection"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('admin.products.form.collection.none') || 'No Collection'}</SelectItem>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.products.form.images') || 'Product Images'}</label>
                <ImageUpload
                  images={productForm.images}
                  onImagesChange={(images) => setProductForm({...productForm, images})}
                  maxImages={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('admin.products.form.description') || 'Description'} *</label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder={t('admin.products.form.description.placeholder') || "Enter product description"}
                  rows={3}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingProduct ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingProduct ? (t('admin.products.update') || 'Update Product') : (t('admin.products.add') || 'Add Product')
                )}
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
            {t('admin.products.products') || 'Products'} ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Start by adding your first product to the inventory.</p>
              <Button onClick={handleAddNewProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.products.table.product') || 'Product'}</TableHead>
                  <TableHead>{t('admin.products.table.category') || 'Category'}</TableHead>
                  <TableHead>{t('admin.products.table.collection') || 'Collection'}</TableHead>
                  <TableHead>{t('admin.products.table.price') || 'Price'}</TableHead>
                  <TableHead>{t('admin.products.table.stock') || 'Stock'}</TableHead>
                  <TableHead>{t('admin.products.table.status') || 'Status'}</TableHead>
                  <TableHead>{t('admin.products.table.actions') || 'Actions'}</TableHead>
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
                  const collection = collections.find(c => c.id === product.collectionId);
                  
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
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description.slice(0, 50)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t(`categories.${product.category.toLowerCase()}`) || product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {collection ? (
                          <Badge variant="outline">{collection.name}</Badge>
                        ) : (
                          <span className="text-gray-400">{t('admin.products.table.noCollection') || 'No Collection'}</span>
                        )}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
