import React from 'react';
import { X, Trash2, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    settings,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-right animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-stone-900">سلة المشتريات</h2>
            <span className="text-xs text-stone-500 font-mono-num">({cart.length} منتجات)</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="إغلاق السلة"
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Gauge */}
        <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100 text-xs text-stone-700">
          {remainingForFreeShipping > 0 ? (
            <p>
              أضف منتجات بقيمة{' '}
              <strong className="text-amber-800 font-mono-num font-bold">
                {remainingForFreeShipping} د.م.
              </strong>{' '}
              للحصول على <strong>شحن مجاني</strong> إلى باب بيتك!
            </p>
          ) : (
            <p className="text-emerald-700 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>مبروك! لقد حصلت على توصيل مجاني لطلبك.</span>
            </p>
          )}

          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 ${
                remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300 mb-3" />
              <p className="text-stone-600 font-medium mb-1">سلة مشترياتك فارغة حالياً</p>
              <p className="text-xs text-stone-400 max-w-xs mb-6">
                استكشف مجموعتنا المميزة من الصناديق الحصرية والتقنيات الذكية وأضف ما يعجبك.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 pb-4 border-b border-stone-100 items-start justify-between"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between h-20 text-xs">
                  <div>
                    <h4 className="font-bold text-stone-900 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <span className="text-stone-400 text-[11px] block mt-0.5">
                      {item.product.categoryName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-stone-950 font-mono-num text-sm">
                      {item.product.price * item.quantity} د.م.
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-stone-100 text-stone-600 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono-num text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-0.5 hover:bg-stone-100 text-stone-600 font-bold disabled:opacity-40 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  aria-label="حذف المنتج من السلة"
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-mono-num font-semibold text-stone-900">
                  {cartSubtotal} د.م.
                </span>
              </div>
              <div className="flex justify-between">
                <span>تكلفة الشحن:</span>
                <span className="font-mono-num font-semibold">
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700">مجاني (0 د.م.)</span>
                  ) : (
                    <span>{settings.standardShippingFee} د.م.</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>المجموع الإجمالي التقريبي:</span>
                <span className="font-mono-num text-base text-amber-700">
                  {cartSubtotal + (remainingForFreeShipping === 0 ? 0 : settings.standardShippingFee)} د.م.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
            >
              <span>متابعة الطلب والدفع الآمن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-stone-400 text-center">
              الدفع عند الاستلام متاح أو بالبطاقة البنكية المغربية مع تشفير 3D Secure
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
