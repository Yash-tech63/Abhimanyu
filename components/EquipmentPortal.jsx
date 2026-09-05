import React, { useState, useMemo, useEffect } from 'react';

const assets = [
  { id: 'eq1', name: 'Ultra-Lightweight Wheelchair', brand: 'Drive Medical', category: 'Mobility', price: 18500, rentalPrice: 150, status: 'Available for Rent', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400', description: 'Dual axle for multiple seat-to-floor height adjustments.' },
  { id: 'eq2', name: 'Elite Oxygen Concentrator 5L', brand: 'Philips Respironics', category: 'Respiratory', price: 42000, rentalPrice: 500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', description: 'Small, lightweight, and quiet oxygen concentrator for home use.' },
  { id: 'eq3', name: 'Digital Patient Monitor V5', brand: 'Mindray', category: 'Monitoring', price: 65000, rentalPrice: 800, status: 'In Stock', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400', description: 'Advanced vitals monitoring for heart rate, SpO2, and NIBP.' },
  { id: 'eq4', name: 'Precision Mesh Nebulizer', brand: 'Omron', category: 'Respiratory', price: 4999, status: 'In Stock', image: 'https://images.unsplash.com/photo-1559839734-2b71f1e59816?auto=format&fit=crop&q=80&w=400', description: 'Silent mesh technology for efficient drug delivery.' },
];

const EquipmentPortal = ({ onBack, initialMode = 'buy' }) => {
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState(initialMode);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase().trim();
    return assets
      .filter(a => filter === 'All' || a.category === filter)
      .filter(a => {
        if (mode === 'rent') return !!a.rentalPrice;
        return true; 
      })
      .filter(a => a.name.toLowerCase().includes(q) || a.brand.toLowerCase().includes(q));
  }, [search, filter, mode]);

  return (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white dark:bg-slate-800 p-12 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-10 relative z-10">
          <button onClick={onBack} className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-[#2f80ed] transition-all border border-slate-100 dark:border-white/5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
              {mode === 'buy' ? 'Equipment Store' : mode === 'rent' ? 'Rental Portal' : 'Exchange Hub'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">Verified clinical hardware for recovery and clinical diagnostics.</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setMode('buy')} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'buy' ? 'bg-white dark:bg-slate-800 text-[#2f80ed] shadow-md' : 'text-slate-400'}`}
          >
            Buy
          </button>
          <button 
            onClick={() => setMode('rent')} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'rent' ? 'bg-white dark:bg-slate-800 text-[#2f80ed] shadow-md' : 'text-slate-400'}`}
          >
            Rent
          </button>
          <button 
            onClick={() => setMode('exchange')} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'exchange' ? 'bg-white dark:bg-slate-800 text-[#2f80ed] shadow-md' : 'text-slate-400'}`}
          >
            Exchange
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {['All', 'Mobility', 'Respiratory', 'Monitoring', 'Surgical'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              filter === cat ? 'bg-[#2f80ed] text-white shadow-2xl' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {mode === 'exchange' ? (
        <div className="bg-[#1e2a3a] dark:bg-blue-700 rounded-[4rem] p-20 text-white text-center space-y-8 animate-in zoom-in duration-500 relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="text-7xl text-purple-400">🤝</div>
              <h2 className="text-5xl font-black tracking-tighter">Equipment Donation & Exchange</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">Have old clinical gear? Donate it to Ayushman-verified clinics or exchange it for Pulse Health Credits to use on your next purchase.</p>
              <div className="flex justify-center gap-6 pt-8">
                <button className="bg-white text-[#1e2a3a] px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Donate Now</button>
                <button className="bg-white/10 border border-white/20 text-white px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">Check Trade-in Value</button>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="bg-white dark:bg-slate-800 p-6 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group flex flex-col active:scale-[0.98]">
              <div className="aspect-square rounded-[3rem] bg-slate-50 dark:bg-slate-900 overflow-hidden mb-8 relative border border-slate-50 dark:border-white/5 shadow-inner">
                <img src={asset.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={asset.name} />
                <div className="absolute top-5 right-5 bg-white/95 dark:bg-slate-900/90 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md">
                  <span className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest">{asset.brand}</span>
                </div>
              </div>
              
              <div className="space-y-4 px-2 flex-1 flex flex-col">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-[#2f80ed] transition-colors line-clamp-2 leading-tight tracking-tight">{asset.name}</h3>
                  <div className="flex items-center gap-2 pt-1">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{asset.status}</p>
                  </div>
                </div>
                
                <div className="pt-6 mt-auto flex flex-col gap-6">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      {mode === 'rent' ? (
                        <>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Rental Daily</span>
                          <span className="text-3xl font-black text-slate-800 dark:text-white">₹{asset.rentalPrice}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Purchase Price</span>
                          <span className="text-3xl font-black text-slate-800 dark:text-white">₹{asset.price.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button className="bg-[#2f80ed] text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                    {mode === 'rent' ? 'Book Rental' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentPortal;
