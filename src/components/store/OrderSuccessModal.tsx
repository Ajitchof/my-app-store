import React from 'react';
import { CheckCircle2, Printer, ShieldCheck, ArrowRight, MessageCircle, MapPin, Phone, PackageCheck } from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onTrackOrder }) => {
  const { settings } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `مرحباً NadiBox، لدي استفسار بخصوص طلبي رقم #${order.id} (رقم التتبع: ${order.trackingNumber}) باسم ${order.customerName}.`
    );
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 my-8 print:m-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="p-6 bg-emerald-600 text-white flex flex-col items-center text-center">
          <div className="p-3 bg-white/20 rounded-full mb-3">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">تهانينا! تم تسجيل طلبك بنجاح</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
            شكراً لثقتك في NadiBox.ma. جاري تجهيز طلبيتك وسيتم التواصل معك هاتفياً لتأكيد الشحن والتوصيل.
          </p>

          <div className="mt-4 px-4 py-2 bg-emerald-700/80 rounded-xl flex items-center gap-3 text-xs font-mono-num font-bold">
            <span>رقم الطلب: #{order.id}</span>
            <span>·</span>
            <span>رقم التتبع: {order.trackingNumber}</span>
          </div>
        </div>

        {/* Printable Invoice & Order Details */}
        <div className="p-6 space-y-6">
          {/* Top Invoice Metadata */}
          <div className="flex justify-between items-start pb-4 border-b border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block">تاريخ ووقت الطلب:</span>
              <span className="font-semibold font-mono-num text-stone-800">
                {new Date(order.createdAt).toLocaleDateString('ar-MA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="text-left">
              <span className="text-stone-400 block">وسيلة الدفع:</span>
              <span className="font-semibold text-stone-800">
                {order.paymentMethod === 'cod'
                  ? 'الدفع نقداً عند الاستلام (COD)'
                  : order.paymentMethod === 'card'
                  ? 'بطاقة بنكية (مدفوع إلكترونياً ✓)'
                  : 'تأكيد عبر الواتساب'}
              </span>
            </div>
          </div>

          {/* Delivery Coordinates */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>عنوان ووجهة التسليم:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
              <div>
                <span className="text-stone-400">اسم العميل:</span> {order.customerName}
              </div>
              <div>
                <span className="text-stone-400">رقم الهاتف:</span>{' '}
                <span dir="ltr" className="font-mono-num font-semibold">
                  {order.phone}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-stone-400">المدينة والعنوان:</span> {order.city} - {order.address}
              </div>
              {order.notes && (
                <div className="sm:col-span-2 text-amber-900">
                  <span className="text-stone-400">ملاحظات العميل:</span> {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h4 className="font-bold text-xs uppercase text-stone-900 tracking-wider mb-2 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-amber-600" />
              <span>المنتجات المطلوبة:</span>
            </h4>
            <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden">
              {order.items.map((item) => (
                <div key={item.product.id} className="p-3 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono-num bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                      {item.quantity}×
                    </span>
                    <span className="font-medium text-stone-900">{item.product.title}</span>
                  </div>
                  <span className="font-bold font-mono-num text-stone-900">
                    {item.product.price * item.quantity} د.م.
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-3 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-mono-num font-semibold">{order.subtotal} د.م.</span>
              </div>
              <div className="flex justify-between">
                <span>مصاريف الشحن:</span>
                <span className="font-mono-num font-semibold">
                  {order.shippingFee === 0 ? 'شحن مجاني (0 د.م.)' : `${order.shippingFee} د.م.`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                <span>الإجمالي النهائي المستحق:</span>
                <span className="font-mono-num text-amber-700 text-lg">
                  {order.total} د.م.
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة بوليصة الشحن والفاتورة</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTrackOrder();
              }}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تتبع مسار الطلب لحظة بلحظة</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 print:hidden text-xs">
            <button
              onClick={handleWhatsAppHelp}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>هل تحتاج مساعدة؟ تحدث معنا عبر الواتساب</span>
            </button>

            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>العودة للتسوق</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
