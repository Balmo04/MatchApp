
import React from 'react';
import { ShoppingBag, User, LogOut, ShieldCheck, Zap, Moon, Sun } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenCredits: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onOpenAdmin, onOpenCredits, isDark, onToggleDark }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] dark:bg-slate-900">
      <header className="sticky top-0 z-50 glass dark:bg-slate-900/90 dark:backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">MATCH</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">COLLECTIONS</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">ABOUT</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">CONCIERGE</a>
          </nav>

          <div className="flex items-center space-x-4">
            {onToggleDark && (
              <button
                type="button"
                onClick={onToggleDark}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
                aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            {user && (
              <button 
                onClick={onOpenCredits}
                className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all border border-indigo-100 dark:border-indigo-800"
              >
                <Zap className="w-4 h-4" />
                <span>{user.credits} Credits</span>
              </button>
            )}
            
            {user?.isAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-6 h-6" />
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 overflow-hidden">
                  <User className="w-6 h-6" />
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button className="text-sm font-semibold text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-300 px-6 py-2 rounded-full hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all">
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-white font-serif text-2xl">MATCH</h3>
            <p className="text-sm leading-relaxed">Redefining luxury through the lens of artificial intelligence. Your personal atelier, available anywhere.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Men's Ready-to-wear</a></li>
              <li><a href="#" className="hover:text-white">Women's Collection</a></li>
              <li><a href="#" className="hover:text-white">Evening Attire</a></li>
              <li><a href="#" className="hover:text-white">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white">Virtual Styling</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-l-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 w-full" />
              <button className="bg-white text-slate-900 px-4 py-2 rounded-r-lg text-sm font-bold">JOIN</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} MATCH ATELIER. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
