import React, { useState } from 'react';

const PrescriptionsView = ({ onBack, onLaunchScanner }) => {
  const [toast, setToast] = useState('');
  const [activePrescriptions] = useState([
    { med: 'Amoxicillin 500mg', instructions: '1 capsule every 8 hours after meals', daysLeft: 4, doctor: 'Dr. Sarah Mitchell', dosage: '14 Capsules Remaining' },
    { med: 'Metformin 1000mg', instructions: '1 tablet after dinner daily', daysLeft: 12, doctor: 'Dr. James Chen', dosage: '28 Tablets Remaining' },
  ]);

  const handleOrderRefill = () => {
    setToast('Smart Pharmacy Refill Order Placed! 💊');
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {toast && (
        <div className="fixed top-8 right-8 z-[200] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-sm animate-in fade-in flex items-center gap-3">
          <span>📦</span> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-100 dark:border-white/5">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Prescription Vault</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Digital versions of your active medications and doctor notes.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePrescriptions.map((p, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/90 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-6 group hover:shadow-2xl transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-[#2f80ed] rounded-2xl flex items-center justify-center text-2xl">💊</div>
                  <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-[#2f80ed] dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest">{p.daysLeft} Days Left</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-[#1e2a3a] dark:text-white group-hover:text-[#2f80ed] transition-colors">{p.med}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{p.instructions}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.doctor}</p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{p.dosage}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-10 md:p-12 rounded-[3.5rem] border border-white dark:border-white/5 shadow-inner space-y-6 text-center">
            <div className="text-5xl">📅</div>
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-[#1e2a3a] dark:text-white">Smart Refill Reminder</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-sm mx-auto">Your Metformin supply is running low. Would you like to order a refill from our smart pharmacy?</p>
            </div>
            <button
              onClick={handleOrderRefill}
              className="bg-[#1e2a3a] dark:bg-[#2f80ed] hover:bg-[#2f80ed] text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
            >
              Order Refill Now 📦
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#1e2a3a] to-[#2f80ed] rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl h-full flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl animate-bounce">📱</div>
              <h3 className="text-3xl font-black leading-tight">Scan & Digitalize</h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-90">Quickly convert handwritten doctor notes into clear digital schedules with our AI Vision scanner.</p>
            </div>
            <button 
              onClick={onLaunchScanner}
              className="relative z-10 w-full bg-white text-[#1e2a3a] py-5 rounded-[2rem] font-black text-sm shadow-2xl group-hover:scale-105 transition-transform active:scale-95 uppercase tracking-widest cursor-pointer mt-8"
            >
              Launch AI Scanner 🔍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsView;
