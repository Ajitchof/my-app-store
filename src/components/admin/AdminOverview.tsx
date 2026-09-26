import React from 'react';
import { DollarSign, ShoppingCart, Clock, AlertTriangle, TrendingUp, ArrowUpRight, Package, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';

interface AdminOverviewProps {
  onNavigateTab: (tab: 'orders' | 'inventory' | 'settings') => void;
  onSelectOrder: (orderId: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab, onSelectOrder }) => {
  const { orders, products, updateOrderStatus } = useStore();

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const deliverySuccessRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  return (
    <div className="space-y-6 text-right">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            لوحة قيادة متجر NadiBox.ma
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            متابعة حية للمبيعات، شحنات المدن المغربية، ومستويات المخزون بالدرهم المغربي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>إدارة وتعديل المخزون</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>معالجة الطلبات ({pendingOrders})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">إجمالي المبيعات المؤكدة</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-stone-950 font-mono-num">
              {totalRevenue.toLocaleString()} <span className="text-xs font-semibold text-stone-500">د.م.</span>
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>معدل نمو أسبوعي إيجابي في المغرب</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">إجمالي الطلبات</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-stone-950 font-mono-num">
              {totalOrders} <span className="text-xs font-semibold text-stone-500">طلب</span>
            </div>
            <div className="text-[11px] text-stone-500">
              معدل التسليم الناجح: <strong className="text-stone-800 font-mono-num">{deliverySuccessRate}%</strong>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">طلبات تنتظر المعالجة</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-amber-700 font-mono-num">
              {pendingOrders} <span className="text-xs font-semibold text-stone-500">جديد</span>
            </div>
            <div className="text-[11px] text-amber-800">
              تتطلب الاتصال بالعميل للتأكيد
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">تنبيهات المخزون</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-rose-700 font-mono-num">
              {lowStockProducts.length} <span className="text-xs font-semibold text-stone-500">منتجات شارفت على النفاد</span>
            </div>
            <div className="text-[11px] text-stone-500">
              تحتاج لإعادة تزويد المستودع
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Low Stock Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900">أحدث الطلبات الواردة</h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>عرض كل الطلبات ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/70 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-stone-900 text-xs">
                      #{order.id}
                    </span>
                    <span className="text-xs font-semibold text-stone-800">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>{order.city.split(' ')[0]}</span>
                    <span>·</span>
                    <span className="font-mono-num">{order.phone}</span>
                    <span>·</span>
                    <span>{order.items.length} منتج</span>
                  </div>
                </div>

                <div className="text-left flex items-center gap-3">
                  <div>
                    <span className="font-mono-num font-bold text-stone-950 text-sm block">
                      {order.total} د.م.
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {order.paymentMethod === 'cod' ? 'عند الاستلام' : 'بطاقة إلكترونية'}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {getStatusArabic(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Watchlist (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>مراقبة المخزون المنخفض</span>
            </h3>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              <span>إدارة كامل المخزون</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="font-semibold text-stone-800">المخزون في حالة ممتازة!</p>
                <p className="text-stone-400">جميع المنتجات متوفرة بكميات كافية.</p>
              </div>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={prod.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900 line-clamp-1">{prod.title}</p>
                      <span className="text-[11px] text-stone-400 font-mono-num">{prod.sku}</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="font-mono-num font-bold text-rose-600 text-xs px-2 py-0.5 bg-rose-50 rounded border border-rose-100 block">
                      متبقي: {prod.stock} قطع
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function getStatusArabic(status: OrderStatus): string {
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
  }
}

function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    case 'confirmed':
      return 'bg-blue-50 text-blue-800 border border-blue-200';
    case 'shipping':
      return 'bg-purple-50 text-purple-800 border border-purple-200';
    case 'delivered':
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    case 'cancelled':
      return 'bg-rose-50 text-rose-800 border border-rose-200';
  }
}
