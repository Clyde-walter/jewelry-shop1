
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Crown, Search, Plus, X, GripVertical } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { toast } from '@/hooks/use-toast';

export function AdminFeatured() {
  const { products, featuredProducts, mostPickedProducts, updateFeaturedProducts, updateMostPickedProducts, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState<string[]>([]);
  const [selectedMostPicked, setSelectedMostPicked] = useState<string[]>([]);
  const [isManagingFeatured, setIsManagingFeatured] = useState(false);
  const [isManagingMostPicked, setIsManagingMostPicked] = useState(false);

  useEffect(() => {
    setSelectedFeatured(featuredProducts.map(p => p.id));
    setSelectedMostPicked(mostPickedProducts.map(p => p.id));
  }, [featuredProducts, mostPickedProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveFeatured = async () => {
    await updateFeaturedProducts(selectedFeatured);
    setIsManagingFeatured(false);
  };

  const handleSaveMostPicked = async () => {
    await updateMostPickedProducts(selectedMostPicked);
    setIsManagingMostPicked(false);
  };

  const toggleFeaturedProduct = (productId: string) => {
    setSelectedFeatured(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleMostPickedProduct = (productId: string) => {
    setSelectedMostPicked(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const ProductSelectionCard = ({ product, isSelected, onToggle }: any) => (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-ecommerce-500 bg-ecommerce-50' : 'hover:shadow-lg'}`}
      onClick={() => onToggle(product.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop';
              }}
            />
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-ecommerce-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <span className="text-sm text-gray-600">${product.price}</span>
            </div>
            <p className="text-sm text-gray-500 truncate mt-1">{product.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Featured Products Management</h1>
          <p className="text-gray-600">Manage featured and most picked products for your homepage</p>
        </div>
      </div>

      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Featured Products
          </TabsTrigger>
          <TabsTrigger value="most-picked" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Most Picked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Featured Products ({featuredProducts.length})
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  These products will be displayed in the Featured Products section on the homepage
                </p>
              </div>
              <Dialog open={isManagingFeatured} onOpenChange={setIsManagingFeatured}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Featured
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Featured Products</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFeatured.length} products. Click on products to select/deselect them.
                    </p>
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <ProductSelectionCard
                          key={product.id}
                          product={product}
                          isSelected={selectedFeatured.includes(product.id)}
                          onToggle={toggleFeaturedProduct}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsManagingFeatured(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveFeatured}>
                        Save Featured Products
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredProducts.map((product, index) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-100 overflow-hidden relative">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                          }}
                        />
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          #{index + 1}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold text-ecommerce-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Products</h3>
                  <p className="text-gray-600">Select products to feature on your homepage</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="most-picked" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  Most Picked Products ({mostPickedProducts.length})
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  These products will be displayed in the Most Picked section on the homepage
                </p>
              </div>
              <Dialog open={isManagingMostPicked} onOpenChange={setIsManagingMostPicked}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Most Picked
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Most Picked Products</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Selected: {selectedMostPicked.length} products. Click on products to select/deselect them.
                    </p>
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <ProductSelectionCard
                          key={product.id}
                          product={product}
                          isSelected={selectedMostPicked.includes(product.id)}
                          onToggle={toggleMostPickedProduct}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsManagingMostPicked(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveMostPicked}>
                        Save Most Picked Products
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {mostPickedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mostPickedProducts.map((product, index) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-100 overflow-hidden relative">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
                          }}
                        />
                        <Badge className="absolute top-2 left-2 bg-purple-500">
                          #{index + 1}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold text-ecommerce-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Most Picked Products</h3>
                  <p className="text-gray-600">Select products that customers pick the most</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
