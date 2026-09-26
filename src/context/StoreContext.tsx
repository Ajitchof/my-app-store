import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  settings: StoreSettings;
  wishlist: string[];
  activeView: 'store' | 'admin';
  adminTab: 'overview' | 'orders' | 'inventory' | 'settings';
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderTrackerOpen: boolean;
  quickViewProduct: Product | null;
  completedOrder: Order | null;
  toasts: Toast[];

  // Navigation
  setActiveView: (view: 'store' | 'admin') => void;
  setAdminTab: (tab: 'overview' | 'orders' | 'inventory' | 'settings') => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderTrackerOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setCompletedOrder: (order: Order | null) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Inventory / Products Admin
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Feedback
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'nadibox_products_v1',
  ORDERS: 'nadibox_orders_v1',
  CART: 'nadibox_cart_v1',
  WISHLIST: 'nadibox_wishlist_v1',
  SETTINGS: 'nadibox_settings_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or use initial
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // UI state
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'inventory' | 'settings'>('overview');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart methods
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('عذراً، هذا المنتج غير متوفر حالياً في المخزون', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        if (newQty === existing.quantity) {
          showToast(`الحد الأقصى المتاح من هذا المنتج هو ${product.stock} قطع`, 'info');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    showToast(`تمت إضافة "${product.title}" إلى سلة مشترياتك`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxAllowed = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('تمت إزالة المنتج من المفضلة', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('تمت إضافة المنتج إلى المفضلة', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Order creation with stock decrement
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order => {
    const orderNumber = 1095 + orders.length;
    const orderId = `NB-${orderNumber}`;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `TRK-MA-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
    };

    // Decrement stock for ordered items
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderedItem = orderData.items.find((item) => item.product.id === p.id);
        if (orderedItem) {
          const updatedStock = Math.max(0, p.stock - orderedItem.quantity);
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              paymentStatus: status === 'delivered' ? 'paid' : order.paymentStatus,
            }
          : order
      )
    );
    showToast(`تم تحديث حالة الطلب ${orderId} إلى: ${getStatusLabel(status)}`, 'success');
  };

  // Inventory / Products methods
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('تم تحديث المخزون بنجاح', 'success');
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `nb-prod-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('تمت إضافة المنتج الجديد بنجاح إلى المتجر', 'success');
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    showToast('تم حفظ تعديلات المنتج بنجاح', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('تم حذف المنتج من المتجر', 'info');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('تم حفظ إعدادات المتجر والتوصيل بنجاح', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        settings,
        wishlist,
        activeView,
        adminTab,
        isCartOpen,
        isCheckoutOpen,
        isOrderTrackerOpen,
        quickViewProduct,
        completedOrder,
        toasts,
        setActiveView,
        setAdminTab,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsOrderTrackerOpen,
        setQuickViewProduct,
        setCompletedOrder,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        updateProductStock,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'قيد المراجعة';
    case 'confirmed':
      return 'تم التأكيد';
    case 'shipping':
      return 'جاري الشحن';
    case 'delivered':
      return 'تم التسليم';
    case 'cancelled':
      return 'ملغي';
    default:
      return status;
  }
}
