
import React, { useState, useEffect } from 'react';
import { Filter, Check, ChevronRight, ShoppingCart, Search } from 'lucide-react';
import { Product, Category } from '../types';
import { supabase } from '../supabaseClient';
import { MAX_SELECTIONS } from '../constants';

interface ProductCatalogProps {
  onSelectionComplete: (selected: Product[]) => void;
  onBack: () => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onSelectionComplete, onBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.getProducts();
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else if (selectedIds.length < MAX_SELECTIONS) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12">
      <div className="lg:w-1/4 space-y-8">
        <div>
          <h2 className="text-4xl font-serif mb-6">Step 2: Selection</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Select up to {MAX_SELECTIONS} garments to create your custom outfit. Our AI will seamlessly layer them onto your photo.</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Categories</h4>
          <div className="flex flex-col space-y-2">
            {['All', ...Object.values(Category)].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white">
          <h4 className="font-serif text-2xl mb-4">Selected Items</h4>
          <div className="space-y-3 min-h-[100px]">
            {selectedProducts.length === 0 ? (
              <p className="text-indigo-200 text-sm italic">No items selected yet...</p>
            ) : (
              selectedProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between text-sm bg-white/10 p-2 rounded-xl">
                  <span className="truncate pr-2">{p.name}</span>
                  <button onClick={() => toggleSelection(p.id)} className="hover:text-red-300">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          <button
            disabled={selectedIds.length === 0}
            onClick={() => onSelectionComplete(selectedProducts)}
            className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>START TRY-ON</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="lg:w-3/4">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <button className="flex items-center space-x-2 bg-white border border-slate-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-96 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => toggleSelection(product.id)}
                className={`group relative bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-500 cursor-pointer ${
                  selectedIds.includes(product.id)
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[0.98]'
                  : 'border-slate-100 hover:shadow-2xl hover:-translate-y-2'
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {selectedIds.includes(product.id) && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-2 rounded-full text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                    QUICK VIEW
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <span className="font-serif text-slate-500">${product.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
