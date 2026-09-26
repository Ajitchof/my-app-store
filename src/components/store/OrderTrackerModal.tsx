import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

interface OrderTrackerModalProps {
  onClose: () => void;
  initialQuery?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ onClose, initialQuery = '' }) => {
  const { orders } = useStore();
  const [query, setQuery] = useState(initialQuery);
  const [foundOrder, setFoundOrder] = useState<Order | null>(() => {
    if (!initialQuery) return orders[0] || null;
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === initialQuery.toLowerCase() ||
          o.trackingNumber.toLowerCase() === initialQuery.toLowerCase() ||
          o.phone.includes(initialQuery)
      ) || null
    );
  });
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) {
      setFoundOrder(null);
      return;
    }

    const match = orders.find(
      (o) =>
        o.id.toLowerCase().includes(cleanQ) ||
        o.trackingNumber.toLowerCase().includes(cleanQ) ||
        o.phone.includes(cleanQ)
    );
    setFoundOrder(match || null);
  };

  const getStepStatus = (stepIndex: number, status: Order['status']) => {
    const statusRanks: Record<Order['status'], number> = {
      pending: 1,
      confirmed: 2,
      shipping: 3,
      delivered: 4,
      cancelled: 0,
    };
    const currentRank = statusRanks[status] || 1;
    if (status === 'cancelled') return 'cancelled';
    if (currentRank > stepIndex) return 'completed';
    if (currentRank === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold">تتبع حالة شحنتك المباشرة</h2>
              <p className="text-xs text-stone-400">تابع حركة طلبيتك من مستودعاتنا حتى باب بيتك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              أدخل رقم الطلب (مثال: NB-1094) أو رقم التتبع أو رقم هاتفك:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                dir="ltr"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="NB-1094 / TRK-MA-884210"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-100 font-mono-num"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>بحث</span>
              </button>
            </div>
          </form>

          {/* Results */}
          {foundOrder ? (
            <div className="space-y-6 pt-2">
              {/* Order quick overview */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-stone-400 block">رقم الطلب:</span>
                  <span className="font-bold text-stone-900 font-mono-num text-sm">#{foundOrder.id}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">رقم التتبع:</span>
                  <span className="font-mono-num font-bold text-amber-800">{foundOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">وجهة التسليم:</span>
                  <span className="font-semibold text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>{foundOrder.city.split(' ')[0]}</span>
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">المبلغ الإجمالي:</span>
                  <span className="font-mono-num font-bold text-stone-900">{foundOrder.total} د.م.</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider">
                  مراحل مسار الشحنة:
                </h4>

                <div className="relative pr-6 border-r-2 border-stone-200 space-y-6">
                  {/* Step 1 */}
                  <div className="relative">
                    <span
                      className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStepStatus(1, foundOrder.status) === 'completed' || getStepStatus(1, foundOrder.status) === 'current'
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      ✓
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-stone-900">تم تسجيل الطلب في المنظومة</p>
                      <p className="text-stone-500 text-[11px]">
                        تم استلام تفاصيل المنتجات وعنوان العميل بنجاح
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span
                      className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStepStatus(2, foundOrder.status) === 'completed'
                          ? 'bg-amber-500 text-stone-950'
                          : getStepStatus(2, foundOrder.status) === 'current'
                          ? 'bg-amber-500 text-stone-950 animate-pulse'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      2
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-stone-900">تأكيد الطلب وتجهيز الطرد</p>
                      <p className="text-stone-500 text-[11px]">
                        فحص الجودة وتغليف المنتجات في الصندوق الحصري الخاص بـ NadiBox
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span
                      className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStepStatus(3, foundOrder.status) === 'completed'
                          ? 'bg-amber-500 text-stone-950'
                          : getStepStatus(3, foundOrder.status) === 'current'
                          ? 'bg-amber-500 text-stone-950 animate-pulse ring-4 ring-amber-200'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      3
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-stone-900">مع مندوب شركة الشحن السريع</p>
                      <p className="text-stone-500 text-[11px]">
                        الطرد في طريقه إليك، سيقوم المندوب بالاتصال بك هاتفياً
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span
                      className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        foundOrder.status === 'delivered'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      4
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-stone-900">تم التسليم بنجاح</p>
                      <p className="text-stone-500 text-[11px]">
                        استلم العميل الطلبية وتمت المعاينة بنجاح
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-2 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-700 block mb-2">المنتجات في هذا الطلب:</span>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {foundOrder.items.map((it) => (
                    <div key={it.product.id} className="flex justify-between">
                      <span>• {it.product.title} (×{it.quantity})</span>
                      <span className="font-mono-num font-semibold">{it.product.price * it.quantity} د.م.</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searched ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              <p className="text-stone-800 font-semibold mb-1">لم يتم العثور على طلب مطابق</p>
              <p>يرجى التأكد من كتابة رقم الطلب بالشكل الصحيح أو رقم الهاتف المسجل.</p>
            </div>
          ) : (
            <div className="text-center py-6 text-stone-400 text-xs">
              يمكنك كتابة رقم الطلب مثل <strong>NB-1094</strong> أو رقم هاتفك للبحث عن تفاصيل شحنتك.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
