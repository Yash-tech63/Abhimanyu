import React, { useState, useEffect } from 'react';

const AmbulancePortal = ({ onBack }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle');
  const [ayushmanVerified, setAyushmanVerified] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err)
      );
    }
  }, []);

  const handleDispatch = () => {
    setStatus('dispatching');
    setTimeout(() => setStatus('on-way'), 3000);
  };

  return (
    <div className="py-20 px-4 md:px-8 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 p-10 md:p-14 rounded-[4rem] border border-red-100 dark:border-red-900/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
           <div className="flex items-center gap-6">
              <button onClick={onBack} className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm">➔</button>
              <div>
                 <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Emergency Dispatch</h1>
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">Free 24/7 ACLS & BLS Ambulance Network.</p>
              </div>
           </div>
           <div className="flex items-center gap-4 bg-green-50 dark:bg-green-950/20 px-6 py-3 rounded-2xl border border-green-200/50">
              <span className="text-green-500 font-black text-xs uppercase tracking-widest">Network Status: Online</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 relative z-10">
           <div className="space-y-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6">
                 <h3 className="text-xl font-black text-[#1e2a3a] dark:text-white">Current Location Profile</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GPS Coordinates</span>
                       <span className="text-sm font-mono font-bold dark:text-white">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting...'}</span>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                       <div className="text-3xl">🏥</div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Nearest Hub</p>
                          <p className="text-sm font-black dark:text-white">Pulse ACLS Center - Zone 4</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#1e2a3a] dark:bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl border border-white/5">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black">Free Service Access</h3>
                    <input 
                      type="checkbox" 
                      checked={ayushmanVerified} 
                      onChange={() => setAyushmanVerified(!ayushmanVerified)} 
                      className="w-6 h-6 rounded-lg accent-green-500"
                    />
                 </div>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">Toggle to apply Ayushman Bharat (ABHA) digital ID for 100% cashless emergency transport.</p>
                 {ayushmanVerified && (
                   <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-green-400 text-xs font-black uppercase tracking-widest text-center animate-bounce">
                      Verified Health Identity - Free Dispatch Applied
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative border-8 border-white dark:border-slate-700 shadow-2xl h-[500px]">
              {/* Mock Map UI */}
              <div className="absolute inset-0 bg-slate-800">
                 <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-20 grayscale" alt="Map View" />
                 {status === 'idle' ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-slate-900/40 backdrop-blur-sm">
                      <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse">🆘</div>
                      <div className="space-y-2">
                         <h4 className="text-3xl font-black text-white">Require Dispatch?</h4>
                         <p className="text-slate-400 font-medium">Click below to activate the emergency response unit.</p>
                      </div>
                      <button 
                        onClick={handleDispatch}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-[2rem] font-black text-xl uppercase shadow-2xl transition-all"
                      >
                        Confirm Dispatch
                      </button>
                   </div>
                 ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in duration-500">
                      <div className="relative">
                         <div className="w-32 h-32 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center text-4xl">🚑</div>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-3xl font-black text-white">{status === 'dispatching' ? 'Locating Unit...' : 'ACLS Unit 402 Dispatched'}</h4>
                         <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">{status === 'dispatching' ? 'Allocating nearest vehicle' : 'ETA: 4 MINUTES 12 SECONDS'}</p>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-red-500 animate-[progress_10s_linear_infinite]"></div>
                      </div>
                      <button className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all">Cancel Dispatch</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { l: 'ACLS Unit', d: 'Critical Care, Ventilator Support', i: '🔋' },
           { l: 'BLS Unit', d: 'Basic First Aid, Oxygen Support', i: '📦' },
           { l: 'Air Medevac', d: 'Inter-city Helicopter dispatch', i: '🚁' }
         ].map(u => (
           <div key={u.l} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
              <div className="text-4xl">{u.i}</div>
              <h4 className="text-xl font-black dark:text-white">{u.l}</h4>
              <p className="text-sm text-slate-500 font-medium">{u.d}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AmbulancePortal;
