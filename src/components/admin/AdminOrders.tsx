import React, { useState } from 'react';
import { Search, Filter, Printer, MessageCircle, Eye, Phone, MapPin, CheckCircle2, Clock, Truck, XCircle, ArrowUpDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersProps {
  initialSelectedOrderId?: string | null;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ initialSelectedOrderId }) => {
  const { orders, updateOrderStatus, settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialSelectedOrderId) {
      return orders.find((o) => o.id === initialSelectedOrderId) || null;
    }
    return null;
  });

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      order.id.toLowerCase().includes(cleanSearch) ||
      order.customerName.toLowerCase().includes(cleanSearch) ||
      order.phone.includes(cleanSearch) ||
      order.city.toLowerCase().includes(cleanSearch) ||
      order.trackingNumber.toLowerCase().includes(cleanSearch);
    return matchesStatus && matchesSearch;
  });

  const handlePrintSlip = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleOpenWhatsApp = (order: Order) => {
    const cleanCustomerPhone = order.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanCustomerPhone.startsWith('0')
      ? '212' + cleanCustomerPhone.substring(1)
      : cleanCustomerPhone;
    const msg = encodeURIComponent(
      `السلام عليكم أخي/أختي ${order.customerName}، معك فريق متجر NadiBox.ma بخصوص طلبك رقم #${order.id} بمبلغ ${order.total} د.م. نود تأكيد العنوان وموعد التسليم المناسب لك في مدينة ${order.city}.`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">إدارة ومتابعة طلبات الزبائن</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              متابعة الشحنات لجميع المدن المغربية وتحديث حالات التسليم والطباعة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">إجمالي الطلبات المسجلة:</span>
            <span className="px-2.5 py-1 bg-stone-100 text-stone-900 rounded-lg text-xs font-bold font-mono-num">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Status Tabs (Interactive controls allowed as buttons) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              قيد المراجعة ({orders.filter((o) => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'confirmed'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              مؤكد ({orders.filter((o) => o.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('shipping')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'shipping'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جاري الشحن ({orders.filter((o) => o.status === 'shipping').length})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'delivered'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              تم التسليم ({orders.filter((o) => o.status === 'delivered').length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم، المدينة، الهاتف، رقم الطلب..."
              className="w-full pr-9 pl-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-200 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">رقم الطلب والتاريخ</th>
                <th className="py-3 px-4">الزبون والهاتف</th>
                <th className="py-3 px-4">المدينة المغربية</th>
                <th className="py-3 px-4">المنتجات المطلوبة</th>
                <th className="py-3 px-4">المبلغ المستحق</th>
                <th className="py-3 px-4">حالة الطلب الحالية</th>
                <th className="py-3 px-4 text-center">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    لم يتم العثور على أي طلب يطابق الفلتر الحالي.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono-num font-bold text-stone-900 block text-sm">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono-num block">
                        {new Date(order.createdAt).toLocaleDateString('ar-MA', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] text-amber-700 font-mono-num">
                        {order.trackingNumber}
                      </span>
                    </td>

                    {/* Customer & Phone */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{order.customerName}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span dir="ltr" className="text-stone-500 font-mono-num text-[11px]">
                          {order.phone}
                        </span>
                        <button
                          onClick={() => handleOpenWhatsApp(order)}
                          title="مراسلة الزبون على الواتساب"
                          className="p-1 hover:bg-emerald-50 text-emerald-600 rounded transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{order.city.split(' ')[0]}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block line-clamp-1 max-w-[150px]">
                        {order.address}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {order.items.map((it) => (
                          <div key={it.product.id} className="text-[11px] text-stone-700 line-clamp-1">
                            <span className="font-mono-num font-bold text-stone-900">{it.quantity}×</span>{' '}
                            {it.product.title}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono-num font-extrabold text-stone-950 text-sm block">
                        {order.total} د.م.
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {order.paymentMethod === 'cod' ? 'عند الاستلام' : 'بطاقة CMI'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-hidden cursor-pointer ${getStatusDropdownClass(
                          order.status
                        )}`}
                      >
                        <option value="pending">قيد المراجعة</option>
                        <option value="confirmed">تم التأكيد</option>
                        <option value="shipping">جاري الشحن</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="عرض تفاصيل الطلب"
                          className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintSlip(order)}
                          title="طباعة بوليصة الشحن"
                          className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Order Detailed Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
          <div
            className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-8 print:m-0 print:border-none print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  تفاصيل وبوليصة الطلب #{selectedOrder.id}
                </h3>
                <p className="text-xs text-stone-500 font-mono-num">
                  تاريخ التسجيل: {new Date(selectedOrder.createdAt).toLocaleString('ar-MA')}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 hover:bg-stone-100 text-stone-500 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="my-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</span>
                <button
                  onClick={() => handleOpenWhatsApp(selectedOrder)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold text-[11px] flex items-center gap-1 cursor-pointer print:hidden"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب الزبون</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-600 pt-1">
                <div>
                  <span className="text-stone-400">الهاتف:</span>{' '}
                  <span dir="ltr" className="font-mono-num font-bold">
                    {selectedOrder.phone}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400">المدينة:</span> {selectedOrder.city}
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400">العنوان:</span> {selectedOrder.address}
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2 text-amber-800">
                    <span className="text-stone-400">الملاحظات:</span> {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-800">المنتجات:</h4>
              <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it) => (
                  <div key={it.product.id} className="p-2.5 flex items-center justify-between text-xs bg-white">
                    <span>
                      <strong className="font-mono-num">{it.quantity}×</strong> {it.product.title}
                    </span>
                    <span className="font-mono-num font-bold">{it.product.price * it.quantity} د.م.</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span className="font-mono-num">{selectedOrder.shippingFee} د.م.</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-950 pt-1 border-t border-stone-200">
                  <span>المبلغ الواجب تحصيله من الزبون:</span>
                  <span className="font-mono-num text-amber-700 text-base">{selectedOrder.total} د.م.</span>
                </div>
              </div>
            </div>

            {/* Status change within modal */}
            <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between text-xs print:hidden">
              <span className="font-semibold text-stone-700">تغيير حالة الطلب:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStat = e.target.value as OrderStatus;
                  updateOrderStatus(selectedOrder.id, newStat);
                  setSelectedOrder({ ...selectedOrder, status: newStat });
                }}
                className="px-3 py-1.5 border rounded-lg font-bold"
              >
                <option value="pending">قيد المراجعة</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="shipping">جاري الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getStatusDropdownClass(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'border-amber-300 bg-amber-50 text-amber-900';
    case 'confirmed':
      return 'border-blue-300 bg-blue-50 text-blue-900';
    case 'shipping':
      return 'border-purple-300 bg-purple-50 text-purple-900';
    case 'delivered':
      return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    case 'cancelled':
      return 'border-rose-300 bg-rose-50 text-rose-900';
  }
}
