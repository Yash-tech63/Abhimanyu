import React from 'react';

const VitalsView = ({ onBack }) => {
    const stats = [
        { label: 'Heart Rate', value: '72', unit: 'BPM', status: 'Normal', color: 'text-red-500', bg: 'bg-red-50', icon: '❤️' },
        { label: 'SpO2', value: '98', unit: '%', status: 'Optimal', color: 'text-blue-500', bg: 'bg-blue-50', icon: '🩸' },
        { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', color: 'text-indigo-500', bg: 'bg-indigo-50', icon: '🩺' },
        { label: 'Blood Glucose', value: '92', unit: 'mg/dL', status: 'Healthy', color: 'text-orange-500', bg: 'bg-orange-50', icon: '🍬' }
    ];

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6"><div className="flex items-center gap-6"><button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-slate-50"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button><div><h2 className="text-4xl font-black text-[#1e2a3a] tracking-tight">Health Dashboards</h2><p className="text-slate-500 font-medium">Real-time health telemetry and historical vitals tracking.</p></div></div><button className="bg-[#2f80ed] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 flex items-center gap-2"><span>⌚</span> Sync Smartwatch</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{stats.map(stat => <div key={stat.label} className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6 hover:shadow-2xl transition-all cursor-pointer"><div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl`}>{stat.icon}</div><div className="space-y-1"><h4 className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</h4><div className="flex items-baseline gap-2"><span className="text-4xl font-black text-[#1e2a3a]">{stat.value}</span><span className="text-sm font-bold text-slate-400 uppercase">{stat.unit}</span></div></div><div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-xs font-black text-green-500 uppercase tracking-widest">{stat.status}</span></div></div>)}</div>
            <div className="bg-[#1e2a3a] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden"><div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div className="space-y-6"><h3 className="text-5xl font-black leading-none">Weekly Trends</h3><p className="text-slate-400 text-lg font-medium leading-relaxed">Your heart rate and sleep patterns have improved by 12% compared to last week. Keep up the consistent yoga sessions!</p><div className="flex gap-4"><button className="bg-white text-[#1e2a3a] px-8 py-4 rounded-2xl font-black text-sm">Download Report</button><button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm">View Insights</button></div></div><div className="h-64 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden"><div className="w-full h-full px-12 flex items-end gap-3 justify-center pb-12">{[40, 70, 45, 90, 65, 80, 50].map((height, index) => <div key={index} className="flex-1 bg-blue-500 rounded-t-xl animate-in slide-in-from-bottom duration-1000" style={{ height: `${height}%` }}></div>)}</div></div></div></div>
        </div>
    );
};

export default VitalsView;
