import React, { useState } from 'react';
import { Save, RotateCcw, ShieldCheck, Truck, MessageCircle, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../../data/mockData';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [emailContact, setEmailContact] = useState(settings.emailContact);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold.toString());
  const [standardShippingFee, setStandardShippingFee] = useState(settings.standardShippingFee.toString());

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      whatsappNumber,
      emailContact,
      freeShippingThreshold: parseFloat(freeShippingThreshold) || 500,
      standardShippingFee: parseFloat(standardShippingFee) || 35,
    });
  };

  const handleResetDemoData = () => {
    if (confirm('هل أنت متأكد من استعادة بيانات المتجر والطلبات الأولية؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-6 text-right">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <h2 className="text-xl font-black text-stone-900 mb-1">إعدادات متجر NadiBox.ma</h2>
        <p className="text-xs text-stone-500">
          تعديل تسعيرة الشحن للمدن المغربية، أرقام التواصل عبر الواتساب، والبيانات العامة للمتجر.
        </p>

        <form onSubmit={handleSaveSettings} className="mt-6 space-y-6 text-xs">
          {/* General Store Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-800 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-600" />
              <span>هوية المتجر والتواصل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">اسم المتجر</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رقم خدمة العملاء بالواتساب</label>
                <input
                  type="text"
                  dir="ltr"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+212 661 234567"
                  className="w-full px-3.5 py-2.5 border rounded-xl text-right font-mono-num"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">شعار المتجر (Tagline)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">البريد الإلكتروني للطلبات</label>
                <input
                  type="email"
                  dir="ltr"
                  value={emailContact}
                  onChange={(e) => setEmailContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-right"
                />
              </div>
            </div>
          </div>

          {/* Shipping Rules */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-stone-800 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>تسعيرة التوصيل للمدن المغربية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  الحد الأدنى للشحن المجاني (د.م.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono-num"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  الطلبات التي تزيد عن هذا المبلغ تحصل على توصيل مجاني تلقائياً.
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  سعر التوصيل القياسي لباقي الطلبات (د.م.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={standardShippingFee}
                  onChange={(e) => setStandardShippingFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono-num"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  تكلفة الشحن لجميع المدن المغربية عند عدم بلوغ الحد الأدنى.
                </p>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 flex items-center justify-between border-t border-stone-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>

            <button
              type="button"
              onClick={handleResetDemoData}
              className="px-4 py-2 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية للمتجر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
