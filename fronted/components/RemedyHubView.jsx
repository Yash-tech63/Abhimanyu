import React, { useState, useEffect } from 'react';
import { searchHomeRemedy } from '../services/geminiService';
import { AppView } from '../../backened/types';

const RemedyHubView = ({ onBack, onNavigate }) => {
  const [remedyQuery, setRemedyQuery] = useState('');
  const [remedyResult, setRemedyResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const curatedRemedies = [
    {
      id: 'turmeric-milk',
      title: 'Turmeric Milk (Haldi Doodh)',
      category: 'Immunity & Recovery',
      icon: '🥛',
      desc: 'Powerful anti-inflammatory drink for cold, joint pain, and wound healing.',
      benefits: 'Relieves joint pain, boosts natural immunity, reduces systemic inflammation, and promotes restful sleep.',
      ingredients: ['Whole Milk / Oat Milk - 1 cup', 'Wild Turmeric Powder (Haldi) - 1/2 tsp', 'Crushed Black Pepper - 1 pinch', 'Raw Honey or Ghee - 1/2 tsp'],
      preparation: 'Warm milk in a small saucepan. Add turmeric powder and crushed black pepper. Simmer gently for 3-5 minutes. Pour into a mug, stir in honey or ghee, and drink warm before bedtime.',
      dosage: '1 cup nightly before bed',
      precautions: 'Do not boil honey. Use low heat to retain active curcumin benefits.'
    },
    {
      id: 'ginger-honey-tea',
      title: 'Ginger Honey Tea',
      category: 'Digestive & Throat',
      icon: '🍵',
      desc: 'Relieves sore throat, indigestion, and morning sickness instantly.',
      benefits: 'Calms nausea, clears upper respiratory tract, aids gastric motility, and relieves sore throat irritation.',
      ingredients: ['Fresh Grated Ginger - 1 tbsp', 'Water - 1.5 cups', 'Raw Honey - 1 tbsp', 'Fresh Lemon Juice - 1 tsp'],
      preparation: 'Boil grated ginger in water for 5 to 7 minutes. Strain the tea into a cup. Allow to cool slightly, then mix in raw honey and fresh lemon juice. Sip slowly.',
      dosage: '1-2 cups daily',
      precautions: 'Add honey only after the tea has cooled down to room temperature to preserve enzymes.'
    },
    {
      id: 'tulsi-kadha',
      title: 'Tulsi & Black Pepper Decoction',
      category: 'Respiratory Care',
      icon: '🌿',
      desc: 'Traditional Kadha for decongestion and boosting innate immunity.',
      benefits: 'Clears chest congestion, fights seasonal cough and fever, and strengthens pulmonary defense.',
      ingredients: ['Fresh Tulsi Leaves - 10-12 leaves', 'Black Peppercorns - 4-5', 'Cloves (Laung) - 2-3', 'Crushed Ginger - 1/2 inch', 'Jaggery - 1 tsp'],
      preparation: 'Crush tulsi, peppercorns, cloves, and ginger. Boil in 2 cups of water until it reduces to 1 cup. Add jaggery for taste and strain. Drink warm.',
      dosage: '1/2 cup twice daily during cold/flu',
      precautions: 'Drink warm for best decongestant results.'
    },
    {
      id: 'fennel-water',
      title: 'Fennel (Saunf) Water',
      category: 'Gut & Metabolism',
      icon: '🌱',
      desc: 'Reduces bloating, aids acid reflux, and improves digestion after meals.',
      benefits: 'Relieves post-meal gas, eases stomach cramping, refreshes breath, and balances acid levels.',
      ingredients: ['Fennel Seeds (Saunf) - 1 tbsp', 'Water - 2 cups'],
      preparation: 'Soak 1 tbsp of fennel seeds in 2 cups of water overnight. In the morning, boil the mixture for 3 minutes, strain, and drink warm or cold.',
      dosage: '1 cup after heavy meals',
      precautions: 'Safe for daily long-term digestive support.'
    },
    {
      id: 'hing-dal-remedy',
      title: 'Hing & Cumin (Dal Gas Reliever)',
      category: 'Gut & Gas Relief',
      icon: '🍲',
      desc: 'Relieves dal-induced gas, bloating, and flatulence after meals.',
      benefits: 'Stimulates digestive fire (Agni), reduces gas formation from lentils/beans, and settles heaviness.',
      ingredients: ['Asafoetida (Hing) - 1 pinch', 'Cumin Seeds (Jeera) - 1/2 tsp', 'Warm Water or Buttermilk - 1 cup', 'Black Salt - 1 pinch'],
      preparation: 'Slightly warm cumin seeds and hing in 1/2 tsp ghee. Stir into warm water or fresh buttermilk with black salt. Drink 15 minutes after eating dal.',
      dosage: '1 cup after eating dal or heavy beans',
      precautions: 'Use high-grade pure Hing for optimal results.'
    }
  ];

  // Set default initial remedy on mount
  useEffect(() => {
    setRemedyResult(curatedRemedies[0]);
  }, []);

  const executeSearch = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    setIsSearching(true);
    const result = await searchHomeRemedy(queryText);
    if (result) {
      setRemedyResult(result);
    }
    setIsSearching(false);
  };

  const handleRemedySearch = (e) => {
    e.preventDefault();
    executeSearch(remedyQuery);
  };

  const handleQuickSymptomClick = (symptom) => {
    setRemedyQuery(symptom);
    executeSearch(symptom);
  };

  const handleSelectCurated = (item) => {
    setRemedyResult(item);
    setRemedyQuery(item.title);
  };

  const quickSymptoms = [
    { label: 'Dal & Bloating 🍲', query: 'dal gas bloating' },
    { label: 'Acidity / GERD 🥛', query: 'acidity' },
    { label: 'Cough & Cold 🍵', query: 'cough and cold' },
    { label: 'Fever & Immunity 🌿', query: 'fever' },
    { label: 'Headache & Stress 🧠', query: 'headache' },
    { label: 'Insomnia / Sleep 🌙', query: 'sleep issues' },
    { label: 'Constipation 💧', query: 'constipation' },
  ];

  return (
    <div className="min-h-screen bg-[#fffdf8] dark:bg-[#070b14] py-10 px-4 md:px-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-white dark:bg-[#0b0f1a] p-8 md:p-10 rounded-[3rem] border border-amber-200/60 dark:border-amber-500/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={onBack}
            className="w-14 h-14 bg-amber-100/70 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center text-amber-700 dark:text-amber-300 hover:scale-105 active:scale-95 transition-all border border-amber-200 dark:border-amber-800/30 shadow-sm"
            title="Go Back"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🍯</span>
              <h2 className="text-3xl md:text-4xl font-black text-amber-900 dark:text-amber-200 tracking-tight">
                Ayurvedic Remedy Hub
              </h2>
            </div>
            <p className="text-amber-800/80 dark:text-slate-300 font-medium text-base md:text-lg mt-1">
              Clinically verified home remedies, traditional kadhas & Ayurvedic healing wisdom.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(AppView.NUTRITION_GUIDE)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-2"
        >
          <span>Explore Nutrition Hub</span>
          <span>🥗</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search Vault & Active Remedy Display */}
        <div className="lg:col-span-8 space-y-8">
          {/* Remedy Search Vault */}
          <div className="bg-white dark:bg-[#0b0f1a] rounded-[3rem] p-8 md:p-10 border border-amber-200/50 dark:border-amber-500/10 shadow-xl space-y-6 relative overflow-hidden">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800/30">
                <span>🔍</span> Clinical Search Engine
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-amber-100 tracking-tight">
                Clinical Home Remedy Vault
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base">
                Search verified remedies for symptoms like "Dal gas", "Acidity", "Cough", "Fever", or "Sleep issues".
              </p>
            </div>

            {/* Quick Symptom Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {quickSymptoms.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSymptomClick(chip.query)}
                  className="bg-amber-50 hover:bg-amber-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-200/70 dark:border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleRemedySearch} className="flex flex-col sm:flex-row gap-3 p-2.5 bg-amber-50/50 dark:bg-slate-900/90 rounded-2xl border border-amber-200/60 dark:border-slate-800 shadow-inner">
              <div className="relative flex-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-60">🌿</span>
                <input
                  type="text"
                  value={remedyQuery}
                  onChange={(e) => setRemedyQuery(e.target.value)}
                  placeholder="Type symptom or item (e.g. Dal gas, Acidity, Sore Throat)..."
                  className="w-full pl-14 pr-6 py-4 rounded-xl bg-white dark:bg-slate-800 outline-none font-bold text-slate-800 dark:text-amber-100 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700 focus:border-amber-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Curating...</span>
                  </>
                ) : (
                  <>
                    <span>Search Vault</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </form>

            {/* Remedy Result Card */}
            {remedyResult && (
              <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-slate-900 dark:to-amber-950/20 p-6 md:p-8 rounded-[2.5rem] border border-amber-300/60 dark:border-amber-500/20 shadow-xl animate-in zoom-in-95 duration-300 space-y-6 relative">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 dark:border-amber-900/30 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                      Verified Remedy Formulations
                    </span>
                    <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-amber-100 tracking-tight mt-1">
                      {remedyResult.name || remedyResult.title}
                    </h4>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800/40 shadow-sm">
                    ✓ Clinically Filtered
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Benefits & Ingredients */}
                  <div className="space-y-6">
                    <div className="bg-white/80 dark:bg-slate-800/90 p-5 rounded-2xl border border-amber-200/50 dark:border-slate-700 shadow-sm space-y-2">
                      <p className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                        Primary Benefits
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed text-sm">
                        {remedyResult.benefits}
                      </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-800/90 p-5 rounded-2xl border border-amber-200/50 dark:border-slate-700 shadow-sm space-y-3">
                      <p className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                        Required Ingredients
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(remedyResult.ingredients) ? (
                          remedyResult.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className="bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-amber-300/50 dark:border-amber-800/30"
                            >
                              {ing}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {remedyResult.ingredients}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preparation & Dosage */}
                  <div className="space-y-6">
                    <div className="bg-white/80 dark:bg-slate-800/90 p-5 rounded-2xl border border-amber-200/50 dark:border-slate-700 shadow-sm space-y-2">
                      <p className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                        Preparation Method
                      </p>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium text-sm">
                        {remedyResult.preparation}
                      </p>
                    </div>

                    {(remedyResult.dosage || remedyResult.precautions) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {remedyResult.dosage && (
                          <div className="bg-amber-100/50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30 space-y-1">
                            <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                              Dosage & Frequency
                            </span>
                            <p className="text-xs font-bold text-amber-950 dark:text-amber-100">
                              {remedyResult.dosage}
                            </p>
                          </div>
                        )}
                        {remedyResult.precautions && (
                          <div className="bg-red-50/60 dark:bg-red-950/30 p-4 rounded-xl border border-red-200 dark:border-red-900/30 space-y-1">
                            <span className="text-[10px] font-black uppercase text-red-700 dark:text-red-300 tracking-wider">
                              Precautions
                            </span>
                            <p className="text-xs font-medium text-red-900 dark:text-red-200">
                              {remedyResult.precautions}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Curated Doctor-Approved Remedies Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-amber-100 tracking-tight">
                  Popular Doctor-Approved Remedies
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">
                  Click any remedy card below to view full preparation details and ingredients.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {curatedRemedies.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectCurated(item)}
                  className="bg-white dark:bg-[#0b0f1a] p-6 rounded-[2.5rem] border border-amber-200/40 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/40 transition-all cursor-pointer space-y-3 group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/30">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs font-medium leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    <span>View Preparation Steps</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ancient Wellness Science Banner */}
          <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-[3rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden border border-amber-500/30">
            <div className="space-y-4 relative z-10">
              <span className="text-4xl">🌿</span>
              <h3 className="text-2xl font-black leading-tight tracking-tight">
                Ancient Wellness & Diet Integration
              </h3>
              <p className="text-amber-100 font-medium text-sm leading-relaxed">
                Combine home remedies with customized diet plans for long-term holistic wellness and gut balance.
              </p>
              <button
                onClick={() => onNavigate(AppView.DIET_PLAN)}
                className="w-full bg-white text-amber-900 hover:bg-amber-50 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Diet Planner</span>
                <span>📋</span>
              </button>
            </div>
          </div>

          {/* Ayurvedic Tridosha Quick Reference */}
          <div className="bg-white dark:bg-[#0b0f1a] rounded-[3rem] p-8 shadow-xl border border-amber-200/50 dark:border-slate-800 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                Ayurvedic Principles
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-amber-100">
                Understanding Tridoshas
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
                  <span>💨 Vata (Air & Space)</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">Gas & Joint Dryness</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Use warm hing water, sesame oil, and cooked moong dal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
                  <span>🔥 Pitta (Fire & Water)</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">Acidity & Heat</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Use cold milk, fennel seeds, coconut water, and coriander tea.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
                  <span>🌊 Kapha (Earth & Water)</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">Cough & Congestion</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Use tulsi kadha, black pepper, ginger tea, and honey.
                </p>
              </div>
            </div>
          </div>

          {/* Ayushman Bharat Consultation */}
          <div className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-xl space-y-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🩺</span>
              <div>
                <h4 className="text-lg font-black text-white">Need Doctor Advice?</h4>
                <p className="text-slate-400 text-xs font-medium">Ayushman Bharat verified specialists.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(AppView.CONSULT)}
              className="w-full bg-[#2f80ed] hover:bg-blue-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Consult Doctor Now ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemedyHubView;
