import React, { useState } from 'react';

const VitalsView = ({ onBack }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [toast, setToast] = useState('');
    const [stats, setStats] = useState([
        { label: 'Heart Rate', value: '72', unit: 'BPM', status: 'Normal', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', icon: '❤️' },
        { label: 'SpO2 Level', value: '98', unit: '%', status: 'Optimal', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', icon: '🩸' },
        { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', icon: '🩺' },
        { label: 'Blood Glucose', value: '92', unit: 'mg/dL', status: 'Healthy', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: '🍬' }
    ]);

    const handleSyncWatch = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setStats([
                { label: 'Heart Rate', value: '74', unit: 'BPM', status: 'Normal', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', icon: '❤️' },
                { label: 'SpO2 Level', value: '99', unit: '%', status: 'Optimal', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', icon: '🩸' },
                { label: 'Blood Pressure', value: '118/78', unit: 'mmHg', status: 'Optimal', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', icon: '🩺' },
                { label: 'Blood Glucose', value: '90', unit: 'mg/dL', status: 'Healthy', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: '🍬' }
            ]);
            setIsSyncing(false);
            setToast('Smartwatch Telemetry Synced Live! ⌚');
            setTimeout(() => setToast(''), 3000);
        }, 1200);
    };

    const handleDownloadReport = () => {
        setToast('Weekly Health Telemetry Report Downloaded! 📊');
        setTimeout(() => setToast(''), 3000);
    };

    return (
        <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {toast && (
                <div className="fixed top-8 right-8 z-[200] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-sm animate-in fade-in flex items-center gap-3">
                    <span>✅</span> {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-100 dark:border-white/5">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Health Dashboards</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Real-time health telemetry and historical vitals tracking.</p>
                    </div>
                </div>
                <button
                    onClick={handleSyncWatch}
                    disabled={isSyncing}
                    className="bg-[#2f80ed] hover:bg-[#2566c7] text-white px-8 py-4 rounded-[2rem] font-black shadow-lg transition-all flex items-center gap-2 uppercase text-xs tracking-widest cursor-pointer disabled:opacity-50"
                >
                    <span className={isSyncing ? "animate-spin" : ""}>⌚</span> {isSyncing ? 'Syncing...' : 'Sync Smartwatch'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-slate-800/90 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-white/5 space-y-6 hover:shadow-2xl transition-all cursor-pointer">
                        <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner`}>
                            {stat.icon}
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-slate-400 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-[#1e2a3a] dark:text-white">{stat.value}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">{stat.unit}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Trends Chart Card */}
            <div className="bg-[#1e2a3a] dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl md:text-4xl font-black leading-tight">Weekly Telemetry Trends</h3>
                        <p className="text-slate-300 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                            Your heart rate stability and oxygen saturation have improved by <strong>12%</strong> compared to last week. Maintain your morning yoga routine for optimal cardiovascular health!
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button onClick={handleDownloadReport} className="bg-white text-[#1e2a3a] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all cursor-pointer">
                                Download Report 📊
                            </button>
                            <button onClick={() => setToast('Vitals telemetry synced to ABHA record.')} className="bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all cursor-pointer">
                                View Insights ✨
                            </button>
                        </div>
                    </div>

                    <div className="h-56 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center justify-center overflow-hidden p-6">
                        <div className="w-full h-full flex items-end gap-3 justify-center">
                            {[40, 70, 45, 90, 65, 80, 50].map((height, index) => (
                                <div key={index} className="flex-1 bg-[#2f80ed] rounded-t-xl transition-all duration-700 hover:bg-emerald-400 cursor-pointer" style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VitalsView;
