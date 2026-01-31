
import React, { useState, useEffect } from 'react';
import { Step, Product, UserProfile } from './types';
import Layout from './components/Layout';
import Landing from './components/Landing';
import UploadSection from './components/UploadSection';
import ProductCatalog from './components/ProductCatalog';
import TryOnResult from './components/TryOnResult';
import AdminDashboard from './components/AdminDashboard';
import CreditSystem from './components/CreditSystem';
import { supabase } from './supabaseClient';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // Auto-login for demo purposes if no user
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.getProfile();
      if (data) setUser(data);
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.signIn(authEmail);
    if (data?.user) setUser(data.user);
  };

  const handleImageSelected = (base64: string) => {
    setUserImage(base64);
    setCurrentStep(Step.BROWSE);
  };

  const handleSelectionComplete = (products: Product[]) => {
    if (!user || user.credits <= 0) {
      setShowCredits(true);
      return;
    }
    setSelectedProducts(products);
    setCurrentStep(Step.TRYON);
  };

  const handleTryOnSuccess = (creditsUsed: number) => {
    if (user) {
      const newCredits = user.credits - creditsUsed;
      setUser({ ...user, credits: newCredits });
      supabase.updateCredits(newCredits);
    }
  };

  const handlePurchaseCredits = (amount: number) => {
    if (user) {
      const newCredits = user.credits + amount;
      setUser({ ...user, credits: newCredits });
      supabase.updateCredits(newCredits);
      alert(`Successfully added ${amount} credits to your account!`);
      setShowCredits(false);
    }
  };

  const reset = () => {
    setCurrentStep(Step.UPLOAD);
    setSelectedProducts([]);
    // Don't reset user image unless explicitly requested
  };

  if (!user) {
    if (!showLogin) {
      return <Landing onEnter={() => setShowLogin(true)} />;
    }
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-serif text-slate-900 mb-4 tracking-tight">MATCH</h1>
            <p className="text-slate-500 font-medium tracking-wide text-xs uppercase">The Virtual Luxury Atelier</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="email" 
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="name@atelier.com" 
                  className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all">
              ENTER ATELIER
            </button>
            <p className="text-center text-[10px] text-slate-400">Enter 'admin@match.com' for administrative access</p>
          </form>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="w-full mt-4 text-slate-400 hover:text-slate-600 text-sm"
          >
            ← Volver a la landing
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      onLogout={() => { supabase.signOut(); setUser(null); }}
      onOpenAdmin={() => setShowAdmin(true)}
      onOpenCredits={() => setShowCredits(true)}
    >
      <div className="min-h-screen">
        {/* Step Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${currentStep === Step.UPLOAD ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-200'}`} />
            <div className="w-12 h-[1px] bg-slate-200" />
            <div className={`w-3 h-3 rounded-full ${currentStep === Step.BROWSE ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-200'}`} />
            <div className="w-12 h-[1px] bg-slate-200" />
            <div className={`w-3 h-3 rounded-full ${currentStep === Step.TRYON ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* Back Button */}
        {currentStep !== Step.UPLOAD && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <button 
              onClick={() => setCurrentStep(currentStep === Step.TRYON ? Step.BROWSE : Step.UPLOAD)}
              className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>GO BACK</span>
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {currentStep === Step.UPLOAD && (
          <UploadSection onImageSelected={handleImageSelected} />
        )}
        
        {currentStep === Step.BROWSE && (
          <ProductCatalog 
            onSelectionComplete={handleSelectionComplete} 
            onBack={() => setCurrentStep(Step.UPLOAD)} 
          />
        )}
        
        {currentStep === Step.TRYON && userImage && (
          <TryOnResult 
            userImage={userImage} 
            selectedProducts={selectedProducts} 
            onReset={reset}
            onSuccess={handleTryOnSuccess}
          />
        )}
      </div>

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      {showCredits && (
        <CreditSystem 
          onClose={() => setShowCredits(false)} 
          currentCredits={user.credits}
          onPurchase={handlePurchaseCredits}
        />
      )}
    </Layout>
  );
};

export default App;
