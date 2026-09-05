import React from 'react';

const ProfileView = ({ onBack }) => {
  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center gap-6">
        <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-4xl font-black text-[#1e2a3a] tracking-tight">Personal Health Profile</h2>
          <p className="text-slate-500 font-medium">Manage your verified credentials and digital identity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-100">
            <div className="bg-[#1e2a3a] p-10 flex flex-col items-center text-center text-white space-y-4">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Profile" />
                <button className="absolute bottom-2 right-2 bg-[#2f80ed] p-2 rounded-xl text-xs">✏️</button>
              </div>
              <div>
                <h3 className="text-2xl font-black">Aditya Verma</h3>
                <p className="text-blue-300 font-black text-[10px] uppercase tracking-widest mt-1">Verified Member • Pulse Gold</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Digital Health ID</span>
                 <span className="text-sm font-black text-[#1e2a3a]">44-1029-3829-10</span>
               </div>
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Primary Vitals</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Blood Group</p>
                      <p className="text-xl font-black text-[#1e2a3a]">B+</p>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-black text-orange-400 uppercase mb-1">Height</p>
                      <p className="text-xl font-black text-[#1e2a3a]">178 cm</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#1e2a3a]">Account Security</h3>
                <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Level 3 Secure</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input type="text" readOnly value="aditya.verma@pulseplus.com" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none text-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                  <input type="text" readOnly value="+91 98765 43210" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none text-slate-700" />
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <h4 className="text-xl font-black text-[#1e2a3a]">Connected Apps</h4>
                <div className="space-y-3">
                  {['Google Health', 'Apple Health', 'MyAadhaar'].map(app => (
                    <div key={app} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">🔗</div>
                        <span className="font-bold text-slate-700 group-hover:text-[#2f80ed] transition-colors">{app}</span>
                      </div>
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-[#1e2a3a] text-white py-6 rounded-[2rem] font-black text-lg shadow-xl hover:bg-[#2f80ed] transition-all">
                Update Security Settings
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
