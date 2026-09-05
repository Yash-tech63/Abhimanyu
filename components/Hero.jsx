import React, { useState } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';

const Hero = ({ onNavigate, lang }) => {
  const [showDemo, setShowDemo] = useState(false);
  const t = translations[lang].hero;

  return (
    <>
      <section className="relative rounded-[3rem] md:rounded-[4rem] mx-4 md:mx-6 mt-8 overflow-hidden min-h-[700px] flex items-center transition-all duration-500 shadow-2xl group">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s]"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-medical-laboratory-technician-working-40541-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/95 via-[#f8fafc]/80 to-transparent dark:from-[#070b14]/95 dark:via-[#070b14]/85 dark:to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10 p-8 md:p-20 w-full">
          <div className="space-y-8 md:space-y-12 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#2f80ed]/10 text-[#2f80ed] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#2f80ed]/20">
              <span className="w-2 h-2 bg-[#2f80ed] rounded-full animate-pulse"></span>
              {t.tag}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1e2a3a] dark:text-white leading-[0.9] tracking-tighter">
              {t.title.split('.')[0]}. <br />
              <span className="text-[#2f80ed] font-mono">{t.title.split('.')[1]}</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              {t.desc}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigate(AppView.STORE)}
                className="bg-[#2f80ed] hover:bg-blue-600 text-white px-8 md:px-12 py-5 md:py-6 rounded-3xl font-black text-sm md:text-lg shadow-2xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 group/btn"
              >
                {t.cta1}
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </button>
              <button
                onClick={() => onNavigate(AppView.DIET_PLAN)}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#1e2a3a] dark:text-white px-8 md:px-12 py-5 md:py-6 rounded-3xl font-black text-sm md:text-lg shadow-lg border border-slate-100 dark:border-slate-700 transition-all hover:-translate-y-1 active:scale-95"
              >
                {t.cta2}
              </button>
            </div>
          </div>

          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div
              onClick={() => setShowDemo(true)}
              className="relative group rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/50 dark:border-slate-800/50 backdrop-blur-md cursor-pointer hover:scale-105 transition-all"
            >
              <div className="aspect-video bg-black/40 flex items-center justify-center relative">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" alt="Pulseplus Intro" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center space-y-6">
                  <h4 className="text-white text-3xl font-black tracking-tight drop-shadow-lg">{t.demoTitle}</h4>
                  <button className="bg-white text-[#1e2a3a] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 group-hover:bg-[#2f80ed] group-hover:text-white transition-all">
                    <span className="text-xl">▶</span> {t.demoCta}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => onNavigate(AppView.STORE)}
                className="bg-white/40 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-800 cursor-pointer hover:bg-white dark:hover:bg-slate-800/50 transition-all shadow-sm group/card"
              >
                <p className="text-3xl mb-3 group-hover/card:scale-110 transition-transform origin-left">💊</p>
                <h4 className="font-black text-[#1e2a3a] dark:text-white text-sm">{t.feature1}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{t.feature1Sub}</p>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-800 cursor-pointer hover:bg-white dark:hover:bg-slate-800/50 transition-all shadow-sm group/card">
                <p className="text-3xl mb-3 group-hover/card:scale-110 transition-transform origin-left">💳</p>
                <h4 className="font-black text-[#1e2a3a] dark:text-white text-sm">{t.feature2}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{t.feature2Sub}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showDemo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in">
          <div className="relative w-full max-w-5xl aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 ring-1 ring-white/20">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Pulseplus Platform Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-6 right-6 bg-white/20 hover:bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl backdrop-blur-md transition-all z-30"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
