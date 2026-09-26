/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { StoreHeader } from './components/store/StoreHeader';
import { StoreHome } from './components/store/StoreHome';
import { StoreFooter } from './components/store/StoreFooter';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { OrderSuccessModal } from './components/store/OrderSuccessModal';
import { OrderTrackerModal } from './components/store/OrderTrackerModal';
import { SearchModal } from './components/store/SearchModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { ToastContainer } from './components/common/ToastContainer';
import { Product, Order } from './types';

function StoreMainApp() {
  const {
    activeView,
    quickViewProduct,
    setQuickViewProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    completedOrder,
    setCompletedOrder,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);

  const handleBuyNowDirect = (product: Product, quantity: number) => {
    setQuickViewProduct(null);
    setDirectCheckoutItem({ product, quantity });
    setIsCheckoutOpen(true);
  };

  const handleOrderFinished = (order: Order) => {
    setIsCheckoutOpen(false);
    setDirectCheckoutItem(null);
    setCompletedOrder(order);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {activeView === 'admin' ? (
        <AdminLayout />
      ) : (
        <>
          <StoreHeader
            onSearchClick={() => setIsSearchOpen(true)}
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <main className="flex-1">
            <StoreHome
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          </main>

          <StoreFooter />
        </>
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer
        onProceedToCheckout={() => {
          setDirectCheckoutItem(null);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          directItem={directCheckoutItem}
          onClose={() => {
            setIsCheckoutOpen(false);
            setDirectCheckoutItem(null);
          }}
          onOrderSuccess={handleOrderFinished}
        />
      )}

      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onBuyNow={handleBuyNowDirect}
        />
      )}

      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          onTrackOrder={() => setIsOrderTrackerOpen(true)}
        />
      )}

      {isOrderTrackerOpen && (
        <OrderTrackerModal
          onClose={() => setIsOrderTrackerOpen(false)}
          initialQuery={completedOrder?.id || ''}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => setQuickViewProduct(p)}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreMainApp />
    </StoreProvider>
  );
}
