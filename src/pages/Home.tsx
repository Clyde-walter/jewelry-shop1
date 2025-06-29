import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Diamond, Crown, Sparkles, Shield, Truck, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useStore } from '@/contexts/StoreContext';

export function Home() {
  const { user } = useAuth();
  const { featuredProducts, mostPickedProducts, loading } = useProducts();
  const { addToCart, addToWishlist, isInWishlist } = useStore();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    });
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'} 
            alt={product.name}
            className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop';
            }}
          />
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10"
              onClick={(e) => handleAddToWishlist(e, product)}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
          {product.stock === 0 && (
            <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500">
              Out of Stock
            </Badge>
          )}
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg sm:text-xl font-bold text-ecommerce-600">
              ${product.price.toLocaleString()}
            </span>
            <Button 
              size="sm" 
              className="bg-ecommerce-600 hover:bg-ecommerce-700 hover:scale-105 transition-all duration-300 flex-shrink-0"
              onClick={(e) => handleAddToCart(e, product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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

  const features = [
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "All our jewelry comes with lifetime warranty and free maintenance"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Complimentary shipping on all orders above $500"
    },
    {
      icon: Users,
      title: "Expert Consultation",
      description: "Get personalized advice from our certified gemologists"
    },
    {
      icon: Award,
      title: "Certified Quality",
      description: "Every piece is certified and comes with authenticity guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely stunning engagement ring! The quality exceeded my expectations and the service was exceptional.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Beautiful custom necklace for my wife's anniversary. The craftsmanship is incredible!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      comment: "Love my diamond earrings! They're perfect for both everyday wear and special occasions.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Jewelry Background */}
      <section className="relative bg-gradient-to-r from-ecommerce-50 to-ecommerce-100 py-12 sm:py-16 lg:py-20 xl:py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop')"
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <Diamond className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-ecommerce-600 animate-bounce-subtle" />
                <div className="absolute inset-0 bg-ecommerce-600/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Welcome to <span className="text-ecommerce-600 font-serif bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 bg-clip-text text-transparent">Jewelry Port</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Discover exquisite jewelry that captures your soul. From timeless classics to modern masterpieces, 
              find the perfect piece to celebrate life's precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto bg-ecommerce-600 hover:bg-ecommerce-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Explore Collection
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-ecommerce-600 text-ecommerce-600 hover:bg-ecommerce-50 px-6 sm:px-8 py-3 text-base sm:text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Join Our Community
                  </Button>
                </Link>
              )}
            </div>
            {user && (
              <p className="mt-4 text-sm sm:text-base text-ecommerce-600 font-medium px-4">
                Welcome back! Ready to discover something beautiful?
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-ecommerce-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-ecommerce-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Collections</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore our carefully curated collections, each telling a unique story of craftsmanship and beauty.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${collection.color} hover:scale-110 transition-transform duration-300`}>
                    <collection.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{collection.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{collection.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Featured Products</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">Handpicked pieces that embody elegance and sophistication</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
              <Link to="/products">
                <Button className="bg-ecommerce-600 hover:bg-ecommerce-700">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-ecommerce-600 text-ecommerce-600 hover:bg-ecommerce-50 hover:scale-105 transition-all duration-300 px-6 sm:px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Most Picked Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Most Picked</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">Customer favorites that are flying off our shelves</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : mostPickedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {mostPickedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No most picked products available at the moment.</p>
              <Link to="/products">
                <Button className="bg-ecommerce-600 hover:bg-ecommerce-700">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-ecommerce-600 text-ecommerce-600 hover:bg-ecommerce-50 hover:scale-105 transition-all duration-300 px-6 sm:px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">Read testimonials from our satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 sm:py-16 bg-ecommerce-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Stay in the Loop</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and jewelry care tips.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary" size="lg" className="bg-white text-ecommerce-600 hover:bg-gray-100 px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Create Something Unique</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-600 max-w-2xl mx-auto px-4">
            Work with our master craftsmen to design a piece that's truly yours. 
            From engagement rings to custom pendants, bring your vision to life.
          </p>
          <Link to="/custom-design">
            <Button size="lg" className="bg-ecommerce-600 hover:bg-ecommerce-700 text-white hover:scale-105 transition-all duration-300 px-6 sm:px-8">
              Start Custom Design
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
