import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Settings, ArrowRight, Store, Bell } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminOverview } from './AdminOverview';
import { AdminOrders } from './AdminOrders';
import { AdminInventory } from './AdminInventory';
import { AdminSettings } from './AdminSettings';

export const AdminLayout: React.FC = () => {
  const { adminTab, setAdminTab, setActiveView, orders, products } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  const handleSelectOrderFromOverview = (orderId: string) => {
    setSelectedOrderId(orderId);
    setAdminTab('orders');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 text-right flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Right Zone: Admin Brand lockup */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                NadiBox<span className="text-amber-500">.ma</span>
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                لوحة التحكم
              </span>
            </div>

            {/* Admin Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 mr-4">
              <button
                onClick={() => setAdminTab('overview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'overview'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>نظرة عامة</span>
              </button>

              <button
                onClick={() => setAdminTab('orders')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'orders'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>الطلبات</span>
                {pendingOrdersCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('inventory')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'inventory'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>المخزون والمنتجات</span>
                {lowStockCount > 0 && (
                  <span className="bg-amber-500 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold">
                    {lowStockCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'settings'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>إعدادات المتجر</span>
              </button>
            </nav>
          </div>

          {/* Left Zone: Back to storefront */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('store')}
              className="flex items-center gap-2 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>معاينة واجهة المتجر</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around p-2 bg-stone-950 border-t border-stone-800 text-xs">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3 py-1.5 font-bold rounded-lg ${
              adminTab === 'overview' ? 'text-amber-400' : 'text-stone-400'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-3 py-1.5 font-bold rounded-lg relative ${
              adminTab === 'orders' ? 'text-amber-400' : 'text-stone-400'
            }`}
          >
            الطلبات ({pendingOrdersCount})
          </button>
          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-3 py-1.5 font-bold rounded-lg ${
              adminTab === 'inventory' ? 'text-amber-400' : 'text-stone-400'
            }`}
          >
            المخزون
          </button>
          <button
            onClick={() => setAdminTab('settings')}
            className={`px-3 py-1.5 font-bold rounded-lg ${
              adminTab === 'settings' ? 'text-amber-400' : 'text-stone-400'
            }`}
          >
            الإعدادات
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminTab === 'overview' && (
          <AdminOverview
            onNavigateTab={(tab) => setAdminTab(tab)}
            onSelectOrder={handleSelectOrderFromOverview}
          />
        )}
        {adminTab === 'orders' && <AdminOrders initialSelectedOrderId={selectedOrderId} />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};
