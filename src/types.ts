export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'clothes' | 'shoes' | 'accessories';
  images: string[];
  colors: string[];
  sizes: string[];
  story?: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  isNewArrival?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}
