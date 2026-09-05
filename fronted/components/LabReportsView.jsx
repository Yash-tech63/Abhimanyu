import React, { useState, useMemo } from 'react';

const LabReportsView = ({ onBack }) => {
  const [search, setSearch] = useState('');
  
  const reports = [
    { id: '1', title: 'Complete Blood Count', date: 'March 12, 2025', lab: 'Apex Diagnostic Center', status: 'Normal' },
    { id: '2', title: 'Lipid Profile Test', date: 'Feb 28, 2025', lab: 'City Care Hospital', status: 'Attention Required' },
    { id: '3', title: 'COVID-19 Antibody', date: 'Jan 15, 2025', lab: 'National Labs', status: 'Immune' },
    { id: '4', title: 'Thyroid Stimulating Hormone', date: 'Dec 10, 2024', lab: 'Apex Diagnostic Center', status: 'Normal' },
  ];

  const filteredReports = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.lab.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-[#1e2a3a] tracking-tight">Clinical Reports</h2>
            <p className="text-slate-500 font-medium">Archive of your verified medical tests and diagnostic imaging.</p>
          </div>
        </div>
        <button className="bg-[#1e2a3a] text-white px-10 py-5 rounded-[2rem] font-black shadow-xl hover:bg-[#2f80ed] transition-all">
          Upload New Report 🔬
        </button>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by test name or lab center..." 
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 ring-blue-100 transition-all" 
                />
             </div>
             <button className="bg-slate-100 text-slate-600 px-8 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest">Filters</button>
          </div>

          <div className="space-y-4">
            {filteredReports.map(report => (
              <div key={report.id} className="p-8 bg-slate-50 rounded-[3rem] border border-white shadow-inner flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📄</div>
                  <div>
                    <h4 className="font-black text-[#1e2a3a] text-xl group-hover:text-[#2f80ed] transition-colors">{report.title}</h4>
                    <p className="text-sm text-slate-400 font-medium">{report.lab} • {report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'Normal' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {report.status}
                  </span>
                  <button className="flex-1 md:flex-none bg-white border border-slate-200 text-[#1e2a3a] px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                    View PDF
                  </button>
                </div>
              </div>
            ))}
            {filteredReports.length === 0 && (
              <div className="py-20 text-center opacity-30">
                <p className="font-black text-slate-400 uppercase tracking-widest">No reports found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportsView;
