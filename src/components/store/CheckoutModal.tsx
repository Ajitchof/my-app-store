import React, { useState } from 'react';
import { X, CreditCard, Banknote, ShieldCheck, Lock, CheckCircle2, AlertCircle, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MOROCCAN_CITIES } from '../../data/mockData';
import { CartItem, PaymentMethod } from '../../types';

interface CheckoutModalProps {
  directItem?: { product: any; quantity: number } | null;
  onClose: () => void;
  onOrderSuccess: (order: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ directItem, onClose, onOrderSuccess }) => {
  const { cart, cartSubtotal, settings, createOrder, showToast } = useStore();

  // Active items for checkout
  const checkoutItems: CartItem[] = directItem
    ? [{ product: directItem.product, quantity: directItem.quantity }]
    : cart;

  const currentSubtotal = directItem
    ? directItem.product.price * directItem.quantity
    : cartSubtotal;

  const isFreeShipping = currentSubtotal >= settings.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : settings.standardShippingFee;
  const totalAmount = currentSubtotal + shippingFee;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'يرجى إدخال الاسم الكامل';
    }
    if (!phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف المغربي';
    } else if (!/^(0[5-7]|(\+212[5-7]))[0-9]{8}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'يرجى كتابة رقم مغربي صالح (مثال: 0661234567)';
    }
    if (!address.trim()) {
      newErrors.address = 'يرجى إدخال عنوان التسليم بالتفصيل';
    }

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        newErrors.cardNumber = 'رقم البطاقة غير صحيح (16 رقماً)';
      }
      if (!cardHolder.trim()) {
        newErrors.cardHolder = 'اسم حامل البطاقة مطلوب';
      }
      if (expiry.length < 5) {
        newErrors.expiry = 'تاريخ الانتهاء غير مكتمل (MM/YY)';
      }
      if (cvv.length < 3) {
        newErrors.cvv = 'رمز CVV غير مكتمل';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setExpiry(raw);
    }
  };

  const executeOrderCreation = (isCardPaid: boolean) => {
    const newOrder = createOrder({
      customerName,
      phone,
      email: email || undefined,
      city,
      address,
      notes: notes || undefined,
      items: checkoutItems,
      subtotal: currentSubtotal,
      shippingFee,
      total: totalAmount,
      paymentMethod,
      paymentStatus: isCardPaid ? 'paid' : 'pending',
      status: 'pending',
    });

    onOrderSuccess(newOrder);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('يرجى التحقق من صحة البيانات المدخلة', 'error');
      return;
    }

    if (paymentMethod === 'whatsapp') {
      // Direct WhatsApp Order
      const itemsList = checkoutItems
        .map((i) => `• ${i.product.title} (الكمية: ${i.quantity}) - ${i.product.price * i.quantity} د.م`)
        .join('\n');
      const text = encodeURIComponent(
        `السلام عليكم NadiBox.ma،\nأود تأكيد طلبي بالمعلومات التالية:\n\n👤 الاسم: ${customerName}\n📞 الهاتف: ${phone}\n📍 المدينة: ${city}\n🏠 العنوان: ${address}\n\n📦 تفاصيل المنتجات:\n${itemsList}\n\n💰 المجموع الإجمالي: ${totalAmount} د.م (${isFreeShipping ? 'شحن مجاني' : `شحن: ${shippingFee} د.م`})\n💳 وسيلة الدفع: الدفع عند الاستلام (COD)\n\nيرجى تأكيد الشحن شكراً!`
      );
      const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
      executeOrderCreation(false);
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
      return;
    }

    if (paymentMethod === 'card') {
      // Simulate CMI / 3D Secure verification flow
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setShowOtpModal(true);
      }, 1200);
      return;
    }

    // COD order
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      executeOrderCreation(false);
    }, 600);
  };

  const handleConfirmOtp = () => {
    if (otpCode.length < 4) {
      showToast('رمز التحقق يجب أن يتكون من 4 أرقام على الأقل', 'error');
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowOtpModal(false);
      executeOrderCreation(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold">إتمام الطلب والدفع الآمن</h2>
              <p className="text-xs text-stone-400">تشفير عالي 256-bit وحماية لمعلوماتك الشخصية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إلغاء وإغلاق"
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Customer Information (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-200 flex items-center gap-2">
                <span>1. معلومات المستلم وعنوان التوصيل</span>
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: يوسف الإدريسي"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    errors.customerName
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-stone-300 focus:border-amber-600 focus:ring-amber-100'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.customerName}</span>
                  </p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    رقم الهاتف المغربي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0661234567"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-right focus:outline-hidden focus:ring-2 transition-all font-mono-num ${
                      errors.phone
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-stone-300 focus:border-amber-600 focus:ring-amber-100'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-rose-600 text-[11px] mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-100 text-right"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  المدينة المغربية <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  العنوان بالتفصيل (الحي، الشارع، رقم المنزل/العمارة) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: المعاريف، زنقة جابر بن حيان، إقامة السلام رقم 14"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    errors.address
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-stone-300 focus:border-amber-600 focus:ring-amber-100'
                  }`}
                />
                {errors.address && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>
                )}
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  ملاحظات إضافية للتوصيل (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: يرجى التوصيل بعد الساعة الرابعة مساءً"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-amber-600"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-200 mb-3">
                  2. طريقة الدفع المفضلة
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* COD */}
                  <label
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span>الدفع نقداً عند الاستلام (COD)</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          لا تدفع درهماً واحداً حتى تستلم طلبيتك وتفحصها بين يديك
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      الأكثر طلباً
                    </span>
                  </label>

                  {/* Card / CMI */}
                  <label
                    className={`relative flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-amber-600 focus:ring-amber-500 mt-1"
                      />
                      <div>
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>البطاقة البنكية المغربية أو الدولية (CMI / Visa / MC)</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          دفع إلكتروني فوري وآمن 100% مع تأكيد الرمز السري من بنكك (3D Secure)
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* WhatsApp Direct */}
                  <label
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={() => setPaymentMethod('whatsapp')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>تأكيد الطلب مباشرة عبر الواتساب</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          تواصل فوري مع فريق المبيعات لتأكيد العنوان وحجز الطلب
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Simulated Moroccan Card Input Module */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-stone-800">بيانات بطاقة الدفع (CMI / Visa / Mastercard):</span>
                      <div className="flex gap-1.5 font-mono text-[10px] text-stone-400">
                        <span>CMI</span>
                        <span>·</span>
                        <span>VISA</span>
                        <span>·</span>
                        <span>MASTERCARD</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        رقم البطاقة (16 رقماً)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num focus:outline-hidden focus:border-amber-600 bg-white"
                      />
                      {errors.cardNumber && (
                        <p className="text-rose-600 text-[10px] mt-0.5">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          تاريخ الانتهاء
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num focus:outline-hidden focus:border-amber-600 bg-white"
                        />
                        {errors.expiry && (
                          <p className="text-rose-600 text-[10px] mt-0.5">{errors.expiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          رمز الأمان CVV
                        </label>
                        <input
                          type="password"
                          dir="ltr"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num focus:outline-hidden focus:border-amber-600 bg-white"
                        />
                        {errors.cvv && (
                          <p className="text-rose-600 text-[10px] mt-0.5">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        اسم حامل البطاقة كما هو مكتوب عليها
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="YOUSSEF EL IDRISSI"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm uppercase focus:outline-hidden focus:border-amber-600 bg-white"
                      />
                      {errors.cardHolder && (
                        <p className="text-rose-600 text-[10px] mt-0.5">{errors.cardHolder}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Column (5 Cols) */}
            <div className="md:col-span-5 bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-200">
                  ملخص طلبيتك ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)} قطعة)
                </h3>

                {/* Items preview */}
                <div className="divide-y divide-stone-200 max-h-48 overflow-y-auto mt-2">
                  {checkoutItems.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.image}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 line-clamp-1">{item.product.title}</p>
                          <span className="text-stone-400 font-mono-num">كمية: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold font-mono-num text-stone-800 shrink-0">
                        {item.product.price * item.quantity} د.م.
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono-num font-semibold text-stone-900">{currentSubtotal} د.م.</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span>رسوم التوصيل لـ {city.split(' ')[0]}:</span>
                    </span>
                    <span className="font-mono-num font-semibold">
                      {isFreeShipping ? (
                        <span className="text-emerald-700 font-bold">مجاني (0 د.م.)</span>
                      ) : (
                        <span>{shippingFee} د.م.</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-stone-950 pt-2 border-t border-stone-200">
                    <span>المجموع الصافي للدفع:</span>
                    <span className="font-mono-num text-amber-700 text-lg">
                      {totalAmount} د.م.
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees & Submit */}
              <div className="space-y-3 pt-3">
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تسليم مضمون حتى باب المنزل مع المعاينة قبل الدفع</span>
                  </div>
                  <p>تتم معالجة الطلبات خلال 2-4 ساعات في أوقات العمل الرسمية.</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 text-stone-950 font-extrabold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>جاري المعالجة الآمنة...</span>
                    </div>
                  ) : paymentMethod === 'whatsapp' ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>إتمام الطلب عبر الواتساب الآن</span>
                    </>
                  ) : paymentMethod === 'card' ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>متابعة الدفع بالبطاقة ({totalAmount} د.م.)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأكيد الطلب والدفع عند الاستلام ({totalAmount} د.م.)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Simulated 3D Secure / Moroccan Bank OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-60 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <div className="text-center pb-4 border-b border-stone-200">
              <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-600 mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">تأكيد الأمان المصرفي 3D Secure</h3>
              <p className="text-xs text-stone-500 mt-1">
                مركز النقديات المغربي CMI · تأكيد المعاملة المالية
              </p>
            </div>

            <div className="py-4 space-y-3 text-xs text-stone-600">
              <p>
                تم إرسال رمز أمان لمرة واحدة (SMS OTP) إلى هاتفك المسجل لدى البنك لتأكيد خصم مبلغ{' '}
                <strong className="text-stone-900 font-mono-num">{totalAmount} د.م.</strong> لصالح متجر NadiBox.ma.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  أدخل رمز التحقق (للتجربة أدخل: 1234):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1234"
                  className="w-full text-center text-lg font-bold tracking-widest py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmOtp}
                disabled={isProcessingPayment}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {isProcessingPayment ? 'جاري التأكيد مع البنك...' : 'تأكيد الدفع بنجاح'}
              </button>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
