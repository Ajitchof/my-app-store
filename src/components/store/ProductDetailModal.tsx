import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Shield, Truck, RotateCcw, MessageCircle, Heart, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onBuyNow }) => {
  const { addToCart, toggleWishlist, isInWishlist, settings } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const currentImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = currentImages[selectedImageIndex] || product.image;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `السلام عليكم NadiBox، أود طلب المنتج التالي:\n- اسم المنتج: ${product.title}\n- السعر: ${product.price} د.م.\n- الكمية: ${quantity}\n- الرمز: ${product.sku}\nيرجى تأكيد التوفر وإرسال تفاصيل التوصيل. شكراً!`
    );
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Gallery Column */}
          <div className="p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-l border-stone-200">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-stone-200/80 shadow-xs">
                {!imageError ? (
                  <img
                    src={activeImage}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-6">
                    <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300 mb-2" />
                    <span className="text-sm font-medium">{product.title}</span>
                  </div>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="حفظ في المفضلة"
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-stone-600 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails if multiple */}
              {currentImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-600/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="mt-6 pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-2 text-center text-xs text-stone-600">
              <div className="p-2 bg-white rounded-lg border border-stone-100">
                <Truck className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <span>شحن لكافة المدن</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-100">
                <Shield className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <span>ضمان أصل 100%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-100">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <span>استبدال 14 يوماً</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-stone-700">{product.categoryName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{product.sku}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold font-mono-num">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal">({product.reviewsCount} تقييم)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-950 leading-snug">
                  {product.title}
                </h2>
                <p className="text-stone-500 text-sm mt-1">{product.subtitle}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-stone-100">
                <span className="text-3xl font-extrabold text-stone-950 font-mono-num">
                  {product.price} <span className="text-sm font-semibold text-stone-600">د.م. (MAD)</span>
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-stone-400 line-through text-base font-mono-num">
                    {product.originalPrice} د.م.
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-emerald-700 text-xs font-bold">
                    وفرت {product.originalPrice - product.price} د.م.
                  </span>
                )}
              </div>

              {/* Stock status indicator */}
              <div className="text-xs">
                {product.stock > 5 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>متوفر في المستودع وجاهز للشحن الفوري</span>
                  </span>
                ) : product.stock > 0 ? (
                  <span className="text-amber-800 font-bold flex items-center gap-1.5">
                    <span>تنبيه: متبقي فقط {product.stock} قطع في المخزون!</span>
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold">
                    عذراً، انتهت الكمية مؤقتاً لهذا المنتج
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold uppercase text-stone-900 tracking-wider">مميزات المنتج:</h4>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold shrink-0">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase text-stone-900 tracking-wider mb-2">المواصفات التقنية:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="bg-stone-50 p-2 rounded border border-stone-200/60">
                        <span className="text-stone-400 block text-[10px]">{spec.label}</span>
                        <span className="font-semibold text-stone-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contiguous Purchase Module */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-800">الكمية المطلوبة:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1.5 hover:bg-stone-100 text-stone-700 font-bold disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold font-mono-num min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-1.5 hover:bg-stone-100 text-stone-700 font-bold disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onBuyNow(product, quantity)}
                  disabled={isOutOfStock}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:text-stone-400 text-stone-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>شراء الآن والدفع لاحقاً</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>إضافة إلى السلة</span>
                </button>
              </div>

              {/* Quick WhatsApp order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>طلب سريع وتأكيد فوري عبر الواتساب ({settings.whatsappNumber})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
