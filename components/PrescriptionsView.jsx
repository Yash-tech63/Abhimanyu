import React from 'react';

const PrescriptionsView = ({ onBack, onLaunchScanner }) => {
  const activePrescriptions = [
    { med: 'Amoxicillin 500mg', instructions: '1 capsule every 8 hours', daysLeft: 4, doctor: 'Dr. Sarah Mitchell' },
    { med: 'Metformin 1000mg', instructions: '1 tablet after dinner', daysLeft: 12, doctor: 'Dr. James Chen' },
  ];

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-slate-50">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-[#1e2a3a] tracking-tight">Prescription Vault</h2>
            <p className="text-slate-500 font-medium">Digital versions of your active medications and doctor notes.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {activePrescriptions.map((p, i) => (
               <div key={i} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-2xl transition-all">
                 <div className="flex items-center justify-between">
                   <div className="w-12 h-12 bg-blue-50 text-[#2f80ed] rounded-2xl flex items-center justify-center text-2xl">💊</div>
                   <span className="text-[10px] font-black bg-blue-100 text-[#2f80ed] px-3 py-1 rounded-full uppercase tracking-widest">{p.daysLeft} Days Left</span>
                 </div>
                 <div className="space-y-1">
                   <h4 className="text-xl font-black text-[#1e2a3a]">{p.med}</h4>
                   <p className="text-sm text-slate-500 font-medium">{p.instructions}</p>
                 </div>
                 <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.doctor}</p>
                 </div>
               </div>
             ))}
           </div>

           <div className="bg-slate-50 p-12 rounded-[4rem] border border-white shadow-inner space-y-6 text-center">
             <div className="text-5xl">📅</div>
             <h3 className="text-3xl font-black text-[#1e2a3a]">Refill Reminder</h3>
             <p className="text-slate-500 font-medium max-w-sm mx-auto">Your Metformin supply is running low. Would you like to order a refill from our smart pharmacy?</p>
             <button className="bg-[#1e2a3a] text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-xl hover:bg-[#2f80ed] transition-all">Order Refill Now</button>
           </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#1e2a3a] to-[#2f80ed] rounded-[4rem] p-10 text-white shadow-2xl h-full flex flex-col justify-between group">
             <div className="space-y-8">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-5xl animate-bounce">📱</div>
                <h3 className="text-4xl font-black leading-none">Scan & Digitalize</h3>
                <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-80">Quickly convert handwritten doctor notes into clear digital schedules with our AI Vision scanner.</p>
             </div>
             <button 
               onClick={onLaunchScanner}
               className="w-full bg-white text-[#1e2a3a] py-6 rounded-[2.5rem] font-black text-xl shadow-2xl group-hover:scale-105 transition-transform active:scale-95"
             >
               Launch AI Scanner
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsView;
