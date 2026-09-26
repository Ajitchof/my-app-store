import React, { useState } from 'react';
import { X, Search, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface SearchModalProps {
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose, onSelectProduct }) => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 text-right">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن صندوق، محطة شحن، إلكترونيات، باوربانك..."
            className="flex-1 text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="text-xs text-stone-400 px-2 pb-1">
            {searchTerm.trim() ? `نتائج البحث (${filteredProducts.length})` : 'مقترحات شائعة من متجر NadiBox:'}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-1" />
              <p className="font-semibold text-stone-700">لم يتم العثور على أي منتج يطابق بحثك</p>
              <p className="text-stone-400 mt-1">جرب كلمات أخرى مثل: "شحن"، "صندوق"، "مصباح"</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                      {prod.title}
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      {prod.categoryName} · {prod.sku}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono-num font-bold text-stone-900 text-sm">
                    {prod.price} د.م.
                  </span>
                  <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
