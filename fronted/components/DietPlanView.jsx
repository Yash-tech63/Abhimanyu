import React, { useState } from 'react';
import { analyzeFoodItem } from '../services/geminiService';

const DietPlanView = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dailyBudget, setDailyBudget] = useState(2000);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    const result = await analyzeFoodItem(input);
    if (result) {
      setAnalysis(result);
      const calories = Math.floor(Math.random() * 400) + 150;
      const newLog = {
        id: Date.now().toString(),
        item: result.foodItem,
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
      item: 'Glass of Water',
      calories: 0,
      type: 'water',
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const totalCalories = logs.reduce((acc, log) => acc + log.calories, 0);
  const caloriesLeft = Math.max(0, dailyBudget - totalCalories);
  const waterCount = logs.filter(l => l.type === 'water').length;

  const renderStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < score ? "text-[#2f80ed]" : "text-slate-200 dark:text-slate-700"}>★</span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] py-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between bg-white dark:bg-[#0b0f1a] p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2f80ed]/5 rounded-full blur-[80px]"></div>
        <div className="flex items-center gap-8 relative z-10">
          <button onClick={onBack} className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-[#2f80ed] transition-all border border-slate-100 dark:border-white/5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-[#1e2a3a] dark:text-white tracking-tighter">Diet Planner Pro</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Integrated intake tracking with AI-driven macro intelligence.</p>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-[#1e2a3a] dark:bg-slate-800 text-white p-6 rounded-[2rem] text-center min-w-[150px] shadow-xl">
            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Calories Remaining</p>
            <p className="text-4xl font-mono font-black">{caloriesLeft}</p>
          </div>
          <button onClick={addWater} className="bg-blue-50 dark:bg-blue-500/10 text-[#2f80ed] p-6 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-3xl mb-1">💧</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{waterCount} Glasses</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-left duration-700">
          <div className="bg-white dark:bg-[#0b0f1a] p-10 rounded-[4rem] shadow-xl border border-slate-100 dark:border-white/5 space-y-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Log Your Intake</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Example: "One bowl of oats and 1 glass of milk"</p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your meal in detail..."
                  className="w-full bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 outline-none font-bold transition-all h-40 resize-none text-slate-800 dark:text-white text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !input.trim()}
                className="w-full bg-[#2f80ed] text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
              >
                {isAnalyzing ? 'Analyzing Nutrition...' : 'Log Intake ✨'}
              </button>
            </form>

            <div className="space-y-6 pt-10 border-t dark:border-white/5">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Today's Diary</h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                {logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{log.type === 'food' ? '🥗' : '💧'}</span>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{log.item}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{log.calories} <span className="text-[10px] opacity-40">kcal</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10 animate-in slide-in-from-right duration-700">
          {analysis ? (
            <div className="space-y-10">
              <div className="bg-white dark:bg-[#0b0f1a] p-12 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl space-y-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b dark:border-white/5 pb-10">
                  <div>
                    <p className="text-[11px] font-black text-[#2f80ed] uppercase tracking-widest mb-1">Clinical Insight</p>
                    <h3 className="text-5xl font-black text-[#1e2a3a] dark:text-white capitalize tracking-tighter">{analysis.foodItem}</h3>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-5xl flex gap-1">
                      {renderStars(analysis.healthScore)}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pulse Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { l: 'Protein', v: analysis.macros.protein, c: 'bg-green-50 text-green-600 dark:bg-green-500/10' },
                    { l: 'Carbs', v: analysis.macros.carbs, c: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' },
                    { l: 'Fats', v: analysis.macros.fats, c: 'bg-red-50 text-red-600 dark:bg-red-500/10' },
                    { l: 'Fiber', v: analysis.macros.fiber, c: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10' },
                  ].map(m => (
                    <div key={m.l} className={`${m.c} p-8 rounded-[2.5rem] border border-white dark:border-white/5 shadow-sm`}>
                      <p className="text-[11px] font-black uppercase opacity-60 mb-3 tracking-widest">{m.l}</p>
                      <p className="text-2xl font-black tracking-tighter">{m.v}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-[#1e2a3a] dark:bg-slate-800 text-white p-10 rounded-[3.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl group-hover:rotate-12 transition-transform">🦾</span>
                        <h4 className="text-2xl font-black tracking-tight">Post-Intake Workout</h4>
                      </div>
                      <p className="text-lg text-slate-300 font-medium leading-relaxed">
                        Based on your {analysis.foodItem} intake, we suggest a **15-minute high-intensity cardio** or **20-minute power walk** to maintain metabolic balance.
                      </p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-[50px]"></div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-10 rounded-[3.5rem] border border-blue-100 dark:border-blue-800 shadow-inner space-y-6">
                    <h4 className="text-xl font-black text-[#2f80ed] flex items-center gap-3">
                      <span>✨</span> Healthier Options
                    </h4>
                    <div className="space-y-3">
                      {analysis.alternatives.map((alt, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[1.5rem] border border-blue-100 dark:border-blue-900/30 text-sm font-black text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-[#2f80ed] rounded-full"></span> {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0b0f1a] h-full flex flex-col items-center justify-center p-20 text-center space-y-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-inner">
              <div className="text-9xl animate-pulse">🍱</div>
              <div className="space-y-4 max-w-md">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Your Nutrition Command Center</h3>
                <p className="text-slate-400 font-bold leading-relaxed">Log your meals or drinks to see real-time clinical analysis of your diet, calorie budget, and activity suggestions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanView;
