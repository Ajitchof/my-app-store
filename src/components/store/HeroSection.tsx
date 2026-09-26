import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Truck } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onFeaturedClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onFeaturedClick }) => {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white py-12 md:py-20 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content - 7 cols */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              المتجر الرسمي المغربي · جودة معتمدة
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-stone-100 max-w-2xl">
              صناديق حصرية وتقنيات ذكية ترتقي بأسلوب حياتك اليومي
            </h1>

            <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-xl">
              نختار لك بعناية فائقة أفضل الأدوات المبتكرة وحزم الهدايا الفاخرة في المغرب. استمتع بتجربة تسوق سلسة مع الدفع عند الاستلام أو بالبطاقة البنكية وتوصيل مباشر لباب منزلك.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer text-sm md:text-base whitespace-nowrap"
              >
                <span>استكشف المنتجات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onFeaturedClick}
                className="px-6 py-3 border border-stone-700 hover:border-stone-500 bg-stone-900/60 hover:bg-stone-800 text-stone-200 font-medium rounded-lg transition-colors cursor-pointer text-sm md:text-base whitespace-nowrap"
              >
                صناديق NadiBox الحصرية
              </button>
            </div>

            {/* Key trust markers */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs sm:text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>توصيل 24/48 ساعة بالمغرب</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ضمان استبدال حقيقي 14 يوماً</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>منتجات أصلية مختبرة 100%</span>
              </div>
            </div>
          </div>

          {/* Focal Image - 5 cols */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900 aspect-16/10 lg:aspect-4/3 group">
              <img
                src="/src/assets/images/hero_nadibox_showcase_1790462608455.jpg"
                alt="تشكيلة NadiBox الفاخرة للصناديق والتقنيات الذكية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 text-stone-100 flex items-center justify-between text-xs backdrop-blur-md bg-stone-900/60 px-3 py-2 rounded-lg border border-stone-700/50">
                <span className="font-medium">تشكيلة ربيع 2026 الحصرية</span>
                <span className="text-amber-400 font-mono-num font-bold">متوفرة الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
