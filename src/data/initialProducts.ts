
import { Product } from '@/types/store';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Diamond Solitaire Ring',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop'
    ],
    description: 'Stunning diamond solitaire ring crafted in 18k white gold with a brilliant cut center stone',
    category: 'Rings',
    stock: 15,
    collectionId: '1'
  },
  {
    id: '2',
    name: 'Pearl Drop Earrings',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=400&fit=crop'
    ],
    description: 'Elegant freshwater pearl drop earrings with 14k gold settings',
    category: 'Earrings',
    stock: 25,
    collectionId: '2'
  },
  {
    id: '3',
    name: 'Gold Tennis Bracelet',
    price: 1599.99,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop'
    ],
    description: 'Classic gold tennis bracelet with continuous line of diamonds',
    category: 'Bracelets',
    stock: 12,
    collectionId: '3'
  },
  {
    id: '4',
    name: 'Emerald Pendant Necklace',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    ],
    description: 'Exquisite emerald pendant necklace with diamond halo setting',
    category: 'Necklaces',
    stock: 8,
    collectionId: '4'
  },
  {
    id: '5',
    name: 'Luxury Swiss Watch',
    price: 3299.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop'
    ],
    description: 'Premium Swiss-made timepiece with automatic movement and sapphire crystal',
    category: 'Watches',
    stock: 5,
    collectionId: '5'
  },
  {
    id: '6',
    name: 'Sapphire Pendant',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=400&fit=crop'
    ],
    description: 'Beautiful blue sapphire pendant with white gold chain',
    category: 'Pendants',
    stock: 18,
    collectionId: '6'
  }
];
