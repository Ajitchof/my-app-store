export type ProductCategory = 'boxes' | 'electronics' | 'lifestyle' | 'workplace' | 'accessories';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: ProductSpec[];
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type PaymentMethod = 'cod' | 'card' | 'whatsapp';
export type PaymentStatus = 'pending' | 'paid';
export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  emailContact: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  currency: string;
}
