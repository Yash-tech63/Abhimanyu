import React, { useState } from 'react';
import { AppView, Language } from '../../backened/types';
import { translations } from '../../backened/i18n';

const RecordsSection = ({ onNavigate, lang = Language.EN }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logObservations, setLogObservations] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [healthLogs, setHealthLogs] = useState([
    { id: '1', title: 'Ayushman ABHA ID Linked', observations: 'ABHA Health Card #34-9021-4412 successfully integrated into clinical vault.', date: 'Today, 09:30 AM', tag: 'ABHA Verified' },
    { id: '2', title: 'Morning Vital Telemetry', observations: 'Blood pressure 120/80 mmHg, Resting Heart Rate 72 BPM recorded via smartwatch.', date: 'Yesterday', tag: 'Vitals Log' },
  ]);

  const t = translations[lang]?.sections || translations[Language.EN].sections;

  const handleSyncLog = (e) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      title: logTitle.trim(),
      observations: logObservations.trim() || 'Clinical observations recorded cleanly.',
      date: 'Just now',
      tag: 'User Logged'
    };

    setHealthLogs(prev => [newEntry, ...prev]);
    setLogTitle('');
    setLogObservations('');
    setShowLogModal(false);

    setSuccessToast('Health Log Synced to Vault! 🔒');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <section className="px-4 md:px-8 py-16 space-y-12 max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-8 right-8 z-[200] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-sm animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <span>✅</span> {successToast}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b dark:border-white/5 pb-10">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">{t.records}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed max-w-xl">{t.recordsSub}</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-[#2f80ed] hover:bg-[#2566c7] text-white px-8 py-4 rounded-[2rem] font-black shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 uppercase text-xs tracking-widest cursor-pointer"
        >
          <span>➕</span> {t.newLog || "New Health Log"}
        </button>
      </div>

      {/* Main 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'My Profile', icon: '👤', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400', count: 'Verified Account', view: AppView.PROFILE },
          { label: 'Lab Reports', icon: '🔬', color: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400', count: '12 Items Indexed', view: AppView.LAB_REPORTS },
          { label: 'Vital History', icon: '📉', color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', count: 'Last sync: Today', view: AppView.VITALS },
        ].map(item => (
          <div
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className="bg-white dark:bg-slate-800/90 p-8 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all cursor-pointer group active:scale-[0.98] flex flex-col justify-between h-56"
          >
            <div className={`${item.color} w-16 h-16 rounded-[2rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner`}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-black text-slate-800 dark:text-white text-2xl mb-1 group-hover:text-[#2f80ed] transition-colors">{item.label}</h4>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container: Recent Consultations & Synced Logs */}
      <div className="space-y-8">
        {/* Consultations */}
        <div className="bg-white dark:bg-slate-800/90 rounded-[3.5rem] p-8 md:p-10 border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Recent Activity</h3>
              <button onClick={() => onNavigate(AppView.CONSULT)} className="text-xs font-black text-[#2f80ed] hover:underline uppercase tracking-widest cursor-pointer">Historical View ➔</button>
            </div>

            <div className="space-y-4">
              {[
                { doctor: 'Dr. Elena Rossi', specialty: 'Pediatric Care', status: 'Follow-up scheduled', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' },
                { doctor: 'Dr. Michael Vogt', specialty: 'Cardiac Specialist', status: 'Report Ready for Review', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/60 p-6 md:p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shadow-md border-2 border-white dark:border-slate-700 shrink-0">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.doctor} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-800 dark:text-white text-xl leading-tight">{item.doctor}</h4>
                      <p className="text-xs text-[#2f80ed] font-black uppercase tracking-widest">{item.specialty}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{item.status}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onNavigate(AppView.CONSULT)} className="bg-[#1e2a3a] dark:bg-[#2f80ed] hover:bg-[#2f80ed] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all cursor-pointer">
                    Consult
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Synced ABHA Logs Section */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[3.5rem] p-8 md:p-10 border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Synced ABHA Vault Logs</h3>
              <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-[#2f80ed] dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest">
                {healthLogs.length} Records
              </span>
            </div>

            <div className="space-y-3">
              {healthLogs.map((log) => (
                <div key={log.id} className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-slate-800 dark:text-white text-base">{log.title}</h4>
                      <span className="text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                        {log.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{log.observations}</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">
                    {log.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* New Health Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] max-w-lg w-full space-y-6 shadow-2xl border border-slate-100 dark:border-white/10">
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">New Health Log</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">Record observations to sync into your clinical vault.</p>
            </div>

            <form onSubmit={handleSyncLog} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Log Title</label>
                <input
                  type="text"
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="e.g. Morning Blood Pressure 120/80"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-white/10 font-bold outline-none text-slate-800 dark:text-white text-sm focus:border-[#2f80ed]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Observations & Notes</label>
                <textarea
                  rows={4}
                  value={logObservations}
                  onChange={(e) => setLogObservations(e.target.value)}
                  placeholder="Describe your health status or vital stats clearly..."
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-white/10 font-bold outline-none text-slate-800 dark:text-white text-sm resize-none focus:border-[#2f80ed]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2f80ed] hover:bg-[#2566c7] text-white py-4 rounded-2xl font-black shadow-xl uppercase tracking-widest text-xs cursor-pointer"
                >
                  Sync Log 🔒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecordsSection;
