import React, { useState, useEffect } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import Hero from './components/Hero';
import StoreSection from './components/StoreSection';
import RecordsSection from './components/RecordsSection';
import AskScan from './components/AskScan';
import DietPlanView from './components/DietPlanView';
import YogaView from './components/YogaView';
import SpecialistGrid from './components/SpecialistGrid';
import ProfileView from './components/ProfileView';
import LabReportsView from './components/LabReportsView';
import PrescriptionsView from './components/PrescriptionsView';
import VitalsView from './components/VitalsView';
import NutritionGuideView from './components/NutritionGuideView';
import RemedyHubView from './components/RemedyHubView';
import EquipmentPortal from './components/EquipmentPortal';
import AmbulancePortal from './components/AmbulancePortal';
import LoginForm from './components/LoginForm';
import CleanCutEditor from './components/CleanCutEditor';
import HealthBot from './components/HealthBot';
import HealthAssistant from './components/HealthAssistant';
import EmergencyBanner from './components/EmergencyBanner';
import CartDrawer from './components/CartDrawer';
import FindHospitalView from './components/FindHospitalView';
import { storage } from './services/storageService';

const App = () => {
  const [currentView, setCurrentView] = useState(AppView.HOME);
  const [lang, setLang] = useState(Language.EN);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [equipmentInitialMode, setEquipmentInitialMode] = useState('buy');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Global Cart State & Storage Persistence
  const [cart, setCart] = useState(() => storage.getCartItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    storage.setCartItems(cart);
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const mode = product.mode || 'buy';
      const existingIndex = prevCart.findIndex((item) => item.id === product.id && (item.mode || 'buy') === mode);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        };
        return updated;
      } else {
        return [...prevCart, { ...product, mode, quantity: 1 }];
      }
    });

    showToast(`Added "${product.name}" to your Cart! 🛒`);
  };

  const handleRemoveFromCart = (id, mode = 'buy') => {
    setCart((prev) => prev.filter((item) => !(item.id === id && (item.mode || 'buy') === mode)));
  };

  const handleUpdateQuantity = (id, mode = 'buy', delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && (item.mode || 'buy') === mode) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const t = translations[lang].sections;

  const renderHomeContent = () => (
    <div className="space-y-24 pb-24 animate-in fade-in duration-700 bg-slate-50/30 dark:bg-[#070b14]/30">
      <Hero onNavigate={setCurrentView} lang={lang} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <EmergencyBanner
          onRequestAmbulance={() => setCurrentView(AppView.AMBULANCE)}
          onFindHospital={() => setCurrentView(AppView.HOSPITALS)}
          lang={lang}
        />
      </div>

      <StoreSection
        onNavigate={setCurrentView}
        lang={lang}
        cart={cart}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <AskScan onNavigate={setCurrentView} lang={lang} />

      <div className="max-w-[1440px] mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b dark:border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-[#1e2a3a] dark:text-white tracking-tight leading-tight">{t.specialists}</h2>
            <p className="text-slate-500 font-medium text-base md:text-lg">{t.specialistsSub || "Ayushman Bharat verified clinical professionals."}</p>
          </div>
          <button
            onClick={() => setCurrentView(AppView.CONSULT)}
            className="bg-white dark:bg-slate-800 text-[#2f80ed] font-black uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:scale-105 transition-all"
          >
            {t.viewAll}
          </button>
        </div>
        <SpecialistGrid onNavigate={setCurrentView} lang={lang} limit={8} />
      </div>

      <RecordsSection onNavigate={setCurrentView} lang={lang} />
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return renderHomeContent();
      case AppView.STORE:
        return (
          <StoreSection
            onNavigate={setCurrentView}
            lang={lang}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        );
      case AppView.AMBULANCE: return <AmbulancePortal onBack={() => setCurrentView(AppView.HOME)} lang={lang} />;
      case AppView.SCANNER:
        return (
          <div className="max-w-[1440px] mx-auto py-20 px-6">
            <div className="mb-12 flex items-center gap-6">
              <button onClick={() => setCurrentView(AppView.HOME)} className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-slate-400">➔</button>
              <h2 className="text-3xl font-black text-[#1e2a3a] dark:text-white">AI Seller Studio</h2>
            </div>
            <CleanCutEditor />
          </div>
        );
      case AppView.EQUIPMENT_PORTAL:
        return (
          <EquipmentPortal
            onBack={() => setCurrentView(AppView.HOME)}
            initialMode={equipmentInitialMode}
            lang={lang}
            onAddToCart={handleAddToCart}
          />
        );
      case AppView.DIET_PLAN: return <DietPlanView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.YOGA: return <YogaView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.ACCOUNT: return <div className="py-20"><RecordsSection onNavigate={setCurrentView} lang={lang} /></div>;
      case AppView.PROFILE: return <ProfileView onBack={() => setCurrentView(AppView.ACCOUNT)} />;
      case AppView.LAB_REPORTS: return <LabReportsView onBack={() => setCurrentView(AppView.ACCOUNT)} />;
      case AppView.PRESCRIPTIONS: return <PrescriptionsView onBack={() => setCurrentView(AppView.ACCOUNT)} onLaunchScanner={() => setCurrentView(AppView.SCANNER)} />;
      case AppView.VITALS: return <VitalsView onBack={() => setCurrentView(AppView.ACCOUNT)} />;
      case AppView.CONSULT: return <div className="max-w-[1440px] mx-auto px-6 py-20"><SpecialistGrid onNavigate={setCurrentView} lang={lang} /></div>;
      case AppView.NUTRITION_GUIDE: return <NutritionGuideView onBack={() => setCurrentView(AppView.HOME)} onNavigate={setCurrentView} />;
      case AppView.REMEDY_HUB: return <RemedyHubView onBack={() => setCurrentView(AppView.HOME)} onNavigate={setCurrentView} />;
      case AppView.HOSPITALS: return <FindHospitalView onBack={() => setCurrentView(AppView.HOME)} onNavigate={setCurrentView} lang={lang} />;
      default: return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] transition-colors duration-500 flex flex-col font-sans relative">
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        lang={lang}
        setLang={setLang}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onLogin={() => setShowLogin(true)}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 w-full relative">
        {renderView()}

        {/* Floating Action Buttons Cluster (AI Chatbot placed directly ABOVE Ambulance SOS) */}
        <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
          {/* Floating Health Assistant AI Popup Window */}
          {isChatbotOpen && (
            <div className="animate-in slide-in-from-bottom-5 duration-300 shadow-2xl mb-2">
              <HealthAssistant lang={lang} onClose={() => setIsChatbotOpen(false)} />
            </div>
          )}

          {/* 1. AI Chatbot Floating Button (TOP / ABOVE) */}
          <button
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-r from-[#2f80ed] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center text-3xl shadow-[0_12px_35px_rgba(47,128,237,0.6)] border-4 border-white dark:border-slate-800 hover:scale-110 active:scale-95 transition-all group relative animate-bounce"
            style={{ animationDuration: '3s' }}
            title={lang === Language.HI ? "एआई डॉक्टर चैट" : "AI Health Assistant"}
          >
            <span className="group-hover:rotate-12 transition-transform">🤖</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
            </span>
          </button>

          {/* 2. Emergency SOS Floating Button (BOTTOM / BELOW) */}
          <button
            onClick={() => setCurrentView(AppView.AMBULANCE)}
            className="w-16 h-16 sm:w-18 sm:h-18 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-3xl shadow-[0_12px_35px_rgba(239,68,68,0.6)] border-4 border-white dark:border-slate-800 hover:scale-110 active:scale-95 transition-all animate-bounce"
            title={lang === Language.HI ? "आपातकालीन एम्बुलेंस SOS" : "Emergency SOS Ambulance"}
          >
            🚑
          </button>
        </div>
      </main>

      {/* Global Slide-Out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Toast Notification for Item Added to Cart */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-slate-900/95 text-white px-6 py-3.5 rounded-full font-bold text-xs shadow-2xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#2f80ed] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-blue-600"
          >
            View Cart
          </button>
        </div>
      )}

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

      <footer className="bg-white dark:bg-[#070b14] border-t dark:border-white/5 py-12 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-300">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-mono font-black text-[#2f80ed] tracking-tighter">Abhimanyu</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-[#2f80ed] transition-colors">Emergency Network</a>
            <a href="#" className="hover:text-[#2f80ed] transition-colors">Ayushman Bharat API</a>
          </div>
          <p>© 2026 Abhimanyu Health Stack</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
