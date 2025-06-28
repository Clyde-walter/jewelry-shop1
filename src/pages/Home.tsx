
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Diamond, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Home() {
  const { user } = useAuth();

  const featuredProducts = [
    {
      id: 1,
      name: "Diamond Eternity Ring",
      price: 2500,
      originalPrice: 3000,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 127,
      category: "Rings"
    },
    {
      id: 2,
      name: "Pearl Pendant Necklace",
      price: 850,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 89,
      category: "Necklaces"
    },
    {
      id: 3,
      name: "Sapphire Stud Earrings",
      price: 1200,
      image: "/placeholder.svg",
      rating: 5.0,
      reviews: 45,
      category: "Earrings"
    }
  ];

  const collections = [
    {
      name: "Bridal Collection",
      description: "Perfect pieces for your special day",
      icon: Crown,
      color: "bg-pink-100 text-pink-600"
    },
    {
      name: "Diamond Classics",
      description: "Timeless elegance with brilliant diamonds",
      icon: Diamond,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Custom Designs",
      description: "Create something uniquely yours",
      icon: Sparkles,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-ecommerce-50 to-ecommerce-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Diamond className="w-16 h-16 text-ecommerce-600 animate-bounce-subtle" />
                <div className="absolute inset-0 bg-ecommerce-600/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-ecommerce-600 font-serif bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 bg-clip-text text-transparent">Jewelryport</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover exquisite jewelry that captures your soul. From timeless classics to modern masterpieces, 
              find the perfect piece to celebrate life's precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-8 py-3 text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Explore Collection
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="border-ecommerce-600 text-ecommerce-600 hover:bg-ecommerce-50 px-8 py-3 text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Join Our Community
                  </Button>
                </Link>
              )}
            </div>
            {user && (
              <p className="mt-4 text-ecommerce-600 font-medium">
                Welcome back! Ready to discover something beautiful?
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections, each telling a unique story of craftsmanship and beauty.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${collection.color} hover:scale-110 transition-transform duration-300`}>
                    <collection.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
                  <p className="text-gray-600">{collection.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Handpicked pieces that embody elegance and sophistication</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    {product.originalPrice && (
                      <Badge className="absolute top-4 left-4 bg-red-500 animate-pulse">
                        Sale
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-ecommerce-600">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="bg-ecommerce-600 hover:bg-ecommerce-700 hover:scale-105 transition-all duration-300">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-ecommerce-600 text-ecommerce-600 hover:bg-ecommerce-50 hover:scale-105 transition-all duration-300">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ecommerce-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Create Something Unique</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Work with our master craftsmen to design a piece that's truly yours. 
            From engagement rings to custom pendants, bring your vision to life.
          </p>
          <Link to="/custom-design">
            <Button size="lg" variant="secondary" className="bg-white text-ecommerce-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300">
              Start Custom Design
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
