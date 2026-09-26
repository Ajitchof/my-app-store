import React from 'react';
import { ShieldCheck, Truck, RotateCcw, MessageCircle, LayoutDashboard, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const StoreFooter: React.FC = () => {
  const { settings, setActiveView, setIsOrderTrackerOpen } = useStore();

  const handleWhatsAppContact = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent('السلام عليكم فريق NadiBox، لدي استفسار عن خدماتكم ومنتجاتكم.')}`, '_blank');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-right">
      {/* Guarantees Strip */}
      <div className="border-b border-stone-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-stone-800 rounded-xl text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">توصيل سريع لجميع المدن</h4>
                <p className="text-stone-400 leading-relaxed">
                  توصيل آمن إلى باب منزلك في الدار البيضاء، الرباط، مراكش، طنجة وباقي ربوع المملكة.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-stone-800 rounded-xl text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">دفع موثوق عند الاستلام</h4>
                <p className="text-stone-400 leading-relaxed">
                  افحص طلبيتك وتأكد منها تماماً قبل سداد المبلغ أو ادفع بأمان عبر بطاقتك البنكية.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-stone-800 rounded-xl text-amber-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">ضمان استبدال حقيقي</h4>
                <p className="text-stone-400 leading-relaxed">
                  ضمان 14 يوماً للاستبدال الفوري في حال وجود أي عيب مصنعي بدون أي تعقيدات.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-stone-800 rounded-xl text-amber-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">خدمة عملاء عبر الواتساب</h4>
                <p className="text-stone-400 leading-relaxed">
                  فريقنا متواجد 7/7 للإجابة على استفساراتكم ومتابعة طلباتكم مباشرة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-2xl font-black text-white">
              NadiBox<span className="text-amber-500">.ma</span>
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              {settings.tagline}
            </p>
            <div className="pt-2">
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب: {settings.whatsappNumber}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">روابط المتجر</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  أحدث الصناديق الحصرية
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  الإلكترونيات والملحقات الذكية
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsOrderTrackerOpen(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-right"
                >
                  تتبع الشحنة المباشر
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  سياسة الاستبدال والضمان
                </a>
              </li>
            </ul>
          </div>

          {/* Morocco Delivery Cities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">التوصيل بالمغرب</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              نوصل إلى الدار البيضاء، الرباط، طنجة، مراكش، فاس، مكناس، أكادير، وجدة، تطوان، القنيطرة، وجميع المدن والقرى المغربية خلال 24 إلى 48 ساعة.
            </p>
            <div className="pt-2 text-xs text-amber-400 font-medium">
              شحن مجاني لكل سلة تتجاوز {settings.freeShippingThreshold} د.م.
            </div>
          </div>

          {/* Merchant / Admin Control */}
          <div className="space-y-3 p-4 bg-stone-800/60 rounded-xl border border-stone-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>لوحة تحكم المتجر</span>
            </h4>
            <p className="text-xs text-stone-400">
              إدارة الطلبات الجديدة، تعديل المخزون والمنتجات، ومتابعة مؤشرات المبيعات.
            </p>
            <button
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              فتح لوحة التحكم (Admin)
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} NadiBox.ma - جميع الحقوق محفوظة لمتجر نادي بوكس المغرب.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>دفع آمن CMI / Visa / Cash on Delivery</span>
            <span>·</span>
            <span>صُنع بحب في المغرب 🇲🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
