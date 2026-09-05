import React, { useState } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';
import Logo from './Logo';

const Navbar = ({ currentView, setView, lang, setLang, isDarkMode, toggleDarkMode, onLogin, cart = [], onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang]?.nav || translations[Language.EN].nav;

  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const menuItems = [
    { label: t.home, view: AppView.HOME },
    { label: t.hospitals || 'Hospitals', view: AppView.HOSPITALS },
    { label: t.pharmacy, view: AppView.STORE },
    { label: t.emergency, view: AppView.AMBULANCE, isEmergency: true },
    { label: t.equipment, view: AppView.EQUIPMENT_PORTAL },
    { label: t.consult, view: AppView.CONSULT },
    { label: t.wellness, view: AppView.NUTRITION_GUIDE },
  ];

  const handleNavClick = (view) => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100 dark:border-white/5 shadow-sm transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setView(AppView.HOME)}
          >
            <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
            <span className="text-2xl font-mono font-black text-[#2f80ed] tracking-tighter">
              Abhimanyu
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  item.isEmergency ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' :
                  currentView === item.view
                    ? 'text-[#2f80ed] bg-blue-50 dark:bg-blue-500/10 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#1e2a3a] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Section */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => setLang(Language.EN)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center gap-1.5 ${
                  lang === Language.EN
                    ? 'bg-[#2f80ed] text-white shadow-md scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Switch to English"
              >
                <span className="text-xs">🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLang(Language.HI)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider transition-all flex items-center gap-1.5 ${
                  lang === Language.HI
                    ? 'bg-[#2f80ed] text-white shadow-md scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="हिंदी में बदलें"
              >
                <span className="text-xs">🇮🇳</span>
                <span>हिंदी</span>
              </button>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#1e2a3a] dark:text-yellow-400 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <button
              onClick={onLogin}
              className="hidden sm:block bg-[#1e2a3a] dark:bg-[#2f80ed] text-white px-5 lg:px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {t.login}
            </button>

            {/* Navbar Cart Button (Placed on the right side of LOGIN / ABHA) */}
            <button
              onClick={onOpenCart}
              className="relative bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white px-3.5 sm:px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:scale-105 flex items-center gap-2 group/cart cursor-pointer"
              title="View Shopping Cart"
            >
              <span className="text-xl group-hover/cart:rotate-12 transition-transform">🛒</span>
              
              {cartItemCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#2f80ed] text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-md">
                    {cartItemCount}
                  </span>
                  <span className="hidden md:inline text-xs font-black text-[#2f80ed]">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#1e2a3a] dark:text-white border border-slate-200"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 w-full bg-white dark:bg-[#070b14] border-b p-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl">
          {menuItems.map((item) => (
            <button key={item.view} onClick={() => handleNavClick(item.view)} className="w-full text-left p-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">{item.label}</button>
          ))}
          <div className="pt-2 border-t dark:border-slate-800">
            <button onClick={onLogin} className="w-full bg-[#2f80ed] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest">{t.login}</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

