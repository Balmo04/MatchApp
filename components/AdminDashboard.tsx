
import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Package, Loader2 } from 'lucide-react';
import { Category, Product } from '../types';
import { supabase } from '../supabaseClient';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.SHIRTS);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [promptFragment, setPromptFragment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsUploading(true);
    try {
      const { error } = await supabase.uploadProduct(
        { name, category, price: parseFloat(price), description, promptFragment },
        imageFile
      );
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AdminDashboard.tsx:handleSubmit',message:'uploadProduct returned',data:{hasError:!!error},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'L'})}).catch(()=>{});
      // #endregion
      if (!error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AdminDashboard.tsx:handleSubmit',message:'no error, showing success alert',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'M'})}).catch(()=>{});
        // #endregion
        alert("Product added successfully!");
        onClose();
      } else {
        alert(`Failed to add product: ${error.message}`);
      }
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-serif">Inventory Management</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Product Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Silk Blazer" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Price (USD)</label>
              <input required value={price} onChange={e => setPrice(e.target.value)} type="number" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="299" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Product Image</label>
              <label className="w-full bg-indigo-50 text-indigo-600 border border-indigo-100 border-dashed rounded-2xl px-4 py-3 text-sm flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : "Choose Image"}
                <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Describe the luxury craftsmanship..." />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">AI Prompt Fragment</label>
            <textarea required value={promptFragment} onChange={e => setPromptFragment(e.target.value)} rows={2} className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-indigo-900" placeholder="e.g., wearing a black velvet blazer with satin lapels..." />
            <p className="text-[10px] text-slate-400">Describe exactly how the garment should look in the AI generation.</p>
          </div>

          {/* Fix: Loader2 is now imported and used for the loading state animation */}
          <button 
            disabled={isUploading}
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            <span>ADD PRODUCT TO ATELIER</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
