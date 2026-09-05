import React, { useState, useEffect } from 'react';
import { Language } from '../backened/types';
import { translations } from '../backened/i18n';
import EmergencyBanner from './EmergencyBanner';

const AmbulancePortal = ({ onBack, lang = Language.EN }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle');
  const [ayushmanVerified, setAyushmanVerified] = useState(false);
  const [selectedService, setSelectedService] = useState('ambulance'); // 'ambulance' | 'blood' | 'oxygen'
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [selectedOxygenSize, setSelectedOxygenSize] = useState('10L Portable');

  const ambT = translations[lang]?.ambulance || translations[Language.EN].ambulance;

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

  const getServiceTitle = () => {
    if (selectedService === 'blood') return `Blood Dispatch (${selectedBloodGroup})`;
    if (selectedService === 'oxygen') return `Oxygen Dispatch (${selectedOxygenSize})`;
    return ambT.emergencyDispatch;
  };

  const getIcon = () => {
    if (selectedService === 'blood') return '🩸';
    if (selectedService === 'oxygen') return '💨';
    return '🚑';
  };

  return (
    <div className="py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Top Back Navigation & Emergency Banner from User Image */}
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-white/10"
        >
          <span className="rotate-180 inline-block">➔</span>
          <span>Back to Home</span>
        </button>

        <EmergencyBanner
          onRequestAmbulance={() => {
            setSelectedService('ambulance');
            const el = document.getElementById('dispatch-center');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLocationShared={(loc) => {
            setLocation(loc);
          }}
        />
      </div>

      {/* Main Emergency Command Center Card */}
      <div id="dispatch-center" className="bg-white dark:bg-slate-800 p-8 md:p-14 rounded-[4rem] border border-red-100 dark:border-red-900/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm">➔</button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{ambT.emergencyDispatch}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base mt-1">{ambT.subTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-green-50 dark:bg-green-950/20 px-6 py-3 rounded-2xl border border-green-200/50">
            <span className="text-green-500 font-black text-xs uppercase tracking-widest">{ambT.networkStatus}</span>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Emergency Service Switcher Tabs */}
        <div className="mt-10 relative z-10 space-y-4">
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{ambT.selectService}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedService('ambulance')}
              className={`p-6 rounded-[2.5rem] border text-left transition-all flex items-center gap-5 ${selectedService === 'ambulance'
                  ? 'bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/20 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white border-slate-100 dark:border-white/5 hover:border-red-200'
                }`}
            >
              <span className="text-4xl">🚑</span>
              <div>
                <h4 className="font-black text-lg">Ambulance Dispatch</h4>
                <p className={`text-xs font-medium mt-0.5 ${selectedService === 'ambulance' ? 'text-red-100' : 'text-slate-400'}`}>24/7 ACLS & BLS Units</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedService('blood')}
              className={`p-6 rounded-[2.5rem] border text-left transition-all flex items-center gap-5 ${selectedService === 'blood'
                  ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/20 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white border-slate-100 dark:border-white/5 hover:border-red-200'
                }`}
            >
              <span className="text-4xl">🩸</span>
              <div>
                <h4 className="font-black text-lg">{ambT.bloodSos}</h4>
                <p className={`text-xs font-medium mt-0.5 ${selectedService === 'blood' ? 'text-red-100' : 'text-slate-400'}`}>Instant Blood Bank Unit</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedService('oxygen')}
              className={`p-6 rounded-[2.5rem] border text-left transition-all flex items-center gap-5 ${selectedService === 'oxygen'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-xl shadow-cyan-600/20 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white border-slate-100 dark:border-white/5 hover:border-cyan-200'
                }`}
            >
              <span className="text-4xl">💨</span>
              <div>
                <h4 className="font-black text-lg">{ambT.oxygenCylinder}</h4>
                <p className={`text-xs font-medium mt-0.5 ${selectedService === 'oxygen' ? 'text-cyan-100' : 'text-slate-400'}`}>Medical O2 Cylinder & Concentrator</p>
              </div>
            </button>
          </div>
        </div>

        {/* Specialized Options Sub-bar */}
        {selectedService === 'blood' && (
          <div className="mt-6 p-6 bg-red-50 dark:bg-red-950/30 rounded-3xl border border-red-100 dark:border-red-900/30 space-y-3 relative z-10 animate-in fade-in">
            <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">{ambT.bloodGroup}:</p>
            <div className="flex flex-wrap gap-3">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all ${selectedBloodGroup === bg
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10'
                    }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedService === 'oxygen' && (
          <div className="mt-6 p-6 bg-cyan-50 dark:bg-cyan-950/30 rounded-3xl border border-cyan-100 dark:border-cyan-900/30 space-y-3 relative z-10 animate-in fade-in">
            <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">{ambT.oxygenSize}:</p>
            <div className="flex flex-wrap gap-3">
              {['10L Portable Cylinder', '45L Jumbo Cylinder', '10L/min Oxygen Concentrator Machine'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedOxygenSize(size)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all ${selectedOxygenSize === size
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Dispatch Command Controls & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10 relative z-10">
          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6">
              <h3 className="text-xl font-black text-[#1e2a3a] dark:text-white">{ambT.locationProfile}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ambT.gpsCoords}</span>
                  <span className="text-sm font-mono font-bold dark:text-white">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '23.2804, 77.4650 (Detecting GPS)'}</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                  <div className="text-3xl">🏥</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{ambT.nearestHub}</p>
                    <p className="text-sm font-black dark:text-white">Pulse Emergency Hub & Blood Reserve - Zone 4</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e2a3a] dark:bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">{ambT.freeService}</h3>
                <input
                  type="checkbox"
                  checked={ayushmanVerified}
                  onChange={() => setAyushmanVerified(!ayushmanVerified)}
                  className="w-6 h-6 rounded-lg accent-green-500 cursor-pointer"
                />
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{ambT.abhaInfo}</p>
              {ayushmanVerified && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-green-400 text-xs font-black uppercase tracking-widest text-center animate-bounce">
                  {ambT.verifiedIdentity}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative border-8 border-white dark:border-slate-700 shadow-2xl h-[520px]">
            {/* Mock Map UI */}
            <div className="absolute inset-0 bg-slate-800">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-20 grayscale" alt="Map View" />
              {status === 'idle' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-slate-900/50 backdrop-blur-sm">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-pulse">
                    {getIcon()}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-white">{ambT.requireDispatch}</h4>
                    <p className="text-slate-300 font-medium">Ready to dispatch: <strong className="text-white">{getServiceTitle()}</strong></p>
                  </div>
                  <button
                    onClick={handleDispatch}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-[2rem] font-black text-xl uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    {ambT.confirmDispatch}
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in duration-500">
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">{getIcon()}</div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-white">{status === 'dispatching' ? ambT.locatingUnit : `${getServiceTitle()} DISPATCHED`}</h4>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">{status === 'dispatching' ? ambT.allocating : ambT.eta}</p>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 animate-[progress_10s_linear_infinite]"></div>
                  </div>
                  <button onClick={() => setStatus('idle')} className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all">
                    {ambT.cancelDispatch}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Response Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'ACLS Ambulance', d: 'Critical Care, Ventilator Support', i: '🚑', c: 'border-red-100 bg-white dark:bg-slate-800' },
          { l: 'BLS Ambulance', d: 'Basic First Aid & Paramedic', i: '📦', c: 'border-orange-100 bg-white dark:bg-slate-800' },
          { l: 'Emergency Blood SOS', d: 'Rare Blood Group Matching & Delivery', i: '🩸', c: 'border-red-200 bg-red-50/50 dark:bg-red-950/20' },
          { l: 'Oxygen Cylinder SOS', d: '10L/45L High Purity O2 Dispatch', i: '💨', c: 'border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20' },
        ].map(u => (
          <div key={u.l} className={`p-8 rounded-[3rem] border ${u.c} shadow-md space-y-4 hover:shadow-xl transition-all`}>
            <div className="text-4xl">{u.i}</div>
            <h4 className="text-xl font-black dark:text-white">{u.l}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{u.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmbulancePortal;
