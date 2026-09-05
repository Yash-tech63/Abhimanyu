import React, { useState } from 'react';
import { searchHomeRemedy } from '../services/geminiService';
import { AppView } from '../backened/types';

const RemedyHubView = ({ onBack, onNavigate }) => {
  const [remedyQuery, setRemedyQuery] = useState('');
  const [remedyResult, setRemedyResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleRemedySearch = async (e) => {
    e.preventDefault();
    if (!remedyQuery.trim()) return;
    setIsSearching(true);
    const result = await searchHomeRemedy(remedyQuery);
    setRemedyResult(result);
    setIsSearching(false);
  };

  const curatedRemedies = [
    { title: 'Turmeric Milk (Haldi Doodh)', category: 'Immunity & Recovery', icon: '🥛', desc: 'Powerful anti-inflammatory drink for cold, joint pain, and wound healing.' },
    { title: 'Ginger Honey Tea', category: 'Digestive & Throat', icon: '🍵', desc: 'Relieves sore throat, indigestion, and morning sickness instantly.' },
    { title: 'Tulsi & Black Pepper Decoction', category: 'Respiratory Care', icon: '🌿', desc: 'Traditional Kadha for decongestion and boosting innate immunity.' },
    { title: 'Fennel (Saunf) Water', category: 'Gut & Metabolism', icon: '🌱', desc: 'Reduces bloating, aids acid reflux, and improves digestion after meals.' },
  ];

  return (
    <div className="min-h-screen bg-[#fffcf5] dark:bg-[#070b14] py-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between bg-white dark:bg-[#0b0f1a] p-10 rounded-[3.5rem] border border-amber-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-8 relative z-10">
          <button onClick={onBack} className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 rounded-[1.5rem] flex items-center justify-center text-amber-500 hover:text-amber-700 transition-all border border-amber-100 dark:border-white/5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-[#7c3aed] dark:text-amber-200 tracking-tighter leading-none flex items-center gap-3">
              <span>🍯</span> Remedy Hub
            </h2>
            <p className="text-amber-900/50 dark:text-slate-400 font-medium text-lg mt-1">Clinical Home Remedies & Ancient Ayurvedic Secrets.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(AppView.NUTRITION_GUIDE)}
          className="bg-[#7c3aed] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all relative z-10"
        >
          Explore Nutrition Hub 🥗
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Remedy Search Vault */}
          <div className="bg-white dark:bg-[#0b0f1a] rounded-[4rem] p-12 border border-amber-100 dark:border-white/5 shadow-xl space-y-10 relative overflow-hidden">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-800 dark:text-amber-200 tracking-tight">Clinical Home Remedy Vault</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Search clinically verified home remedies for specific symptoms like "Acidity", "Cough", or "Sleep issues".</p>
            </div>

            <form onSubmit={handleRemedySearch} className="flex flex-col md:flex-row gap-4 p-3 bg-[#fffcf5] dark:bg-slate-900 rounded-[2.5rem] border border-amber-100 dark:border-white/5 shadow-inner">
              <div className="relative flex-1">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-40">🍯</span>
                <input
                  type="text"
                  value={remedyQuery}
                  onChange={(e) => setRemedyQuery(e.target.value)}
                  placeholder="Type symptom or illness (e.g. Heartburn, Immunity)..."
                  className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white dark:bg-slate-800 outline-none font-bold text-slate-800 dark:text-amber-100 text-lg placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#7c3aed] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-[#6d28d9] transition-all disabled:opacity-50 active:scale-95 shadow-lg"
              >
                {isSearching ? 'Curating Remedy...' : 'Search Vault'}
              </button>
            </form>

            {remedyResult && (
              <div className="bg-amber-50/50 dark:bg-slate-900 p-10 rounded-[3.5rem] border border-amber-200 dark:border-white/5 shadow-2xl animate-in zoom-in-95 duration-500 space-y-8 relative">
                <div className="absolute top-8 right-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-200">Clinically Filtered</div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Verified Remedy</p>
                  <h4 className="text-4xl font-black text-slate-800 dark:text-amber-200 tracking-tighter">{remedyResult.name}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Primary Benefits</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-lg">{remedyResult.benefits}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Ingredients Required</p>
                      <div className="flex flex-wrap gap-2">
                        {remedyResult.ingredients.map((ing, i) => (
                          <span key={i} className="bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-200 px-5 py-2 rounded-2xl text-xs font-black border border-amber-200 dark:border-amber-900/20">{ing}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-amber-100 dark:border-white/5 shadow-inner">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4">Preparation Method</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic text-lg">{remedyResult.preparation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Curated Remedies Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Popular Doctor-Approved Remedies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curatedRemedies.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-[#0b0f1a] p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-md hover:shadow-xl transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-4 py-1.5 rounded-full">{item.category}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-[3.5rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className="text-5xl">🌿</span>
              <h3 className="text-3xl font-black leading-tight tracking-tight">Ancient Wellness Science</h3>
              <p className="text-amber-100 font-medium text-lg leading-relaxed">Combine home remedies with customized diet plans for long-term holistic wellness.</p>
              <button
                onClick={() => onNavigate(AppView.DIET_PLAN)}
                className="w-full bg-white text-amber-800 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                Launch Diet Planner 📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemedyHubView;
