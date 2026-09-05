import React, { useState, useEffect } from 'react';
import { AppView, Language } from './backened/types';
import { translations } from './backened/i18n';
import Navbar from './components/Navbar';
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
import EquipmentPortal from './components/EquipmentPortal';
import AmbulancePortal from './components/AmbulancePortal';
import LoginForm from './components/LoginForm';
import CleanCutEditor from './components/CleanCutEditor';

const App = () => {
  const [currentView, setCurrentView] = useState(AppView.HOME);
  const [lang, setLang] = useState(Language.EN);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [equipmentInitialMode, setEquipmentInitialMode] = useState('buy');

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const t = translations[lang].sections;

  const navigateToEquipment = (mode) => {
    setEquipmentInitialMode(mode);
    setCurrentView(AppView.EQUIPMENT_PORTAL);
  };

  const renderHomeContent = () => (
    <div className="space-y-24 pb-24 animate-in fade-in duration-700 bg-slate-50/30 dark:bg-[#070b14]/30">
      <Hero onNavigate={setCurrentView} lang={lang} />

      <StoreSection onNavigate={setCurrentView} lang={lang} />

      <AskScan onNavigate={setCurrentView} lang={lang} />

      <div className="max-w-[1440px] mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b dark:border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-[#1e2a3a] dark:text-white tracking-tighter leading-none">{t.specialists}</h2>
            <p className="text-slate-500 font-medium text-lg">Ayushman Bharat verified clinical professionals.</p>
          </div>
          <button
            onClick={() => setCurrentView(AppView.CONSULT)}
            className="bg-white dark:bg-slate-800 text-[#2f80ed] font-black uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:scale-105 transition-all"
          >
            {t.viewAll}
          </button>
        </div>
        <SpecialistGrid onNavigate={setCurrentView} lang={lang} limit={4} />
      </div>

      <RecordsSection onNavigate={setCurrentView} lang={lang} />
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return renderHomeContent();
      case AppView.STORE: return <StoreSection onNavigate={setCurrentView} lang={lang} />;
      case AppView.AMBULANCE: return <AmbulancePortal onBack={() => setCurrentView(AppView.HOME)} />;
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
        return <EquipmentPortal onBack={() => setCurrentView(AppView.HOME)} initialMode={equipmentInitialMode} />;
      case AppView.DIET_PLAN: return <DietPlanView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.YOGA: return <YogaView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.ACCOUNT: return <div className="py-20"><RecordsSection onNavigate={setCurrentView} lang={lang} /></div>;
      case AppView.PROFILE: return <ProfileView onBack={() => setCurrentView(AppView.ACCOUNT)} />;
      case AppView.LAB_REPORTS: return <LabReportsView onBack={() => setCurrentView(AppView.ACCOUNT)} />;
      case AppView.PRESCRIPTIONS: return <PrescriptionsView onBack={() => setCurrentView(AppView.ACCOUNT)} onLaunchScanner={() => setCurrentView(AppView.SCANNER)} />;
      case AppView.VITALS: return <VitalsView onBack={() => setCurrentView(AppView.ACCOUNT)} />;
      case AppView.CONSULT: return <div className="max-w-[1440px] mx-auto px-6 py-20"><SpecialistGrid onNavigate={setCurrentView} lang={lang} /></div>;
      case AppView.NUTRITION_GUIDE: return <NutritionGuideView onBack={() => setCurrentView(AppView.HOME)} onNavigate={setCurrentView} />;
      default: return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] transition-colors duration-500 flex flex-col font-sans">
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        lang={lang}
        setLang={setLang}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onLogin={() => setShowLogin(true)}
      />

      <main className="flex-1 w-full relative">
        {renderView()}

        {/* Production SOS Floating Button */}
        <button
          onClick={() => setCurrentView(AppView.AMBULANCE)}
          className="fixed bottom-10 right-10 w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-4xl shadow-[0_20px_50px_rgba(239,68,68,0.5)] z-[100] hover:scale-110 active:scale-95 transition-all animate-bounce"
        >
          🚑
        </button>
      </main>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

      <footer className="bg-white dark:bg-[#070b14] border-t dark:border-white/5 py-12 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#2f80ed] rounded-xl flex items-center justify-center text-white text-xl">P+</div>
            <span className="text-2xl font-mono text-[#1e2a3a] dark:text-white tracking-tighter">Pulse<span className="text-[#2f80ed]">+</span></span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-[#2f80ed] transition-colors">Emergency Network</a>
            <a href="#" className="hover:text-[#2f80ed] transition-colors">Ayushman Bharat API</a>
          </div>
          <p>© 2025 Pulseplus Health Stack</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
