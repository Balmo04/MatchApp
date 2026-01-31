
import React from 'react';
import { X, Zap, Check, CreditCard } from 'lucide-react';
import { CREDIT_PACKS } from '../constants';

interface CreditSystemProps {
  onClose: () => void;
  currentCredits: number;
  onPurchase: (amount: number) => void;
}

const CreditSystem: React.FC<CreditSystemProps> = ({ onClose, currentCredits, onPurchase }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center bg-indigo-600 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 fill-white" />
          </div>
          <h2 className="text-3xl font-serif">Style Credits</h2>
          <p className="text-indigo-100 mt-2">Current balance: <span className="font-bold">{currentCredits} Credits</span></p>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-slate-500 text-sm text-center">Refill your credits to continue experimenting with high-end fashion AI try-ons.</p>
          
          <div className="space-y-4">
            {CREDIT_PACKS.map(pack => (
              <div key={pack.id} className="group border-2 border-slate-100 rounded-3xl p-6 flex items-center justify-between hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer" onClick={() => onPurchase(pack.amount)}>
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{pack.amount} Credits</h4>
                    <p className="text-xs text-slate-400">Best for professional portfolios</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif text-slate-900">${pack.price}</span>
                  <div className="mt-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 20%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex items-start space-x-3">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">Purchases are secured with encrypted checkout. Credits are non-expiring and available across all MATCH features.</p>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>SECURE CHECKOUT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditSystem;
