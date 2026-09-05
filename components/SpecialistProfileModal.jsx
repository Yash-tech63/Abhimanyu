import React from 'react';

const SpecialistProfileModal = ({ specialist, onClose, onProceedToBooking }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#070b14]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/10 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* Header/Banner */}
        <div className="relative h-40 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all backdrop-blur-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-8 pb-10 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Portrait */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-8 border-white dark:border-[#1e293b] overflow-hidden shadow-2xl bg-white shrink-0">
              <img src={specialist.image} className="w-full h-full object-cover" alt={specialist.name} />
            </div>

            {/* Basic Info */}
            <div className="pt-4 md:pt-20 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-[#1e2a3a] dark:text-white tracking-tighter">{specialist.name}</h2>
                <div className="bg-blue-100 dark:bg-blue-500/20 text-[#2f80ed] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-200/50">
                  <span>✔</span> Verified
                </div>
              </div>
              <p className="text-lg font-bold text-[#2f80ed] uppercase tracking-widest">{specialist.specialty}</p>
              <div className="flex gap-4 text-xs font-bold text-slate-400">
                <span>{specialist.experience} Years Experience</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full my-auto"></span>
                <span>{specialist.availability.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Verification Details Block */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-xl">📜</div>
                <h3 className="font-black text-[#1e2a3a] dark:text-white uppercase text-[10px] tracking-widest">Clinical Credentials</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">MCI Registration Number</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">{specialist.mciNumber}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Education & Qualifications</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">{specialist.education}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-xl">🛡️</div>
                <h3 className="font-black text-[#1e2a3a] dark:text-white uppercase text-[10px] tracking-widest">Trust & Verification</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Verification Source</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">{specialist.verificationSource}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Profile Status</p>
                  <p className="text-sm font-black text-green-600 dark:text-green-400">Authenticity Guaranteed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic text-center">
              "This professional is part of the Pulseplus clinical network, having undergone rigorous identity and qualification screening as per MCI guidelines."
            </p>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Close Profile
            </button>
            <button 
              onClick={onProceedToBooking}
              className="flex-[2] px-8 py-5 rounded-2xl bg-[#2f80ed] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all"
            >
              Proceed to Booking • ₹{specialist.fee}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistProfileModal;
