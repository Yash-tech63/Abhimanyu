import React, { useState } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';
import Logo from './Logo';

const Navbar = ({ currentView, setView, lang, setLang, isDarkMode, toggleDarkMode, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const menuItems = [
    { label: t.home, view: AppView.HOME },
    { label: "Pharmacy", view: AppView.STORE },
    { label: "Emergency", view: AppView.AMBULANCE },
    { label: "Equipment", view: AppView.EQUIPMENT_PORTAL },
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
            <span className="text-2xl font-mono font-black text-[#1e2a3a] dark:text-white tracking-tighter uppercase">
              Pulse<span className="text-[#2f80ed]">+</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${item.label === 'Emergency' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' :
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
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#1e2a3a] dark:text-yellow-400 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <button
              onClick={onLogin}
              className="hidden sm:block bg-[#1e2a3a] dark:bg-[#2f80ed] text-white px-5 lg:px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              ABHA Login
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
        <div className="lg:hidden absolute top-20 w-full bg-white dark:bg-[#070b14] border-b p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => handleNavClick(item.view)} className="w-full text-left p-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-50">{item.label}</button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
