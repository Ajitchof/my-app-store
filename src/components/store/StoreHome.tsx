import React, { useState, useMemo } from 'react';
import { HeroSection } from './HeroSection';
import { ProductCard } from './ProductCard';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { SlidersHorizontal, Sparkles, Shield, Truck, Package, MessageCircle } from 'lucide-react';

interface StoreHomeProps {
  onQuickView: (product: Product) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const StoreHome: React.FC<StoreHomeProps> = ({
  onQuickView,
  selectedCategory,
  onCategoryChange,
}) => {
  const { products, settings, setIsCartOpen } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <HeroSection
        onExploreClick={scrollToCatalog}
        onFeaturedClick={() => {
          onCategoryChange('boxes');
          scrollToCatalog();
        }}
      />

      {/* Main Catalog Section */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header & Interactive Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-600 font-bold block mb-1">
                التشكيلة الحصرية
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                أحدث المنتجات والصناديق المتوفرة
              </h2>
            </div>

            {/* Sorting dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-stone-400" />
              <span className="text-stone-500 font-medium">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-700 focus:outline-hidden focus:border-amber-600 cursor-pointer"
              >
                <option value="featured">المميز والأكثر طلباً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Functional buttons with active states) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              جميع المنتجات ({products.length})
            </button>
            <button
              onClick={() => onCategoryChange('boxes')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'boxes'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              صناديق حصرية ({products.filter((p) => p.category === 'boxes').length})
            </button>
            <button
              onClick={() => onCategoryChange('electronics')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'electronics'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              إلكترونيات ذكية ({products.filter((p) => p.category === 'electronics').length})
            </button>
            <button
              onClick={() => onCategoryChange('lifestyle')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'lifestyle'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              أسلوب حياة ({products.filter((p) => p.category === 'lifestyle').length})
            </button>
            <button
              onClick={() => onCategoryChange('workplace')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'workplace'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              إكسسوارات العمل ({products.filter((p) => p.category === 'workplace').length})
            </button>
          </div>
        </div>

        {/* Product Grid - 3 cols desktop, 2 cols tablet, 1 col mobile */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Package className="w-12 h-12 mx-auto text-stone-300 mb-3" />
            <h3 className="text-base font-bold text-stone-800">لا توجد منتجات في هذا التصنيف حالياً</h3>
            <p className="text-xs text-stone-500 mt-1">يرجى اختيار تصنيف آخر أو العودة لجميع المنتجات.</p>
            <button
              onClick={() => onCategoryChange('all')}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* Moroccan Commerce Story & Trust Section */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 6 Cols Visual */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 aspect-16/10">
              <img
                src="/src/assets/images/product_luxury_tech_pack_1790462632624.jpg"
                alt="تغليف وتجهيز صناديق NadiBox الفاخرة بالمغرب"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/20" />
            </div>

            {/* 6 Cols Story */}
            <div className="lg:col-span-6 space-y-4 text-right">
              <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">
                لماذا يفضل المغاربة التسوق من NadiBox؟
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                تجربة تسوق رقمية استثنائية مصممة خصيصاً للزبون المغربي
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                في <strong>NadiBox.ma</strong>، لا نقدم مجرد منتجات عادية، بل نبتكر حزم هدايا وصناديق متكاملة تجمع بين الأناقة والعملية. نفهم تماماً احتياجات المتسوق المغربي؛ لذلك وفرنا لك خيار الدفع عند الاستلام مع إمكانية فحص الطرد أولاً، أو الدفع السريع والآمن ببطاقتك البنكية عبر أحدث بروتوكولات الأمان.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                  <div className="font-bold text-stone-900 text-sm mb-0.5">24 - 48 ساعة</div>
                  <div className="text-stone-500">مدة التوصيل المتوسطة لمعظم مدن المملكة</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                  <div className="font-bold text-stone-900 text-sm mb-0.5">14 يوماً</div>
                  <div className="text-stone-500">ضمان استبدال مباشر في حال وجود أي ملاحظة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
