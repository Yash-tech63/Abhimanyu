import React, { useState } from 'react';
import { analyzeFoodItem } from '../services/geminiService';

const DietPlanView = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dailyBudget, setDailyBudget] = useState(2000);
  const [waterToast, setWaterToast] = useState(false);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    const result = await analyzeFoodItem(input);
    if (result) {
      setAnalysis(result);
      const calories = result.calories || 320;
      const newLog = {
        id: Date.now().toString(),
        item: result.foodItem || input,
        calories: calories,
        type: 'food',
        timestamp: Date.now()
      };
      setLogs(prev => [newLog, ...prev]);
    }
    setIsAnalyzing(false);
    setInput('');
  };

  const handleQuickMeal = async (mealText) => {
    setInput(mealText);
    setIsAnalyzing(true);
    const result = await analyzeFoodItem(mealText);
    if (result) {
      setAnalysis(result);
      const calories = result.calories || 320;
      const newLog = {
        id: Date.now().toString(),
        item: result.foodItem || mealText,
        calories: calories,
        type: 'food',
        timestamp: Date.now()
      };
      setLogs(prev => [newLog, ...prev]);
    }
    setIsAnalyzing(false);
    setInput('');
  };

  const addWater = () => {
    const newLog = {
      id: Date.now().toString(),
      item: 'Glass of Water (250ml)',
      calories: 0,
      type: 'water',
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
    setWaterToast(true);
    setTimeout(() => setWaterToast(false), 2000);
  };

  const removeLog = (id) => {
    setLogs(prev => prev.filter(item => item.id !== id));
  };

  const clearLogs = () => {
    setLogs([]);
    setAnalysis(null);
  };

  const totalCalories = logs.reduce((acc, log) => acc + log.calories, 0);
  const caloriesLeft = Math.max(0, dailyBudget - totalCalories);
  const waterCount = logs.filter(l => l.type === 'water').length;

  const renderStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < score ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}>★</span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] py-8 px-4 md:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-white dark:bg-[#0b0f1a] p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2f80ed]/5 rounded-full blur-[80px]"></div>
        <div className="flex items-center gap-6 relative z-10">
          <button onClick={onBack} className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-[#2f80ed] hover:scale-105 active:scale-95 transition-all border border-slate-100 dark:border-white/5 cursor-pointer">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1e2a3a] dark:text-white tracking-tighter">Diet Planner Pro</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Integrated intake tracking with AI-driven macro intelligence.</p>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 w-full md:w-auto items-center">
          <div className="flex-1 md:flex-none bg-[#1e2a3a] dark:bg-slate-800 text-white px-6 py-4 rounded-[2rem] text-center min-w-[150px] shadow-xl">
            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-0.5">Calories Remaining</p>
            <p className="text-3xl font-mono font-black text-emerald-400">{caloriesLeft} <span className="text-xs font-sans text-slate-400">kcal</span></p>
          </div>
          <button onClick={addWater} className="relative bg-blue-50 dark:bg-blue-500/10 text-[#2f80ed] px-6 py-4 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center min-w-[110px] cursor-pointer">
            <span className="text-2xl mb-0.5">💧</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{waterCount} Glasses</span>
            {waterToast && (
              <span className="absolute -bottom-8 bg-[#2f80ed] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">
                +1 Glass!
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Log Intake */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0b0f1a] p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/5 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Log Your Intake</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type your meal or tap a quick meal chip below:</p>
            </div>

            {/* Quick Meal Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { name: "🥣 Oats & Milk", query: "1 bowl of oats and 1 glass of milk" },
                { name: "🍲 Dal & Roti", query: "1 bowl of dal and 2 multigrain rotis" },
                { name: "🥗 Sprouts Salad", query: "1 bowl of mixed sprouted moong salad" },
                { name: "🍳 2 Eggs & Toast", query: "2 boiled eggs with brown bread toast" }
              ].map((chip) => (
                <button
                  key={chip.name}
                  type="button"
                  onClick={() => handleQuickMeal(chip.query)}
                  className="text-[11px] font-black bg-slate-100 dark:bg-slate-800/80 hover:bg-[#2f80ed] hover:text-white dark:hover:bg-[#2f80ed] text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-2xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {chip.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your meal in detail..."
                  className="w-full bg-slate-50 dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 outline-none font-bold transition-all h-36 resize-none text-slate-800 dark:text-white text-base focus:border-[#2f80ed]"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !input.trim()}
                className="w-full bg-[#2f80ed] hover:bg-[#2566c7] text-white py-4 rounded-[1.5rem] font-black text-lg shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 cursor-pointer flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin text-xl">⏳</span> Analyzing Macro Intake...
                  </>
                ) : (
                  'Log Intake ✨'
                )}
              </button>
            </form>

            {/* Today's Diary */}
            <div className="space-y-4 pt-6 border-t dark:border-white/5">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Diary ({logs.length})</h4>
                {logs.length > 0 && (
                  <button onClick={clearLogs} className="text-[10px] font-black text-red-500 hover:underline cursor-pointer">
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    No items logged yet. Type a meal above or tap 💧 Water!
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/80 rounded-[1.5rem] border border-slate-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-slate-800 group">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{log.type === 'food' ? '🥗' : '💧'}</span>
                        <div>
                          <p className="text-xs font-black text-slate-800 dark:text-white line-clamp-1">{log.item}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-black text-slate-800 dark:text-white">{log.calories} <span className="text-[9px] opacity-40">kcal</span></p>
                        <button onClick={() => removeLog(log.id)} className="text-slate-300 hover:text-red-500 text-xs transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Nutrition Command Center / Clinical Insight */}
        <div className="lg:col-span-8 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="bg-white dark:bg-[#0b0f1a] p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b dark:border-white/5 pb-6">
                  <div>
                    <p className="text-[11px] font-black text-[#2f80ed] uppercase tracking-widest mb-1">Clinical Insight</p>
                    <h3 className="text-3xl md:text-4xl font-black text-[#1e2a3a] dark:text-white capitalize tracking-tight">{analysis.foodItem}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <div className="text-3xl flex gap-1">
                        {renderStars(analysis.healthScore)}
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pulse Score ({analysis.healthScore}/5)</p>
                    </div>
                  </div>
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: 'Protein', v: analysis.macros?.protein || '14g', c: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
                    { l: 'Carbs', v: analysis.macros?.carbs || '45g', c: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
                    { l: 'Fats', v: analysis.macros?.fats || '8g', c: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' },
                    { l: 'Fiber', v: analysis.macros?.fiber || '5g', c: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
                  ].map(m => (
                    <div key={m.l} className={`${m.c} p-6 rounded-[2rem] border border-white dark:border-white/5 shadow-sm`}>
                      <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">{m.l}</p>
                      <p className="text-2xl font-black tracking-tight">{m.v}</p>
                    </div>
                  ))}
                </div>

                {/* Ingredient Warnings */}
                {analysis.warnings && analysis.warnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-6 rounded-[2rem] space-y-2">
                    <h4 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <span>⚠️</span> Clinical Advisory & Ingredient Notes
                    </h4>
                    <ul className="list-disc list-inside text-xs font-bold text-amber-800 dark:text-amber-300 space-y-1">
                      {analysis.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Workout Recommendation & Healthier Alternatives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1e2a3a] dark:bg-slate-800 text-white p-8 rounded-[2.5rem] space-y-4 shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl group-hover:rotate-12 transition-transform">🦾</span>
                        <h4 className="text-xl font-black tracking-tight">Post-Intake Workout</h4>
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">
                        Based on your <strong className="text-white">{analysis.foodItem}</strong> intake, we suggest a <strong>15-minute brisk walk</strong> or <strong>10 minutes of light yoga stretching</strong> to optimize glucose absorption.
                      </p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-[40px]"></div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 shadow-inner space-y-4">
                    <h4 className="text-base font-black text-[#2f80ed] flex items-center gap-2">
                      <span>✨</span> Healthier Alternatives
                    </h4>
                    <div className="space-y-2">
                      {(analysis.alternatives || []).map((alt, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-3.5 rounded-[1.2rem] border border-blue-100 dark:border-blue-900/30 text-xs font-black text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2.5">
                          <span className="w-2 h-2 bg-[#2f80ed] rounded-full flex-shrink-0"></span> {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0b0f1a] h-full min-h-[450px] flex flex-col items-center justify-center p-12 text-center space-y-6 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-inner">
              <div className="text-8xl animate-pulse">🍱</div>
              <div className="space-y-3 max-w-md">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Nutrition Command Center</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">Log your meals or drinks to see real-time clinical analysis of your diet, calorie budget, and activity suggestions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanView;
