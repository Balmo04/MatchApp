
import React, { useState, useEffect } from 'react';
import { Download, Share2, RefreshCw, ShoppingCart, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Product, TryOnResult as TryOnResultType } from '../types';
import { generateTryOn } from '../geminiService';

interface TryOnResultProps {
  userImage: string;
  selectedProducts: Product[];
  onReset: () => void;
  onSuccess: (creditsUsed: number) => void;
}

const TryOnResult: React.FC<TryOnResultProps> = ({ userImage, selectedProducts, onReset, onSuccess }) => {
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);

  const stages = [
    "Analyzing pose and lighting...",
    "Segmenting original garments...",
    "Mapping luxury fabrics...",
    "Simulating in-painting layers...",
    "Finalizing high-fashion textures..."
  ];

  useEffect(() => {
    const process = async () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hypothesisId: 'H4', location: 'TryOnResult.tsx:process', message: 'calling generateTryOn', data: { productsCount: selectedProducts.length }, timestamp: Date.now(), sessionId: 'debug-session' }) }).catch(() => {});
      // #endregion
      try {
        const stageInterval = setInterval(() => {
          setLoadingStage(prev => (prev + 1) % stages.length);
        }, 2500);

        const generated = await generateTryOn(userImage, selectedProducts);
        setResultImage(generated);
        onSuccess(1); // Notify parent of credit usage
        clearInterval(stageInterval);
      } catch (err: any) {
        // #region agent log
        const errMsg = err?.message ?? String(err);
        fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hypothesisId: 'H3', location: 'TryOnResult.tsx:catch', message: 'generateTryOn error', data: { errorMessage: errMsg }, timestamp: Date.now(), sessionId: 'debug-session' }) }).catch(() => {});
        // #endregion
        setError(err.message || "Failed to generate your look. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    process();
  }, [userImage, selectedProducts]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="relative mb-12">
          <div className="w-48 h-48 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wand2 className="w-16 h-16 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <h2 className="text-4xl font-serif mb-4">Curating Your Look</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto h-8">{stages[loadingStage]}</p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {selectedProducts.map(p => (
            <div key={p.id} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm animate-bounce" style={{ animationDelay: `${Math.random()}s` }}>
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-600">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] border border-red-100 mb-8">
          <h3 className="text-2xl font-serif mb-2">Something went wrong</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
        <button 
          onClick={onReset}
          className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-slate-100 relative group">
            <div className="absolute -top-4 -right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-10 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <img 
              src={resultImage!} 
              alt="Result" 
              className="w-full rounded-[2.5rem] object-cover"
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all">
              <Download className="w-5 h-5" />
              <span>SAVE IMAGE</span>
            </button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all">
              <Share2 className="w-5 h-5" />
              <span>SHARE LOOK</span>
            </button>
          </div>
        </div>

        <div className="space-y-10 py-4">
          <div>
            <h2 className="text-5xl font-serif mb-4">The Result</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Our AI has masterfully combined your photo with our selected luxury pieces, maintaining shadows, perspective, and fabric draping.</p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Featured Items</h4>
            <div className="space-y-4">
              {selectedProducts.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
                  <img src={p.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="flex-grow">
                    <h5 className="font-bold text-slate-900">{p.name}</h5>
                    <p className="text-slate-500 text-sm">${p.price}</p>
                  </div>
                  <button className="p-3 bg-slate-50 rounded-full text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>CREATE NEW LOOK</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TryOnResult;
