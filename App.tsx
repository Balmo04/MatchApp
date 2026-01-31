
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

const THEME_KEY = 'match-theme';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = supabase.onAuthStateChange((profile) => {
      setUser(profile);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    // #region agent log
    const timeoutMs = 15000;
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleLogin',message:'login start',data:{timeoutMs},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    try {
      const result = await Promise.race([
        supabase.signIn(authEmail, authPassword),
        new Promise<{ data: null; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('La conexión tardó demasiado. Revisa tu red o Supabase.')), timeoutMs)
        ),
      ]);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleLogin',message:'race result',data:{hasError:!!result.error,errorMsg:result.error?.message?.slice(0,80),hasUser:!!result.data?.user},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      const { data, error } = result;
      if (error) {
        setAuthError(error.message || 'Error al iniciar sesión');
        return;
      }
      if (data?.user) setUser(data.user);
    } catch (err: unknown) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleLogin',message:'catch',data:{msg:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      setAuthError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    // #region agent log
    const timeoutMs = 15000;
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleRegister',message:'register start',data:{timeoutMs},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H2,H4'})}).catch(()=>{});
    // #endregion
    try {
      const result = await Promise.race([
        supabase.signUp(authEmail, authPassword),
        new Promise<{ data: null; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('La conexión tardó demasiado. Revisa tu red o Supabase.')), timeoutMs)
        ),
      ]);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleRegister',message:'signUp result',data:{hasError:!!result.error,errorMsg:result.error?.message?.slice(0,80),hasData:!!result.data},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H2,H4'})}).catch(()=>{});
      // #endregion
      const { data, error } = result;
      if (error) {
        // Si el email ya está registrado, cambiar a formulario de login
        if (error.message?.includes('ya está registrado')) {
          setIsRegistering(false);
          setAuthError('Este correo ya está registrado. Inicia sesión.');
        } else {
          setAuthError(error.message || 'Error al registrar');
        }
        return;
      }
      if (data?.user) {
        setAuthError('Cuenta creada. Bienvenido.');
        // El usuario entra directamente sin confirmación de email
        // El onAuthStateChange actualizará el estado del usuario
      }
    } catch (err: unknown) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:handleRegister',message:'catch',data:{msg:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H2,H4'})}).catch(()=>{});
      // #endregion
      setAuthError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setAuthLoading(false);
    }
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
      return (
        <Landing
          onEnter={() => setShowLogin(true)}
          isDark={isDark}
          onToggleDark={() => setIsDark((d) => !d)}
        />
      );
    }
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-serif text-slate-900 dark:text-white mb-4 tracking-tight">MATCH</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide text-xs uppercase">The Virtual Luxury Atelier</p>
          </div>

          {/* Toggle between Login and Register */}
          <div className="flex items-center justify-center mb-6 bg-slate-50 dark:bg-slate-700/50 rounded-full p-1">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setAuthError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                !isRegistering
                  ? 'bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setAuthError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                isRegistering
                  ? 'bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>
          
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="email" 
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="name@atelier.com" 
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl px-12 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="password" 
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl px-12 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {authError && (
              <p className={`text-center text-sm py-2 px-4 rounded-xl ${
                authError.includes('exitosamente') || authError.includes('confirmar') || authError.includes('Cuenta creada') || authError.includes('Bienvenido')
                  ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30'
                  : 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30'
              }`}>
                {authError}
              </p>
            )}

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 transition-all"
            >
              {authLoading 
                ? (isRegistering ? 'Registrando...' : 'Entrando...') 
                : (isRegistering ? 'CREAR CUENTA' : 'ENTER ATELIER')
              }
            </button>
            
            {!isRegistering && (
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
                >
                  Regístrate aquí
                </button>
              </p>
            )}
          </form>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="w-full mt-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm"
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
      isDark={isDark}
      onToggleDark={() => setIsDark((d) => !d)}
    >
      <div className="min-h-screen dark:bg-slate-900">
        {/* Step Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${currentStep === Step.UPLOAD ? 'bg-indigo-600 dark:bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/50' : 'bg-slate-200 dark:bg-slate-600'}`} />
            <div className="w-12 h-[1px] bg-slate-200 dark:bg-slate-600" />
            <div className={`w-3 h-3 rounded-full ${currentStep === Step.BROWSE ? 'bg-indigo-600 dark:bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/50' : 'bg-slate-200 dark:bg-slate-600'}`} />
            <div className="w-12 h-[1px] bg-slate-200 dark:bg-slate-600" />
            <div className={`w-3 h-3 rounded-full ${currentStep === Step.TRYON ? 'bg-indigo-600 dark:bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/50' : 'bg-slate-200 dark:bg-slate-600'}`} />
          </div>
        </div>

        {/* Back Button */}
        {currentStep !== Step.UPLOAD && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <button 
              onClick={() => setCurrentStep(currentStep === Step.TRYON ? Step.BROWSE : Step.UPLOAD)}
              className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-sm"
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
