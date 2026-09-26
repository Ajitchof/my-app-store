import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, Check, Search, Package, Save, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';

export const AdminInventory: React.FC = () => {
  const { products, updateProductStock, addProduct, updateProduct, deleteProduct, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('boxes');
  const [newStock, setNewStock] = useState('10');
  const [newSku, setNewSku] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/hero_nadibox_showcase_1790462608455.jpg');
  const [newDescription, setNewDescription] = useState('');
  const [newFeatures, setNewFeatures] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const cleanSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      p.title.toLowerCase().includes(cleanSearch) ||
      p.sku.toLowerCase().includes(cleanSearch) ||
      p.categoryName.toLowerCase().includes(cleanSearch);
    return matchesCat && matchesSearch;
  });

  const handleStockIncrement = (product: Product, delta: number) => {
    const updated = Math.max(0, product.stock + delta);
    updateProductStock(product.id, updated);
  };

  const handleStockInputChange = (productId: string, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      updateProductStock(productId, num);
    }
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) {
      showToast('يرجى ملء اسم المنتج وسعره بالدرهم', 'error');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOriginalPrice ? parseFloat(newOriginalPrice) : undefined;
    const stockNum = parseInt(newStock, 10) || 10;
    const skuCode = newSku.trim() || `NB-${Math.floor(1000 + Math.random() * 9000)}`;

    const categoryNamesMap: Record<ProductCategory, string> = {
      boxes: 'صناديق حصرية',
      electronics: 'إلكترونيات ذكية',
      lifestyle: 'أسلوب حياة',
      workplace: 'إكسسوارات العمل',
      accessories: 'ملحقات متنوعة',
    };

    addProduct({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'منتج أصلي مميز من NadiBox',
      price: priceNum,
      originalPrice: origPriceNum,
      category: newCategory,
      categoryName: categoryNamesMap[newCategory],
      rating: 5.0,
      reviewsCount: 1,
      stock: stockNum,
      lowStockThreshold: 4,
      sku: skuCode,
      image: newImage,
      images: [newImage],
      description: newDescription.trim() || 'منتج عالي الجودة مختار بعناية لزبائن نادي بوكس المغرب.',
      features: newFeatures
        ? newFeatures.split('\n').filter((f) => f.trim())
        : ['جودة ممتازة', 'ضمان رسمي'],
      specs: [
        { label: 'الضمان', value: '12 شهراً بالمغرب' },
        { label: 'الأصل', value: 'أصلي 100%' },
      ],
      isFeatured: true,
      isNew: true,
    });

    // Reset Form
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewStock('10');
    setNewSku('');
    setNewDescription('');
    setNewFeatures('');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      title: editingProduct.title,
      subtitle: editingProduct.subtitle,
      price: editingProduct.price,
      originalPrice: editingProduct.originalPrice,
      stock: editingProduct.stock,
      sku: editingProduct.sku,
      description: editingProduct.description,
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Top action & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">إدارة المنتجات والمخزون الحي</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              تعديل فوري لكميات المخزون، إضافة منتجات جديدة، وتحديث الأسعار بالدرهم المغربي.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد للمتجر</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جميع التصنيفات ({products.length})
            </button>
            <button
              onClick={() => setCategoryFilter('boxes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'boxes'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              صناديق حصرية ({products.filter((p) => p.category === 'boxes').length})
            </button>
            <button
              onClick={() => setCategoryFilter('electronics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'electronics'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              إلكترونيات ({products.filter((p) => p.category === 'electronics').length})
            </button>
            <button
              onClick={() => setCategoryFilter('lifestyle')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'lifestyle'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              أسلوب حياة ({products.filter((p) => p.category === 'lifestyle').length})
            </button>
          </div>

          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم، الكود، أو التصنيف..."
              className="w-full pr-9 pl-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-200 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">صورة والمنتج</th>
                <th className="py-3 px-4">التصنيف والكود</th>
                <th className="py-3 px-4">سعر البيع (د.م.)</th>
                <th className="py-3 px-4">الكمية بالمستودع</th>
                <th className="py-3 px-4">حالة التوفر</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((product) => {
                const isLow = product.stock <= product.lowStockThreshold && product.stock > 0;
                const isOut = product.stock <= 0;

                return (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block text-sm line-clamp-1">
                            {product.title}
                          </span>
                          <span className="text-[11px] text-stone-400 line-clamp-1">
                            {product.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & SKU */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800 block">{product.categoryName}</span>
                      <span className="font-mono-num text-[11px] text-stone-400">{product.sku}</span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-mono-num font-extrabold text-stone-950 text-sm">
                        {product.price} د.م.
                      </span>
                      {product.originalPrice && (
                        <span className="text-stone-400 line-through text-[11px] font-mono-num block">
                          {product.originalPrice} د.م.
                        </span>
                      )}
                    </td>

                    {/* Stock Stepper Controller */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleStockIncrement(product, -1)}
                            className="px-2.5 py-1 hover:bg-stone-100 text-stone-700 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={product.stock}
                            onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                            className="w-12 text-center text-xs font-mono-num font-bold py-1 focus:outline-hidden"
                          />
                          <button
                            onClick={() => handleStockIncrement(product, 1)}
                            className="px-2.5 py-1 hover:bg-stone-100 text-stone-700 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Stock Status indicator */}
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="text-rose-700 font-bold text-[11px] px-2 py-0.5 bg-rose-50 rounded border border-rose-100">
                          نفد من المخزون
                        </span>
                      ) : isLow ? (
                        <span className="text-amber-800 font-bold text-[11px] px-2 py-0.5 bg-amber-50 rounded border border-amber-200 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>كمية منخفضة ({product.stock})</span>
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px] px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100 flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>متوفر ({product.stock} قطعة)</span>
                        </span>
                      )}
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          title="تعديل بيانات المنتج"
                          className="p-1.5 hover:bg-stone-100 text-stone-600 hover:text-amber-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف المنتج "${product.title}"؟`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          title="حذف المنتج من المتجر"
                          className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
          <div
            className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-base font-black text-stone-900">إضافة منتج جديد لـ NadiBox.ma</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">اسم المنتج <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: محطة شحن مغناطيسية متعددة الوظائف"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">الوصف المختصر</label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="مثال: NadiBox Series 2026 - إصدار حصري"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">سعر البيع بالدرهم (MAD) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="مثال: 399"
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">السعر الأصلي قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    min="1"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="مثال: 499"
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">التصنيف</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="boxes">صناديق حصرية (Gift Boxes)</option>
                    <option value="electronics">إلكترونيات ذكية</option>
                    <option value="lifestyle">أسلوب حياة</option>
                    <option value="workplace">إكسسوارات العمل والمكتب</option>
                    <option value="accessories">ملحقات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">الكمية الأولية بالمخزون</label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">رمز المنتج (SKU)</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="NB-ITEM-01"
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">صورة المنتج</label>
                  <select
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="/src/assets/images/hero_nadibox_showcase_1790462608455.jpg">صندوق NadiBox الفاخر</option>
                    <option value="/src/assets/images/product_smart_charger_hub_1790462620941.jpg">محطة شحن لاسلكي 6 في 1</option>
                    <option value="/src/assets/images/product_luxury_tech_pack_1790462632624.jpg">حقيبة تقنية جلدية للسفر</option>
                    <option value="/src/assets/images/product_sound_ambient_light_1790462642518.jpg">مصباح ومكبر صوت الأجواء</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">الوصف التفصيلي</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="تفاصيل المنتج وخاماته ومميزاته للزبون..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">المميزات الرئيسية (ميزة في كل سطر)</label>
                  <textarea
                    rows={2}
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    placeholder="شحن سريع 25W&#10;تصميم ألومنيوم فاخر&#10;ضمان لمدة سنة كاملة"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إضافة المنتج ونشره في المتجر فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
          <div
            className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-base font-black text-stone-900">تعديل بيانات المنتج: {editingProduct.title}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">سعر البيع الحالي (د.م.)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">السعر الأصلي (د.م.)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">الكمية الحالية في المخزون</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">كود SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
