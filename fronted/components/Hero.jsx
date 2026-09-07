import React, { useState } from 'react';
import { AppView, Language } from '../../backened/types';
import { translations } from '../../backened/i18n';

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
            poster="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s]"
          >
            <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/95 via-[#f8fafc]/80 to-transparent dark:from-[#070b14]/95 dark:via-[#070b14]/85 dark:to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10 p-8 md:p-20 w-full">
          <div className="space-y-8 md:space-y-12 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2f80ed]/10 text-[#2f80ed] rounded-full text-xs font-bold uppercase tracking-wider border border-[#2f80ed]/20">
              <span className="w-2 h-2 bg-[#2f80ed] rounded-full animate-pulse"></span>
              {t.tag}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e2a3a] dark:text-white leading-tight tracking-tight">
              {t.title.split('.')[0]}. <br />
              <span className="text-[#2f80ed]">{t.title.split('.')[1]}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              {t.desc}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate(AppView.STORE)}
                className="bg-[#2f80ed] hover:bg-blue-600 text-white px-7 md:px-9 py-4 rounded-2xl font-bold text-sm md:text-base shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-3 group/btn"
              >
                {t.cta1}
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </button>
              <button
                onClick={() => onNavigate(AppView.DIET_PLAN)}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#1e2a3a] dark:text-white px-7 md:px-9 py-4 rounded-2xl font-bold text-sm md:text-base shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                {t.cta2}
              </button>
            </div>
          </div>

          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            {/* Live Inline Feature Video replacing static Experience Abhimanyu banner */}
            <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/60 dark:border-slate-800/80 backdrop-blur-md hover:scale-[1.02] transition-all aspect-video bg-slate-900">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="auto"
                poster="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover rounded-[2.5rem]"
              >
                <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
                <source src="https://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
              title="Abhimanyu Platform Demo"
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
