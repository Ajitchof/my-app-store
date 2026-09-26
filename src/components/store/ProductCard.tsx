import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [imageError, setImageError] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Area - 65% height */}
      <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-100 text-stone-400 text-center">
            <ShoppingBag className="w-10 h-10 mb-2 stroke-1 text-stone-300" />
            <span className="text-xs">{product.title}</span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="إضافة للمفضلة"
          className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-xs hover:bg-white text-stone-600 hover:text-red-500 transition-colors cursor-pointer z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick view button on hover */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <span className="px-3 py-1.5 bg-stone-900/90 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>نظرة سريعة</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 text-right">
        <div className="space-y-1.5">
          {/* Unboxed Metadata (Zero-Pill Rule) */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <span>{product.categoryName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">SKU: {product.sku}</span>
            </div>

            {/* Quiet stock alert if low */}
            {isLowStock && (
              <span className="text-amber-700 font-medium flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3 h-3" />
                <span>متبقي {product.stock} فقط</span>
              </span>
            )}
            {isOutOfStock && (
              <span className="text-rose-700 font-medium text-[11px]">
                نفد من المخزون
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-950 font-mono-num">
              {product.price} <span className="text-xs font-normal text-stone-600">د.م.</span>
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono-num">
                {product.originalPrice} د.م.
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`إضافة ${product.title} إلى السلة`}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة</span>
              </>
            ) : isOutOfStock ? (
              <span>غير متاح</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
