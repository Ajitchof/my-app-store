import React from 'react';
import { ShoppingBag, Search, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StoreHeaderProps {
  onSearchClick: () => void;
  onCategorySelect: (category: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onSearchClick, onCategorySelect }) => {
  const { cartCount, setIsCartOpen, setIsOrderTrackerOpen, setActiveView } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800">
      {/* Top micro announcement bar */}
      <div className="bg-amber-600/90 text-stone-950 px-4 py-1.5 text-xs text-center font-medium tracking-wide">
        توصيل سريع مجاني في المغرب للطلبات فوق 500 د.م · الدفع عند الاستلام متاح لجميع المدن
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single clean text element */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl font-black tracking-tight text-white hover:text-amber-400 transition-colors shrink-0"
        >
          NadiBox<span className="text-amber-500">.ma</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => onCategorySelect('all')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            جميع المنتجات
          </button>
          <button
            onClick={() => onCategorySelect('boxes')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            الصناديق الحصرية
          </button>
          <button
            onClick={() => onCategorySelect('electronics')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            إلكترونيات ذكية
          </button>
          <button
            onClick={() => onCategorySelect('lifestyle')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            أسلوب حياة
          </button>
          <button
            onClick={() => setIsOrderTrackerOpen(true)}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>تتبع طلبي</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSearchClick}
            aria-label="البحث عن منتج"
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart action */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="سلة المشتريات"
            className="relative flex items-center gap-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">السلة</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center bg-amber-500 text-stone-950 text-xs font-bold w-5 h-5 rounded-full font-mono-num">
                {cartCount}
              </span>
            )}
          </button>

          {/* Switch to Admin Dashboard button */}
          <button
            onClick={() => setActiveView('admin')}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            title="الانتقال إلى لوحة تحكم التاجر لإدارة الطلبات والمخزون"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">لوحة التحكم</span>
            <span className="sm:hidden">الإدارة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
