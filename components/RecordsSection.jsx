import React, { useState } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';

const RecordsSection = ({ onNavigate, lang = Language.EN }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const t = translations[lang].sections;

  return (
    <section className="px-4 md:px-8 py-20 space-y-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b dark:border-white/5 pb-12">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{t.records}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xl leading-relaxed max-w-xl">{t.recordsSub}</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-[#2f80ed] text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase text-[10px] tracking-widest"
        >
          <span>➕</span> {t.newLog}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'My Profile', icon: '👤', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10', count: 'Verified Account', view: AppView.PROFILE },
          { label: 'Lab Reports', icon: '🔬', color: 'bg-green-50 text-green-600 dark:bg-green-500/10', count: '12 Items Indexed', view: AppView.LAB_REPORTS },
          { label: 'Prescriptions', icon: '📄', color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10', count: '4 Active Scripts', view: AppView.PRESCRIPTIONS },
          { label: 'Vital History', icon: '📉', color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10', count: 'Last sync: Today', view: AppView.VITALS },
        ].map(item => (
          <div
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all cursor-pointer group active:scale-[0.98] flex flex-col gap-8"
          >
            <div className={`${item.color} w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner`}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-black text-slate-800 dark:text-white text-2xl mb-1.5">{item.label}</h4>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[4rem] p-12 border border-slate-100 dark:border-white/5 shadow-sm space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Recent Activity</h3>
            <button onClick={() => onNavigate(AppView.CONSULT)} className="text-[10px] font-black text-[#2f80ed] hover:underline uppercase tracking-widest">Historical View</button>
          </div>

          <div className="space-y-6">
            {[
              { doctor: 'Dr. Elena Rossi', specialty: 'Pediatric Care', status: 'Follow-up scheduled', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' },
              { doctor: 'Dr. Michael Vogt', specialty: 'Cardiac Specialist', status: 'Report Ready for Review', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[3.5rem] flex flex-col sm:flex-row items-center justify-between gap-8 border border-white dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all cursor-pointer group">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-md border-4 border-white dark:border-slate-700 shrink-0">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.doctor} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-800 dark:text-white text-xl leading-tight">{item.doctor}</h4>
                    <p className="text-[11px] text-[#2f80ed] font-black uppercase tracking-widest">{item.specialty}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{item.status}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => onNavigate(AppView.CONSULT)} className="bg-[#1e2a3a] dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                  Consult
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#1e2a3a] dark:bg-blue-700 rounded-[4rem] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-5xl border border-white/10 animate-pulse">📱</div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black leading-none tracking-tighter">AI Vision Scanner</h3>
              <p className="text-slate-400 dark:text-blue-100 text-lg font-medium leading-relaxed opacity-80">Digitize clinical documents and analyze doctor handwriting with high-precision computer vision.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate(AppView.SCANNER)}
            className="relative z-10 w-full bg-white text-[#1e2a3a] py-6 rounded-[2.5rem] font-black text-lg shadow-xl hover:scale-[1.05] transition-transform active:scale-95 mt-12 uppercase tracking-widest text-xs"
          >
            Open Scanner 🔍
          </button>

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] transition-transform duration-1000"></div>
        </div>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] max-w-xl w-full space-y-10 shadow-2xl border border-white/10">
            <div className="space-y-3 text-center">
              <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">New Health Log</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Detailed clinical observations for AI tracking.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Log Title</label>
                <input type="text" placeholder="e.g. Chronic Fatigue" className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-white/5 font-bold outline-none text-slate-800 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Observations</label>
                <textarea rows={5} placeholder="Describe symptoms clearly..." className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-white/5 font-bold outline-none text-slate-800 dark:text-white resize-none" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowLogModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-6 rounded-[2rem] font-black text-slate-500 uppercase tracking-widest text-xs">Cancel</button>
              <button onClick={() => { alert('Log Saved!'); setShowLogModal(false); }} className="flex-1 bg-[#2f80ed] text-white py-6 rounded-[2rem] font-black shadow-xl uppercase tracking-widest text-xs">Sync Log</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecordsSection;
