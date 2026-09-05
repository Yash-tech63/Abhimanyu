import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../../backened/types';
import { translations } from '../../backened/i18n';
import RentalBookingModal from './RentalBookingModal';
import { DonateModal, TradeInModal } from './ExchangeModals';

const assets = [
  { id: 'eq1', name: 'Ultra-Lightweight Wheelchair', brand: 'Drive Medical', category: 'Mobility', price: 18500, rentalPrice: 150, status: 'Available for Rent', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400', description: 'Dual axle for multiple seat-to-floor height adjustments.' },
  { id: 'eq2', name: 'Elite Oxygen Concentrator 5L', brand: 'Philips Respironics', category: 'Respiratory', price: 42000, rentalPrice: 500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', description: 'Small, lightweight, and quiet oxygen concentrator for home use.' },
  { id: 'eq3', name: 'Digital Patient Monitor V5', brand: 'Mindray', category: 'Monitoring', price: 65000, rentalPrice: 800, status: 'In Stock', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400', description: 'Advanced vitals monitoring for heart rate, SpO2, and NIBP.' },
  { id: 'eq4', name: 'Precision Mesh Nebulizer', brand: 'Omron', category: 'Respiratory', price: 4999, status: 'In Stock', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400', description: 'Silent mesh technology for efficient drug delivery.' },
];

const exchangeAssets = [
  { id: 'ex1', name: 'Refurbished Foldable Wheelchair', brand: 'Drive Medical', category: 'Mobility', tradeValue: 6500, credits: 1300, condition: 'Verified Serviced', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400', description: 'Certified pre-owned wheelchair with new memory foam seat padding.' },
  { id: 'ex2', name: 'Pre-Owned Oxygen Concentrator 5L', brand: 'Philips Respironics', category: 'Respiratory', tradeValue: 15000, credits: 3000, condition: 'Sanitized & Tested', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', description: 'High purity 95% O2 flow unit, fully serviced with new air filters.' },
  { id: 'ex3', name: 'Recycled Hospital Bed with Mattress', brand: 'Godrej Interio', category: 'Mobility', tradeValue: 12000, credits: 2400, condition: 'Grade A Pre-Owned', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400', description: 'Adjustable headrest & side safety rails for home recovery.' },
  { id: 'ex4', name: 'Refurbished Multi-Para Patient Monitor', brand: 'BPL Medical', category: 'Monitoring', tradeValue: 18500, credits: 3700, condition: 'Calibrated & Certified', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400', description: 'Complete vitals suite with brand new SpO2 sensor & BP cuff.' },
  { id: 'ex5', name: 'Reconditioned Mesh Nebulizer Unit', brand: 'Omron', category: 'Respiratory', tradeValue: 2499, credits: 500, condition: 'Clinic Certified', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400', description: 'Ultra-quiet ultrasonic mesh chamber with sterilised mask kit.' },
];

const assetHindiNames = {
  eq1: 'अल्ट्रा-लाइटवेट व्हीलचेयर',
  eq2: 'ऑक्सीजन कंसंट्रेटर 5L',
  eq3: 'डिजिटल पेशेंट मॉनिटर V5',
  eq4: 'प्रिसिजन मेश नेब्युलाइज़र',
  ex1: 'रिफर्बिश्ड फोल्डेबल व्हीलचेयर',
  ex2: 'प्री-ओन्ड ऑक्सीजन कंसंट्रेटर 5L',
  ex3: 'रीसाइकिल्ड हॉस्पिटल बेड',
  ex4: 'रिफर्बिश्ड पेशेंट मॉनिटर',
  ex5: 'रिकंडीशन्ड मेश नेब्युलाइज़र'
};

const assetHindiStatus = {
  'Available for Rent': 'किराये के लिए उपलब्ध',
  'In Stock': 'स्टॉक में उपलब्ध',
  'Verified Serviced': 'सत्यापित सर्विस किया गया',
  'Sanitized & Tested': 'सैनिटाइज्ड एवं टेस्टेड',
  'Grade A Pre-Owned': 'ग्रेड A प्री-ओन्ड',
  'Calibrated & Certified': 'कैलिब्रेटेड एवं प्रमाणित',
  'Clinic Certified': 'क्लिनिक प्रमाणित'
};

const EquipmentPortal = ({ onBack, initialMode = 'buy', lang = Language.EN, onAddToCart }) => {
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState(initialMode);
  const [search, setSearch] = useState('');
  const [addedItems, setAddedItems] = useState({});
  const [selectedRentalAsset, setSelectedRentalAsset] = useState(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const isHindi = lang === Language.HI;
  const eqT = translations[lang]?.equipment || translations[Language.EN].equipment;

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleAction = (asset) => {
    if (mode === 'rent') {
      setSelectedRentalAsset(asset);
    } else {
      const itemKey = `${asset.id}-${mode}`;
      if (onAddToCart) {
        onAddToCart({
          id: asset.id,
          name: asset.name,
          brand: asset.brand,
          category: asset.category,
          price: asset.tradeValue || asset.price,
          image: asset.image,
          mode: mode
        });
        setAddedItems((prev) => ({ ...prev, [itemKey]: true }));
        setTimeout(() => {
          setAddedItems((prev) => ({ ...prev, [itemKey]: false }));
        }, 2000);
      }
    }
  };

  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase().trim();
    const sourceList = mode === 'exchange' ? exchangeAssets : assets;
    return sourceList
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
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
              {mode === 'buy' ? eqT.storeTitle : mode === 'rent' ? eqT.rentalTitle : eqT.exchangeTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg mt-2">{eqT.subtitle}</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setMode('buy')} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'buy' ? 'bg-white dark:bg-slate-800 text-[#2f80ed] shadow-md' : 'text-slate-400'}`}
          >
            {eqT.buy}
          </button>
          <button 
            onClick={() => setMode('rent')} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'rent' ? 'bg-white dark:bg-slate-800 text-[#2f80ed] shadow-md' : 'text-slate-400'}`}
          >
            {eqT.rent}
          </button>
          <button 
            onClick={() => setMode('exchange')} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'exchange' ? 'bg-white dark:bg-slate-800 text-[#2f80ed] shadow-md' : 'text-slate-400'}`}
          >
            {eqT.exchange}
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
        <div className="space-y-12 animate-in zoom-in duration-500">
          {/* Top Donation & Trade-In Action Banner */}
          <div className="bg-[#1e2a3a] dark:bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white text-center space-y-8 relative overflow-hidden shadow-2xl border border-white/5">
            <div className="relative z-10 space-y-6">
              <div className="text-7xl text-purple-400">🤝</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{eqT.donationTitle}</h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">{eqT.donationDesc}</p>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-400/30"
                >
                  🎁 {eqT.donateNow || 'Donate Equipment Now'}
                </button>
                <button
                  onClick={() => setIsTradeInOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl"
                >
                  ⚖️ {eqT.checkTradeIn || 'Check Trade-In Value'}
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
          </div>

          {/* Exchange Items Grid */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4 border-b dark:border-white/5 pb-4">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Verified Refurbished & Exchange Inventory
              </h3>
              <span className="text-xs font-black text-purple-500 uppercase tracking-widest">
                {filteredAssets.length} Verified Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="bg-white dark:bg-slate-800 p-6 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group flex flex-col active:scale-[0.98]">
                  <div className="aspect-square rounded-[3rem] bg-slate-50 dark:bg-slate-900 overflow-hidden mb-8 relative border border-slate-50 dark:border-white/5 shadow-inner">
                    <img src={asset.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={asset.name} />
                    <div className="absolute top-5 right-5 bg-purple-600/90 text-white px-3.5 py-1.5 rounded-2xl shadow-xl backdrop-blur-md">
                      <span className="text-[10px] font-black uppercase tracking-widest">{asset.condition || 'Verified'}</span>
                    </div>
                  </div>

                  <div className="space-y-4 px-2 flex-1 flex flex-col">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest block">{asset.brand}</span>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-[#2f80ed] transition-colors line-clamp-2 leading-tight tracking-tight">{asset.name}</h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-2 pt-1">{asset.description}</p>
                    </div>

                    <div className="pt-4 mt-auto flex flex-col gap-4 border-t dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exchange Value</span>
                          <span className="text-2xl font-black text-slate-800 dark:text-white">₹{asset.tradeValue?.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Health Credits</span>
                          <span className="text-xs font-black text-purple-600 dark:text-purple-400 block">{asset.credits} Credits</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAction(asset)}
                        className={`py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg cursor-pointer ${
                          addedItems[`${asset.id}-${mode}`]
                            ? 'bg-green-500 text-white shadow-green-500/30 scale-105'
                            : 'bg-purple-600 hover:bg-purple-700 active:scale-95 text-white shadow-purple-500/20 hover:scale-105'
                        }`}
                      >
                        {addedItems[`${asset.id}-${mode}`] ? 'Added to Cart! ✓' : '🤝 CLAIM / EXCHANGE NOW'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-[#2f80ed] transition-colors line-clamp-2 leading-tight tracking-tight">
                    {isHindi ? (assetHindiNames[asset.id] || asset.name) : asset.name}
                  </h3>
                  <div className="flex items-center gap-2 pt-1">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                       {isHindi ? (assetHindiStatus[asset.status] || asset.status) : asset.status}
                     </p>
                  </div>
                </div>
                
                <div className="pt-6 mt-auto flex flex-col gap-6">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      {mode === 'rent' ? (
                        <>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{eqT.rentalDaily}</span>
                          <span className="text-3xl font-black text-slate-800 dark:text-white">₹{asset.rentalPrice}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{eqT.purchasePrice}</span>
                          <span className="text-3xl font-black text-slate-800 dark:text-white">₹{asset.price.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAction(asset)}
                    className={`py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg cursor-pointer ${
                      addedItems[`${asset.id}-${mode}`]
                        ? 'bg-green-500 text-white shadow-green-500/30 scale-105'
                        : 'bg-[#2f80ed] hover:bg-blue-600 active:scale-95 text-white shadow-blue-500/20 hover:scale-105'
                    }`}
                  >
                    {addedItems[`${asset.id}-${mode}`]
                      ? 'Added to Cart! ✓'
                      : mode === 'rent'
                      ? `🗓️ ${eqT.bookRental}`
                      : eqT.addToCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dedicated Rental Booking Modal */}
      <RentalBookingModal
        equipment={selectedRentalAsset}
        isOpen={!!selectedRentalAsset}
        onClose={() => setSelectedRentalAsset(null)}
        onBookingSuccess={(bookingData) => {
          if (onAddToCart) {
            onAddToCart(bookingData);
          }
        }}
      />

      {/* Interactive Equipment Donation Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonateSuccess={(receiptId) => {
          setIsDonateOpen(false);
        }}
      />

      {/* Interactive Trade-In Valuation Modal */}
      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        onTradeInSuccess={(tradeId, value) => {
          setIsTradeInOpen(false);
        }}
      />
    </div>
  );
};

export default EquipmentPortal;
