import React, { useState, useRef } from 'react';
import { askHealthBot } from '../services/geminiService';

const PrescriptionScanner = ({ onBack }) => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    if (!image) return;
    setLoading(true);
    const result = await askHealthBot("Please analyze this prescription and list the medicines, dosage, and frequency clearly.", image);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="py-24 px-6 max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#1e2a3a]">Prescription Scanner</h1>
            <p className="text-slate-500 font-medium">Powered by Abhimanyu Vision AI</p>
          </div>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="bg-[#1e2a3a] text-white px-8 py-4 rounded-2xl font-black">
          Upload Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
          {image ? (
            <div className="relative group w-full h-full">
              <img src={image} className="w-full h-full object-contain rounded-[2rem]" alt="Prescription" />
              <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()} className="text-center space-y-4 cursor-pointer">
              <div className="text-7xl">📸</div>
              <p className="font-black text-slate-400">Click to upload image</p>
            </div>
          )}
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl min-h-[400px] flex flex-col">
          <h3 className="text-2xl font-black text-[#1e2a3a] mb-8">AI Analysis Output</h3>

          <div className="flex-1 flex flex-col items-center justify-center">
            {loading ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <p className="font-bold text-slate-500">Scanning details...</p>
              </div>
            ) : analysis ? (
              <div className="w-full prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-relaxed font-medium">
                {analysis}
              </div>
            ) : (
              <div className="text-center opacity-30 space-y-4">
                <div className="text-6xl">🤖</div>
                <p className="font-black">Waiting for input...</p>
              </div>
            )}
          </div>

          {image && !analysis && !loading && (
            <button
              onClick={startScan}
              className="mt-10 w-full bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Analyze Scan ✨
            </button>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default PrescriptionScanner;
