import React, { useState, useRef } from 'react';
import { editProductImage } from '../services/geminiService';
import { storage } from '../services/storageService';

const ProductStudio = ({ onBack }) => {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setImage(result);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (overridePrompt) => {
    const activePrompt = overridePrompt || prompt;
    if (!image || !activePrompt.trim() || isProcessing) return;

    setIsProcessing(true);
    const result = await editProductImage(image, activePrompt);
    if (result) {
      setEditedImage(result);
      storage.saveStudioProject({
        id: Date.now().toString(),
        original: image,
        edited: result,
        prompt: activePrompt,
        timestamp: Date.now()
      });
    } else {
      alert("AI was unable to process this request. Try a simpler prompt like 'Remove background'.");
    }
    setIsProcessing(false);
  };

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
      linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
      linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-[#0f172a] p-10 rounded-[4rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#2f80ed] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#1e2a3a] dark:text-white tracking-tight">AI Product Studio</h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-1">Background Removal • Product Cleanup • Visual Polish</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 rounded-2xl bg-[#1e2a3a] dark:bg-[#2f80ed] text-white font-black text-sm hover:scale-105 transition-all shadow-xl"
          >
            {image ? 'Change Photo' : 'Upload Asset'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Source Image (Blank)</h3>
            <div
              onClick={() => !image && fileInputRef.current?.click()}
              className={`aspect-square rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${image ? 'border-transparent bg-slate-50 dark:bg-slate-900' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-200 cursor-pointer'
                }`}
            >
              <div className="absolute inset-0 opacity-10 dark:opacity-5" style={checkerboardStyle}></div>
              {image ? (
                <img src={image} className="w-full h-full object-contain p-6 relative z-10" alt="Original Product" />
              ) : (
                <div className="text-center p-12 space-y-4 opacity-30 relative z-10">
                  <div className="text-6xl">📸</div>
                  <p className="font-black text-slate-400">Click to upload product photo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Processed Result</h3>
            <div className="aspect-square rounded-[2.5rem] bg-[#f8fafc] dark:bg-slate-900/50 flex items-center justify-center overflow-hidden border border-white dark:border-slate-800 relative shadow-inner">
              <div className="absolute inset-0 opacity-20 dark:opacity-10" style={checkerboardStyle}></div>
              {editedImage ? (
                <img src={editedImage} className="w-full h-full object-contain p-6 animate-in zoom-in duration-500 relative z-10" alt="AI Edited Result" />
              ) : isProcessing ? (
                <div className="text-center space-y-6 relative z-10">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-blue-50 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#2f80ed] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="font-black text-[#1e2a3a] dark:text-white text-xs uppercase tracking-widest">Synthesizing Studio Shot...</p>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-10 relative z-10">
                  <div className="text-7xl">✨</div>
                  <p className="font-black text-slate-400 uppercase tracking-[0.2em] text-[10px]">AI output will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e2a3a] dark:bg-[#1e293b] rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-black tracking-tight">AI Instruction Engine</h2>
            <p className="text-slate-400 font-medium text-sm">Describe the changes in natural language. Gemini handles the complex editing.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              placeholder="e.g., remove background and set to pure white..."
              className="flex-1 px-8 py-5 rounded-[2rem] bg-transparent outline-none font-bold text-white placeholder:text-slate-500 text-base"
            />
            <button
              onClick={() => handleEdit()}
              disabled={!image || !prompt.trim() || isProcessing}
              className="bg-[#2f80ed] hover:bg-blue-600 disabled:opacity-30 text-white px-10 py-5 rounded-[2rem] font-black transition-all shadow-xl active:scale-95"
            >
              Apply Edit
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Remove background",
              "Set white background",
              "Clean background",
              "Enhance lighting",
              "Studio setup",
              "Transparent BG"
            ].map(hint => (
              <button
                key={hint}
                onClick={() => { setPrompt(hint); handleEdit(hint); }}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]"></div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default ProductStudio;
