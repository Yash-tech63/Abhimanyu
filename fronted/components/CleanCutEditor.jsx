import React, { useState, useRef } from 'react';
import { editProductImage } from '../services/geminiService';
import { storage } from '../services/storageService';

const CleanCutEditor = () => {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setImage(result);
        setEditedImage(null);
        setShowOriginal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (overridePrompt) => {
    const activePrompt = overridePrompt || prompt;
    if (!image || !activePrompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
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
    <div className="max-w-[1440px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Listing Asset Workspace</h3>
              {editedImage && (
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2f80ed] hover:text-white transition-all select-none shadow-sm"
                >
                  Hold to Compare
                </button>
              )}
            </div>

            <div
              onClick={() => !image && fileInputRef.current?.click()}
              className={`aspect-[4/3] rounded-[2.5rem] flex items-center justify-center overflow-hidden transition-all relative border-2 ${image ? 'border-transparent bg-slate-50 dark:bg-[#0b0f1a]' : 'border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f1a] cursor-pointer hover:border-blue-500/30'
                }`}
            >
              <div className="absolute inset-0 opacity-10 dark:opacity-5" style={checkerboardStyle}></div>

              {image ? (
                <div className="relative w-full h-full p-10 flex items-center justify-center">
                  <img
                    src={(editedImage && !showOriginal) ? editedImage : image}
                    className={`max-w-full max-h-full object-contain relative z-10 transition-all duration-300 ${isProcessing ? 'blur-sm grayscale opacity-50' : ''}`}
                    alt="Listing Photo"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[12px] font-black text-white bg-blue-600 px-6 py-3 rounded-full backdrop-blur-md shadow-2xl">Abhimanyu AI is Cleaning Your Photo...</p>
                    </div>
                  )}
                  {editedImage && !showOriginal && (
                    <div className="absolute bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl z-20 animate-bounce">
                      AI Optimized
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-12 space-y-6 opacity-30 relative z-10 group-hover:opacity-60 transition-all">
                  <div className="text-8xl">📸</div>
                  <div>
                    <p className="font-black text-slate-800 dark:text-white text-xl">Click to upload clinical gear</p>
                    <p className="text-sm font-medium text-slate-400 mt-2">Upload any photo and tell the AI how to clean it up.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white dark:bg-slate-800 text-[#1e2a3a] dark:text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-white/5 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span>📁</span> Change Asset Photo
            </button>
            {editedImage && (
              <button
                onClick={() => alert('Listing Published with AI Photo!')}
                className="flex-1 bg-green-500 text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all"
              >
                Confirm Listing & Publish
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#1e2a3a] dark:bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden border border-white/5">
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-3xl font-black tracking-tighter">CleanCut AI Engine</h2>
                <p className="text-slate-400 text-sm font-medium mt-2">Describe the cleanup instructions in natural language.</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleEdit()}
                  placeholder="e.g., remove messy background and set to pure white studio lighting..."
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-[2.5rem] outline-none focus:ring-4 ring-blue-500/30 font-bold placeholder:text-slate-600 resize-none h-44 text-lg transition-all"
                />
                <button
                  onClick={() => handleEdit()}
                  disabled={!image || !prompt.trim() || isProcessing}
                  className="w-full bg-[#2f80ed] hover:bg-blue-600 disabled:opacity-30 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                >
                  {isProcessing ? 'Processing...' : 'Apply AI Cleanup ✨'}
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">One-Tap Optimization</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Remove background", icon: "✂️" },
                    { label: "Pure White BG", icon: "⚪" },
                    { label: "Clean up product", icon: "✨" },
                    { label: "Studio lighting", icon: "💡" },
                    { label: "Add soft shadow", icon: "🌑" },
                    { label: "Fix colors", icon: "🎨" }
                  ].map(hint => (
                    <button
                      key={hint.label}
                      onClick={() => { setPrompt(hint.label); handleEdit(hint.label); }}
                      className="px-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-left flex items-center gap-3"
                    >
                      <span className="text-lg">{hint.icon}</span>
                      {hint.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-2xl">📈</div>
              <h4 className="text-xl font-black text-[#1e2a3a] dark:text-white tracking-tight">Marketplace Edge</h4>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Professional, background-free photos increase trust and click-through rates by up to **65%** in the Clinical Hardware segment.
            </p>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default CleanCutEditor;
