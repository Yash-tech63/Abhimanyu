import React, { useState, useMemo } from 'react';

const LabReportsView = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLab, setNewLab] = useState('');
  const [toast, setToast] = useState('');

  const [reports, setReports] = useState([
    { id: '1', title: 'Complete Blood Count (CBC)', date: 'March 12, 2025', lab: 'Apex Diagnostic Center', status: 'Normal', summary: 'Hemoglobin: 14.2 g/dL, RBC: 4.8 million/mcL, WBC: 7,500/mcL. All counts within normal adult reference range.' },
    { id: '2', title: 'Lipid Profile Test', date: 'Feb 28, 2025', lab: 'City Care Hospital', status: 'Attention Required', summary: 'Total Cholesterol: 215 mg/dL (Slightly Elevated). HDL: 48 mg/dL, LDL: 135 mg/dL, Triglycerides: 160 mg/dL.' },
    { id: '3', title: 'COVID-19 Antibody Test', date: 'Jan 15, 2025', lab: 'National Labs', status: 'Immune', summary: 'IgG Antibody Titer: High Positive (>250 AU/mL). Indicates active protective immunity.' },
    { id: '4', title: 'Thyroid Stimulating Hormone (TSH)', date: 'Dec 10, 2024', lab: 'Apex Diagnostic Center', status: 'Normal', summary: 'TSH Level: 2.1 mIU/L. Euthyroid status confirmed.' },
  ]);

  const filteredReports = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.lab.toLowerCase().includes(q)
    );
  }, [search, reports]);

  const handleAddReport = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      date: 'Today',
      lab: newLab.trim() || 'Uploaded Medical Document',
      status: 'Normal',
      summary: 'Diagnostic report indexed into personal health vault. Verified by Ayushman Bharat AI engine.'
    };

    setReports(prev => [newDoc, ...prev]);
    setNewTitle('');
    setNewLab('');
    setShowUploadModal(false);
    setToast('New Diagnostic Report Uploaded! 📄');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
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
            <h2 className="text-3xl md:text-4xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Clinical Reports</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Archive of your verified medical tests and diagnostic imaging.</p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#1e2a3a] dark:bg-[#2f80ed] hover:bg-[#2f80ed] text-white px-8 py-4 rounded-[2rem] font-black shadow-xl transition-all uppercase text-xs tracking-widest cursor-pointer"
        >
          Upload New Report 🔬
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden p-6 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by test name or lab center..." 
              className="w-full pl-16 pr-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 font-bold outline-none text-slate-800 dark:text-white focus:ring-2 ring-blue-500/20 text-sm" 
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.map(report => (
            <div key={report.id} className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/60 rounded-[2.5rem] border border-white dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm flex items-center justify-center text-2xl shrink-0">📄</div>
                <div>
                  <h4 className="font-black text-[#1e2a3a] dark:text-white text-lg md:text-xl group-hover:text-[#2f80ed] transition-colors">{report.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{report.lab} • {report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'Normal' || report.status === 'Immune' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'}`}>
                  {report.status}
                </span>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[#1e2a3a] dark:text-white px-6 py-2.5 rounded-xl font-black text-xs hover:bg-[#2f80ed] hover:text-white dark:hover:bg-[#2f80ed] transition-all cursor-pointer shadow-sm"
                >
                  View Details 📄
                </button>
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="py-16 text-center opacity-40">
              <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No reports found matching your search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal View Details */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] max-w-xl w-full space-y-6 shadow-2xl border border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between border-b dark:border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest">Diagnostic Report Summary</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">{selectedReport.title}</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold">✕</button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Lab Center</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedReport.lab}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Clinical Findings</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{selectedReport.summary}</p>
              </div>
            </div>
            <button onClick={() => setSelectedReport(null)} className="w-full bg-[#2f80ed] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer">
              Close Report
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] max-w-lg w-full space-y-6 shadow-2xl border border-slate-100 dark:border-white/10">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Upload Diagnostic Report</h3>
              <p className="text-xs text-slate-400 font-medium">Index a new lab test into your vault.</p>
            </div>
            <form onSubmit={handleAddReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Test Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Vitamin D3 & B12 Test"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-white/10 font-bold outline-none text-slate-800 dark:text-white text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Lab / Hospital Center</label>
                <input
                  type="text"
                  value={newLab}
                  onChange={(e) => setNewLab(e.target.value)}
                  placeholder="e.g. Apollo Diagnostics"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-white/10 font-bold outline-none text-slate-800 dark:text-white text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-slate-500 uppercase text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-[#2f80ed] text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl">Upload Report 📄</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabReportsView;
