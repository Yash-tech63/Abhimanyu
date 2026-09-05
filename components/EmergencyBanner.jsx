import React, { useState } from 'react';
import { Language } from '../backened/types';

const EmergencyBanner = ({ onRequestAmbulance, onCall112, onLocationShared, onFindHospital, lang = Language.EN }) => {
  const [locating, setLocating] = useState(false);
  const [locSuccess, setLocSuccess] = useState(false);

  const isHindi = lang === Language.HI;

  const handleShareLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          setLocSuccess(true);
          if (onLocationShared) {
            onLocationShared({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          }
          setTimeout(() => setLocSuccess(false), 4000);
        },
        (err) => {
          setLocating(false);
          alert(isHindi ? "स्थान प्राप्त करने में असमर्थ। कृपया अनुमति सक्षम करें।" : "Unable to fetch location. Please ensure location permissions are enabled.");
        }
      );
    } else {
      setLocating(false);
      alert(isHindi ? "आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।" : "Geolocation is not supported by your browser.");
    }
  };

  const handleCall112 = () => {
    if (onCall112) {
      onCall112();
    } else {
      window.location.href = "tel:112";
    }
  };

  return (
    <section className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-r from-[#005e8a] via-[#006e6e] to-[#00644c] p-6 sm:p-10 md:p-14 shadow-2xl overflow-hidden border border-white/10 text-white animate-in fade-in duration-500">
      {/* Background Decorative Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Heading, Badges, Buttons */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          
          {/* Top Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/20 shadow-sm">
            <span className="w-4 h-4 rounded-full bg-cyan-400/30 flex items-center justify-center text-[10px]">⏱</span>
            <span>{isHindi ? "आपातकालीन प्रतिक्रिया प्रणाली" : "EMERGENCY RESPONSE SYSTEM"}</span>
          </div>

          {/* Main Typography */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              {isHindi ? "आपातकालीन चिकित्सा" : "Emergency Medical"} <br />
              {isHindi ? "सहायता" : "Help"} <br />
              <span className="text-amber-400 font-black">{isHindi ? "24/7 उपलब्ध" : "Available 24/7"}</span>
            </h1>
            <p className="text-white/90 text-sm md:text-base font-normal max-w-xl leading-relaxed pt-2">
              {isHindi
                ? "एम्बुलेंस सहायता, आपातकालीन ऑक्सीजन, तत्काल रक्त सहायता का अनुरोध करें और निकटतम अस्पताल खोजें।"
                : "Request ambulance assistance, emergency oxygen, urgent blood support and find nearby hospitals."}
            </p>
          </div>

          {/* Buttons Row 1: Request Ambulance & Call 112 Now */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onRequestAmbulance}
              className="bg-[#e53935] hover:bg-red-600 active:scale-95 text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-2xl shadow-xl shadow-red-900/30 flex items-center gap-2.5 transition-all hover:scale-105 group/btn cursor-pointer"
            >
              <span className="text-lg">🚑</span>
              <span>{isHindi ? "एम्बुलेंस का अनुरोध करें" : "REQUEST AMBULANCE"}</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
            </button>

            <button
              onClick={handleCall112}
              className="bg-[#21090d] hover:bg-[#341117] active:scale-95 text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
            >
              <span className="text-lg">📞</span>
              <span className="text-red-400">🚨</span>
              <span>{isHindi ? "112 पर कॉल करें" : "CALL 112 NOW"}</span>
            </button>
          </div>

          {/* Button Row 2: Share Emergency Location & Find Hospital */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleShareLocation}
              disabled={locating}
              className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-semibold border transition-all flex items-center gap-2.5 cursor-pointer ${
                locSuccess
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg scale-105'
                  : 'bg-[#093529]/80 hover:bg-[#0e4939] text-emerald-100 border-emerald-500/40 shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              <span className="text-base">{locating ? '🔄' : locSuccess ? '✅' : '🎯'}</span>
              <span>
                {locating
                  ? (isHindi ? 'लाइव स्थान खोजा जा रहा है...' : 'Detecting Live GPS Location...')
                  : locSuccess
                  ? (isHindi ? 'स्थान सफलतापूर्वक साझा किया गया!' : 'Emergency Location Shared Successfully!')
                  : (isHindi ? 'आपातकालीन स्थान साझा करें' : 'Share Emergency Location')}
              </span>
            </button>

            {onFindHospital && (
              <button
                onClick={onFindHospital}
                className="bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-2xl border border-white/20 shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span className="text-base">🏥</span>
                <span>{isHindi ? "सरकारी अस्पताल" : "GOVT HOSPITALS"}</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Floating Emergency Call Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="bg-white text-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center max-w-md w-full border border-slate-100 relative z-10 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            
            {/* Top Ambulance Icon */}
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner border border-red-100">
              🚑
            </div>

            {/* Card Titles */}
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isHindi ? "तुरंत मदद चाहिए?" : "Need Immediate Help?"}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 mb-6">
              {isHindi ? "राष्ट्रीय आपातकालीन नंबर पर तुरंत कॉल करें।" : "Call the National Emergency Number immediately."}
            </p>

            {/* CALL 112 Primary Button */}
            <button
              onClick={handleCall112}
              className="bg-[#d32f2f] hover:bg-red-700 active:scale-95 text-white font-black text-xl md:text-2xl py-4 px-8 rounded-2xl w-full flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 hover:scale-[1.02] transition-all cursor-pointer border border-red-400/20"
            >
              <span className="text-2xl">📞</span>
              <span>{isHindi ? "112 डायल करें" : "CALL 112"}</span>
            </button>

            {/* Warning Note Pill */}
            <div className="bg-[#fef8ec] border border-[#f5e4c3] rounded-2xl p-3.5 text-xs text-[#a66d03] flex items-center gap-2.5 text-left w-full mt-6 shadow-sm">
              <span className="text-base shrink-0">⚠️</span>
              <p className="font-medium leading-tight text-[11px]">
                {isHindi ? "गंभीर आपात स्थिति के लिए तुरंत 112 पर कॉल करें।" : "For life-threatening emergencies, call 112 immediately."}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default EmergencyBanner;
