export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  stock: number;
  collectionId?: string;
  isFeatured?: boolean;
  isMostPicked?: boolean;
  featuredOrder?: number;
  mostPickedOrder?: number;
  ringSizes?: string[];
  watchSizes?: string[];
  specifications?: Record<string, any>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  originalPrice?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  images: string[];
  productCount: number;
  status: 'Active' | 'Inactive';
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'watches' | 'pendants';
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone?: string;
    city?: string;
    zipCode?: string;
  };
}
