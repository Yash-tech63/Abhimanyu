import React from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';
import HealthBot from './HealthBot';

const AskScan = ({ onNavigate, lang = Language.EN }) => {
  const t = translations[lang].sections;

  const isHindi = lang === Language.HI;

  const apps = [
    {
      title: isHindi ? 'न्यूट्रिशन हब' : 'Nutrition Hub',
      desc: isHindi ? 'प्राकृतिक स्वास्थ्य और उपचार के लिए व्यक्तिगत ऐप।' : 'Individual app for natural wellness & remedies.',
      icon: '🥗',
      view: AppView.NUTRITION_GUIDE,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
      tag: isHindi ? 'सत्यापित उपचार' : 'Verified Remedies'
    },
    {
      title: isHindi ? 'डाइट प्लानर' : 'Diet Planner',
      desc: isHindi ? 'कैलोरी और आहार ट्रैकर।' : 'Intake tracker, macro insights, and calorie budget.',
      icon: '📋',
      view: AppView.DIET_PLAN,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
      tag: isHindi ? 'नैदानिक ट्रैकिंग' : 'Clinical Tracking'
    },
    {
      title: isHindi ? 'योग अकादमी' : 'Yoga Academy',
      desc: isHindi ? 'आसन विश्लेषण और लाइव ध्यान अभ्यास।' : 'Posture analysis, live flows, and meditation apps.',
      icon: '🧘‍♀️',
      view: AppView.YOGA,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      tag: isHindi ? 'मोशन एआई' : 'Motion AI'
    },
    {
      title: isHindi ? 'घरेलू उपचार हब' : 'Remedy Hub',
      desc: isHindi ? 'विशेषज्ञों द्वारा सत्यापित पारंपरिक घरेलू नुस्खे।' : 'Home remedies verified by clinical experts.',
      icon: '🍯',
      view: AppView.REMEDY_HUB,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      tag: isHindi ? 'प्राचीन आयुर्वेद' : 'Ancient Secrets'
    },
  ];

  return (
    <section className="px-4 md:px-6 py-20 space-y-16 max-w-7xl mx-auto w-full">
      <div className="space-y-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
          {t.wellnessCenter}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium tracking-normal leading-relaxed">
          {t.wellnessSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full items-start">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {apps.map((app) => (
            <div
              key={app.title}
              onClick={() => onNavigate(app.view)}
              className="group bg-white dark:bg-slate-800 rounded-[4rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all cursor-pointer flex flex-col active:scale-[0.98]"
            >
              <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-inner">
                <img
                  src={app.img}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={app.title}
                />
                <div className={`absolute top-6 left-6 ${app.bg} ${app.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-2xl backdrop-blur-md border border-white/20`}>
                  {app.icon}
                </div>
                <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/10 shadow-lg">
                  {app.tag}
                </div>
              </div>

              <div className="space-y-2 px-2">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white group-hover:text-[#2f80ed] transition-colors tracking-tight">{app.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{app.desc}</p>
              </div>
              <div className="mt-8 px-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest">Enter Application ➔</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 h-full min-h-[600px] w-full lg:sticky lg:top-24">
          <HealthBot />
        </div>
      </div>
    </section>
  );
};

export default AskScan;
