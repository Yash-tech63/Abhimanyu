import React, { useState } from 'react';
import { searchHomeRemedy } from '../services/geminiService';
import { AppView } from '../backened/types';

const NutritionGuideView = ({ onBack, onNavigate }) => {
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

  return (
    <div className="min-h-screen bg-[#fffcf5] dark:bg-[#070b14] py-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between bg-white dark:bg-[#0b0f1a] p-10 rounded-[3.5rem] border border-orange-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-200/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-8 relative z-10">
          <button onClick={onBack} className="w-16 h-16 bg-orange-50 dark:bg-orange-950/20 rounded-[1.5rem] flex items-center justify-center text-orange-400 hover:text-orange-600 transition-all border border-orange-100 dark:border-white/5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-[#8b4513] dark:text-orange-200 tracking-tighter leading-none">Nutrition Hub</h2>
            <p className="text-orange-900/40 dark:text-slate-400 font-medium text-lg mt-1">Verified traditional remedies and essential nutrient encyclopedia.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(AppView.DIET_PLAN)}
          className="bg-[#8b4513] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/20 hover:scale-105 active:scale-95 transition-all relative z-10"
        >
          Enter Diet Planner App 📋
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Workspace: Remedies */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white dark:bg-[#0b0f1a] rounded-[4rem] p-12 border border-orange-50 dark:border-white/5 shadow-xl space-y-10 relative overflow-hidden">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-[#8b4513] dark:text-orange-200 tracking-tight">Clinical Home Remedy Vault</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Deep clinical verification for traditional wisdom. Search for specific needs like "Heartburn", "Immunity" or "Dalia benefits".</p>
            </div>

            <form onSubmit={handleRemedySearch} className="flex flex-col md:flex-row gap-4 p-3 bg-[#fffcf5] dark:bg-slate-900 rounded-[2.5rem] border border-orange-100 dark:border-white/5 shadow-inner">
              <div className="relative flex-1">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-40">🍃</span>
                <input
                  type="text"
                  value={remedyQuery}
                  onChange={(e) => setRemedyQuery(e.target.value)}
                  placeholder="Ask for a remedy or food benefit..."
                  className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white dark:bg-slate-800 outline-none font-bold text-[#8b4513] dark:text-orange-100 text-lg placeholder:text-orange-200 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#8b4513] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-[#a0522d] transition-all disabled:opacity-50 active:scale-95 shadow-lg"
              >
                {isSearching ? 'Curating Remedy...' : 'Search Vault'}
              </button>
            </form>

            {remedyResult && (
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-orange-50 dark:border-white/5 shadow-2xl animate-in zoom-in-95 duration-500 space-y-8 relative">
                <div className="absolute top-8 right-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-200">Clinically Filtered</div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Selected Remedy</p>
                  <h4 className="text-4xl font-black text-[#8b4513] dark:text-orange-200 tracking-tighter">{remedyResult.name}</h4>
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
                          <span key={i} className="bg-orange-50 dark:bg-orange-950/20 text-[#8b4513] dark:text-orange-200 px-5 py-2 rounded-2xl text-xs font-black border border-orange-100 dark:border-orange-900/20">{ing}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#fffcf5] dark:bg-slate-800 p-8 rounded-[2.5rem] border border-orange-50 dark:border-white/5 shadow-inner">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4">Preparation Method</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic text-lg">{remedyResult.preparation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#0b0f1a] p-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-xl space-y-6 group cursor-pointer hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left">🧬</div>
              <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Daily Metabolism Guide</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Personalized macro breakdown based on your genetic traits and active logs.</p>
              <button className="text-[10px] font-black text-[#2f80ed] uppercase tracking-[0.2em] border-b-2 border-[#2f80ed] pb-1">View Full Guide</button>
            </div>
            <div className="bg-[#1e2a3a] dark:bg-slate-800 p-10 rounded-[4rem] text-white shadow-2xl space-y-6 group cursor-pointer hover:-translate-y-2 transition-all">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left">🥗</div>
              <h3 className="text-2xl font-black tracking-tight">Pulse Wellness Encyclopedia</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Search thousands of ingredients and their clinical health scores instantly.</p>
              <button className="text-[10px] font-black text-[#2f80ed] uppercase tracking-[0.2em] border-b-2 border-[#2f80ed] pb-1">Open Encyclopedia</button>
            </div>
          </div>
        </div>

        {/* Essential Sidebar */}
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-right duration-700">
          <div className="bg-white dark:bg-[#0b0f1a] rounded-[3.5rem] p-10 shadow-xl border border-slate-100 dark:border-white/5 space-y-10">
            <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Essential Nutrients</h3>
            <div className="space-y-6">
              {[
                { name: 'Vitamin C', source: 'Oranges, Lemons, Peppers', benefit: 'Immunity & Skin Health', icon: '🍋', c: 'bg-yellow-50 text-yellow-600' },
                { name: 'Omega-3', source: 'Walnuts, Chia, Flaxseeds', benefit: 'Heart & Brain Function', icon: '🧠', c: 'bg-blue-50 text-blue-600' },
                { name: 'Iron', source: 'Spinach, Lentils, Beans', benefit: 'Energy & Blood Health', icon: '🩸', c: 'bg-red-50 text-red-600' },
                { name: 'Magnesium', source: 'Almonds, Dark Chocolate', benefit: 'Sleep & Muscle Recovery', icon: '🌙', c: 'bg-purple-50 text-purple-600' },
              ].map(nut => (
                <div key={nut.name} className="flex gap-5 group items-center">
                  <div className={`${nut.c} dark:bg-slate-800 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm border border-white dark:border-white/5 group-hover:scale-110 transition-transform`}>
                    {nut.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white">{nut.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{nut.benefit}</p>
                    <p className="text-[9px] font-bold text-[#2f80ed] mt-1">{nut.source}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full bg-slate-100 dark:bg-slate-900 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-200 transition-all">View Full Periodic Table</button>
          </div>

          <div className="bg-gradient-to-br from-[#8b4513] to-[#a0522d] rounded-[3.5rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/20">🧘‍♂️</div>
              <h4 className="text-3xl font-black leading-none tracking-tight">Integrated Yoga Flow</h4>
              <p className="text-lg text-orange-100/70 font-medium leading-relaxed">Match your current nutritional needs with specific yoga postures for better absorption.</p>
              <button
                onClick={() => onNavigate(AppView.YOGA)}
                className="w-full bg-white text-[#8b4513] py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                Access Academy Studio
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 text-8xl opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000">🌿</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionGuideView;
