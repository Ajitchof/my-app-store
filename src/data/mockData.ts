import { Product, Order, StoreSettings } from '../types';

export const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'مراكش (Marrakech)',
  'طنجة (Tanger)',
  'فاس (Fès)',
  'أكادير (Agadir)',
  'القنيطرة (Kénitra)',
  'تطوان (Tétouan)',
  'وجدة (Oujda)',
  'مكناس (Meknès)',
  'المحمدية (Mohammedia)',
  'الجديدة (El Jadida)',
  'تمارة (Témara)',
  'الناظور (Nador)',
  'بني ملال (Béni Mellal)',
  'العيون (Laâyoune)',
  'باقي المدن المغربية'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'nb-prod-01',
    title: 'محطة الشحن اللاسلكي السريع 6 في 1 Pro',
    subtitle: 'NadiBox MagCharge Ultra Series',
    price: 389,
    originalPrice: 499,
    category: 'electronics',
    categoryName: 'إلكترونيات ذكية',
    rating: 4.9,
    reviewsCount: 48,
    stock: 14,
    lowStockThreshold: 5,
    sku: 'NB-CHG-6IN1',
    image: '/src/assets/images/product_smart_charger_hub_1790462620941.jpg',
    images: [
      '/src/assets/images/product_smart_charger_hub_1790462620941.jpg',
      '/src/assets/images/hero_nadibox_showcase_1790462608455.jpg'
    ],
    description: 'محطة شحن ذكية متكاملة تدعم الشحن اللاسلكي المغناطيسي السريع لهواتف آيفون وأندرويد، وساعة آبل/سامسونج، وسماعات الأذن مع مؤشر ذكي للشحن وحماية متطورة ضد الحرارة الزائدة وتذبذب التيار.',
    features: [
      'شحن سريع بقدرة 25 واط مع توزيع ذكي للطاقة',
      'مغناطيس MagSafe مدمج فائق القوة لتثبيت دقيق',
      'شحن 3 أجهزة في وقت واحد دون انخفاض السرعة',
      'تصميم أنيق من الألومنيوم غير اللامع وقاعدة مضادة للانزلاق'
    ],
    specs: [
      { label: 'القدرة القصوى', value: '25W Fast Charge' },
      { label: 'التوافق', value: 'جميع الهواتف الداعمة لـ Qi و MagSafe' },
      { label: 'المنافذ الإضافية', value: 'USB-C PD Output 20W' },
      { label: 'الضمان بالمغرب', value: '12 شهراً استبدال فوري' }
    ],
    isFeatured: true,
    isNew: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'nb-prod-02',
    title: 'صندوق النخبة التقني الفاخر NadiBox Executive',
    subtitle: 'حزمة السفر والتنظيم المتكاملة مع حافظة جلدية',
    price: 649,
    originalPrice: 799,
    category: 'boxes',
    categoryName: 'صناديق حصرية',
    rating: 5.0,
    reviewsCount: 62,
    stock: 8,
    lowStockThreshold: 4,
    sku: 'NB-BOX-EXEC-01',
    image: '/src/assets/images/product_luxury_tech_pack_1790462632624.jpg',
    images: [
      '/src/assets/images/product_luxury_tech_pack_1790462632624.jpg',
      '/src/assets/images/hero_nadibox_showcase_1790462608455.jpg'
    ],
    description: 'صندوق الهدايا الحصري من نادي بوكس، يحتوي على محفظة جلدية إيطالية فاخرة لتنظيم الأجهزة والأسلاك، بنك طاقة رفيع بسعة 10,000 مللي أمبير، كابلات شحن مضفرة مصفحة متعددة الرؤوس، وقلم ذكي متعدد الوظائف.',
    features: [
      'صندوق فاخر جاهز للإهداء بتغليف NadiBox الأسود المميز',
      'جلد مقاوم للخدش والماء مع سحابات YKK محكمة',
      'باوربانك مغناطيسي نحيف 10000mAh داعم للشحن فائق السرعة',
      'مناسب جداً لرجال الأعمال والمسافرين ومحبي التنظيم'
    ],
    specs: [
      { label: 'محتويات الصندوق', value: 'حقيبة + باوربانك + كابل متعدد + قلم + هدية ترحيبية' },
      { label: 'سعة بنك الطاقة', value: '10,000 mAh (PD 22.5W)' },
      { label: 'الخامات', value: 'جلد PU صديق للبيئة مضاد للماء' },
      { label: 'أبعاد الحقيبة', value: '24 × 18 × 6 سم' }
    ],
    isFeatured: true,
    isNew: true,
    createdAt: '2026-02-28'
  },
  {
    id: 'nb-prod-03',
    title: 'مصباح ومكبر صوت الأجواء المحيطية الذكي AuraTone',
    subtitle: 'إضاءة دافئة قابلة للتعديل + مكبر صوت Hi-Fi بلوتوث',
    price: 429,
    originalPrice: 550,
    category: 'lifestyle',
    categoryName: 'أسلوب حياة',
    rating: 4.8,
    reviewsCount: 39,
    stock: 6,
    lowStockThreshold: 3,
    sku: 'NB-SPK-AURA-02',
    image: '/src/assets/images/product_sound_ambient_light_1790462642518.jpg',
    images: [
      '/src/assets/images/product_sound_ambient_light_1790462642518.jpg'
    ],
    description: 'يجمع هذا الجهاز الاستثنائي بين إضاءة دافئة تحاكي شعلة المساء مع مكبر صوت نقي 360 درجة. تصميم اسكندنافي عصري مع قاعدة من خشب الجوز تضفي لمسة راقية على مكتبك أو غرفة نومك.',
    features: [
      'تحكم باللمس في درجات السطوع ومؤقت نوم ذكي',
      'صوت استريو 360 درجة نقي مع مضخم صوت باس عميق',
      'بطارية تدوم حتى 12 ساعة تشغيل مستمر مع كابل Type-C',
      'اتصال بلوتوث 5.3 فوري ومستقر حتى مسافة 15 متراً'
    ],
    specs: [
      { label: 'قوة الصوت', value: '15W RMS Hi-Fi' },
      { label: 'عمر البطارية', value: '12 ساعة تشغيل' },
      { label: 'درجة حرارة الضوء', value: '2200K - 3200K Warm Glow' },
      { label: 'المواد', value: 'خشب طبيعي وسيراميك غير لامع' }
    ],
    isFeatured: true,
    isNew: false,
    createdAt: '2026-02-20'
  },
  {
    id: 'nb-prod-04',
    title: 'قارورة حرارية ذكية مع شاشة لمس رقمية LED',
    subtitle: 'NadiBox ThermoSmart 500ml - عزل مزدوج 24 ساعة',
    price: 189,
    originalPrice: 249,
    category: 'lifestyle',
    categoryName: 'أسلوب حياة',
    rating: 4.7,
    reviewsCount: 54,
    stock: 22,
    lowStockThreshold: 5,
    sku: 'NB-BOT-SMART-LED',
    image: '/src/assets/images/hero_nadibox_showcase_1790462608455.jpg',
    images: [
      '/src/assets/images/hero_nadibox_showcase_1790462608455.jpg'
    ],
    description: 'قارورة فولاذية مقاومة للصدأ من الدرجة الغذائية 316 مزودة بغطاء ذكي يعرض درجة حرارة المشروب بلمسة واحدة. تحافظ على المشروبات الساخنة والباردة لأكثر من 24 ساعة بدون تسريب.',
    features: [
      'شاشة LED دقيقة تعرض درجة الحرارة الحالية للمشروب فوراً',
      'عزل فراغي مزدوج الجدران يحافظ على السخونة والبرودة طوال اليوم',
      'فلتر شاي مدمج من الستانلس ستيل وغطاء محكم ومقاوم للتسرب',
      'بطارية الشاشة تدوم لأكثر من 500 يوم دون الحاجة لشحن'
    ],
    specs: [
      { label: 'السعة', value: '500 مل' },
      { label: 'المعدن الداخلي', value: 'Medical-Grade Stainless Steel 316' },
      { label: 'مدة حفظ الحرارة', value: '24 ساعة (ساخن / بارد)' },
      { label: 'الوزن', value: '290 غرام' }
    ],
    isFeatured: false,
    isNew: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'nb-prod-05',
    title: 'حامل مكتبي مريح قابل للطي للكمبيوتر المحمول من الألومنيوم',
    subtitle: 'ErgoPro 360 - تعديل الارتفاع والزاوية لمكتب صحي',
    price: 279,
    originalPrice: 349,
    category: 'workplace',
    categoryName: 'إكسسوارات العمل',
    rating: 4.9,
    reviewsCount: 31,
    stock: 11,
    lowStockThreshold: 4,
    sku: 'NB-STN-ERGO-360',
    image: '/src/assets/images/product_smart_charger_hub_1790462620941.jpg',
    images: [
      '/src/assets/images/product_smart_charger_hub_1790462620941.jpg'
    ],
    description: 'حامل ألومنيوم فائق المتانة مخصص لأجهزة اللابتوب والماك بوك، يساعد على الحفاظ على استقامة الرقبة والظهر أثناء ساعات العمل الطويلة مع فتحات تهوية لمنع سخونة الجهاز.',
    features: [
      'هيكل من الألومنيوم المستخدم في صناعة الطائرات يتحمل حتى 10 كغ',
      'تعديل كامل للارتفاع حتى 30 سم وزوايا ميلان متعددة',
      'وسادات سيليكون عريضة لمنع الخدوش وحماية الجهاز من الانزلاق',
      'قابل للطي بالكامل لسهولة حمله في حقيبة الظهر'
    ],
    specs: [
      { label: 'الأجهزة المدعومة', value: 'جميع الحواسيب المحمولة من 10 إلى 17.3 بوصة' },
      { label: 'الوزن', value: '750 غرام' },
      { label: 'المادة', value: 'سبائك الألومنيوم الفاخرة' }
    ],
    isFeatured: false,
    isNew: false,
    createdAt: '2026-02-10'
  },
  {
    id: 'nb-prod-06',
    title: 'صندوق الهدايا التقني الشتوي NadiBox Winter Edition',
    subtitle: 'حزمة حصرية تشمل مدفئ اليدين الذكي وكوب التسخين السريع',
    price: 499,
    originalPrice: 620,
    category: 'boxes',
    categoryName: 'صناديق حصرية',
    rating: 4.9,
    reviewsCount: 27,
    stock: 3,
    lowStockThreshold: 4,
    sku: 'NB-BOX-WTR-2026',
    image: '/src/assets/images/product_luxury_tech_pack_1790462632624.jpg',
    images: [
      '/src/assets/images/product_luxury_tech_pack_1790462632624.jpg'
    ],
    description: 'تشكيلة الشتاء الفاخرة المحدودة من NadiBox تحتوي على مدفئ اليدين الذكي القابل لإعادة الشحن (يعمل أيضاً كباوربانك) وقاعدة تسخين القهوة والمشروبات الذكية بدرجة حرارة ثابتة 55°C.',
    features: [
      'إصدار محدود ونادر مع تغليف هدايا فاخر وشريط حريري',
      'مدفئ يدين كهربائي بدرجات حرارة 45° و 50° و 55°C',
      'كوب سيراميك فاخر مع قاعدة شحن لاسلكي وتسخين حراري مستمر',
      'بطاقة إهداء مخصصة مجانية مع كل صندوق'
    ],
    specs: [
      { label: 'محتويات الحزمة', value: 'كوب تسخين + قاعدة ذكية + مدفئ يدين + بطاقة إهداء' },
      { label: 'درجة حرارة الكوب', value: 'ثابتة 55°C' },
      { label: 'الحالة', value: 'كمية محدودة جداً' }
    ],
    isFeatured: true,
    isNew: true,
    createdAt: '2026-01-30'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'NB-1094',
    customerName: 'سفيان العلمي',
    phone: '0661234567',
    email: 'soufiane.alami@gmail.com',
    city: 'الدار البيضاء (Casablanca)',
    address: 'شارع أنفا، إقامة الياسمين شقة 12',
    notes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1
      }
    ],
    subtotal: 578,
    shippingFee: 0,
    total: 578,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'shipping',
    trackingNumber: 'TRK-MA-884210',
    createdAt: '2026-03-25T14:30:00.000Z'
  },
  {
    id: 'NB-1093',
    customerName: 'فاطمة الزهراء بنجلون',
    phone: '0662889900',
    email: 'fati.benjelloun@hotmail.com',
    city: 'الرباط (Rabat)',
    address: 'حي أكدال، شارع الأطلس عمارة 4',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1
      }
    ],
    subtotal: 649,
    shippingFee: 0,
    total: 649,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'confirmed',
    trackingNumber: 'TRK-MA-884199',
    createdAt: '2026-03-25T19:15:00.000Z'
  },
  {
    id: 'NB-1092',
    customerName: 'ياسين الوردي',
    phone: '0663456789',
    email: 'yassine.ouardi@yahoo.fr',
    city: 'مراكش (Marrakech)',
    address: 'حي جليز، قرب ساحة 16 نونبر',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1
      }
    ],
    subtotal: 429,
    shippingFee: 35,
    total: 464,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'pending',
    trackingNumber: 'TRK-MA-884180',
    createdAt: '2026-03-26T09:40:00.000Z'
  },
  {
    id: 'NB-1091',
    customerName: 'أمين التازي',
    phone: '0665112233',
    email: 'amine.tazi@gmail.com',
    city: 'طنجة (Tanger)',
    address: 'شارع محمد الخامس، قرب مالاباطا',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2
      }
    ],
    subtotal: 778,
    shippingFee: 0,
    total: 778,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'delivered',
    trackingNumber: 'TRK-MA-884155',
    createdAt: '2026-03-23T11:20:00.000Z'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'NadiBox.ma',
  tagline: 'المتجر الإلكتروني المغربي الرائد للصناديق الحصرية والتقنيات الذكية',
  whatsappNumber: '+212 661 987654',
  emailContact: 'contact@nadibox.ma',
  freeShippingThreshold: 500,
  standardShippingFee: 35,
  currency: 'د.م.'
};
