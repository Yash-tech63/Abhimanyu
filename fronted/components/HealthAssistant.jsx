import React, { useState, useRef, useEffect } from 'react';
import { askHealthBot } from '../services/geminiService';
import { Language } from '../../backened/types';

const HealthAssistant = ({ lang = Language.EN, onClose }) => {
  const isHindi = lang === Language.HI;

  const initialMessage = isHindi
    ? '👋 नमस्ते! मैं आपका पर्सनल **हेल्थ असिस्टेंट** (Health Assistant) हूं।\n\nमैं लक्षणों की जांच, दवाओं की जानकारी, और डाइट टिप्स में आपकी मदद कर सकता हूं। आज आप क्या जानना चाहते हैं?'
    : '👋 Hello! I am your personal **Health Assistant**.\n\nI can assist you with symptom checking, medication information, and personalized diet tips. What health query do you have today?';

  const [messages, setMessages] = useState([
    { role: 'assistant', text: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMessages([
      { role: 'assistant', text: initialMessage }
    ]);
  }, [lang]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHindi ? 'hi-IN' : 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) setInput(prev => (prev ? prev + ' ' : '') + transcript);
      };
      recognitionRef.current = recognition;
    }
  }, [isHindi]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customText) => {
    const query = (customText || input).trim();
    if ((!query && !pendingImage) || loading) return;

    const currentImg = pendingImage;
    setMessages(prev => [
      ...prev,
      { role: 'user', text: query || (isHindi ? "चित्र का विश्लेषण..." : "Analyzing image..."), image: currentImg || undefined }
    ]);

    if (!customText) setInput('');
    setPendingImage(null);
    setLoading(true);

    const promptText = query || (isHindi ? "इस चिकित्सा चित्र या दस्तावेज़ का विश्लेषण करें और स्वास्थ्य सलाह दें।" : "Analyze this medical document or image and provide health insights.");
    const reply = await askHealthBot(promptText, currentImg || undefined);

    setMessages(prev => [
      ...prev,
      { role: 'assistant', text: reply }
    ]);
    setLoading(false);
  };

  const quickCategories = isHindi ? [
    { id: 'symptoms', label: '🩺 लक्षण जांच', prompt: 'मुझे बुखार और सिरदर्द है। मुझे क्या करना चाहिए?' },
    { id: 'meds', label: '💊 दवा निर्देश', prompt: 'पैरासिटामोल दवा के क्या उपयोग और सावधानियां हैं?' },
    { id: 'diet', label: '🥗 आहार सलाह', prompt: 'उच्च रक्तचाप (High BP) के लिए सही आहार क्या है?' },
    { id: 'vitals', label: '📊 वाइटल्स गाइड', prompt: 'सामान्य रक्तचाप (BP) की सीमा क्या होनी चाहिए?' }
  ] : [
    { id: 'symptoms', label: '🩺 Symptoms', prompt: 'I have mild fever and headache. What should I do?' },
    { id: 'meds', label: '💊 Medicine Info', prompt: 'What are the uses and safety precautions for Paracetamol?' },
    { id: 'diet', label: '🥗 Diet Plan', prompt: 'What is a healthy daily diet plan for managing high blood pressure?' },
    { id: 'vitals', label: '📊 Vitals Guide', prompt: 'What are normal adult ranges for Blood Pressure and SpO2?' }
  ];

  return (
    <div className="w-full sm:w-[380px] md:w-[400px] h-[480px] sm:h-[500px] max-h-[calc(100vh-170px)] bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e2a3a] via-[#1e293b] to-[#0f172a] p-4 text-white shrink-0 flex items-center justify-between border-b border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-[#2f80ed] to-blue-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg ring-2 ring-white/20">
            🩺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-tight text-white">
                {isHindi ? 'हेल्थ असिस्टेंट' : 'Health Assistant'}
              </h3>
              <span className="bg-[#2f80ed]/30 text-blue-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-400/30">
                AI 2.0
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 mt-0.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-ping' : 'bg-green-400'}`}></span>
              {isListening ? (isHindi ? 'सुन रहा है...' : 'Listening...') : (isHindi ? '24/7 क्लिनिकल सपोर्ट' : '24/7 Clinical Support')}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all"
            title={isHindi ? "बंद करें" : "Close"}
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide bg-[#f8fafc] dark:bg-slate-900/60">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] space-y-1.5 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              {m.image && (
                <img
                  src={m.image}
                  className="inline-block rounded-2xl border-2 border-white dark:border-slate-700 shadow-md max-w-[150px] mb-1"
                  alt="Medical Attachment"
                />
              )}
              <div
                className={`p-4 rounded-[1.5rem] text-xs leading-relaxed inline-block shadow-sm ${m.role === 'user'
                    ? 'bg-[#2f80ed] text-white font-medium rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/70 rounded-tl-none'
                  }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl inline-block shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400">
            <span className="w-2 h-2 bg-[#2f80ed] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[#2f80ed] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-[#2f80ed] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-[10px] font-black uppercase tracking-wider ml-1">
              {isHindi ? 'हेल्थ असिस्टेंट विश्लेषण कर रहा है...' : 'Health Assistant is analyzing...'}
            </span>
          </div>
        )}
      </div>

      {/* Quick Category Chips */}
      {messages.length <= 3 && (
        <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
          {quickCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSend(cat.prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#1e2a3a] dark:text-slate-200 text-[10px] font-black hover:bg-[#2f80ed] hover:text-white transition-all whitespace-nowrap border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview Banner */}
      {pendingImage && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 flex items-center justify-between border-t border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center gap-2">
            <img src={pendingImage} className="w-8 h-8 rounded-lg object-cover border border-blue-200" alt="Preview" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {isHindi ? "संलग्न फ़ोटो/रिपोर्ट तैयार है" : "Report image ready for analysis"}
            </span>
          </div>
          <button onClick={() => setPendingImage(null)} className="text-xs text-red-500 font-bold px-2">✕</button>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 rounded-full p-1.5 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-[#2f80ed] transition-colors"
            title={isHindi ? "रिपोर्ट/फ़ोटो अपलोड करें" : "Upload Report / Image"}
          >
            📷
          </button>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isHindi ? "स्वास्थ्य प्रश्न या लक्षण लिखें..." : "Ask Health Assistant anything..."}
            className="flex-1 bg-transparent border-none outline-none text-xs font-medium px-1 text-slate-800 dark:text-white placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-[#2f80ed]'}`}
            title={isListening ? "Stop voice input" : "Voice search"}
          >
            🎙️
          </button>

          <button
            type="button"
            onClick={() => handleSend()}
            className="bg-[#2f80ed] hover:bg-blue-600 text-white p-2.5 rounded-full transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
          >
            ➔
          </button>
        </div>
      </div>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const r = new FileReader();
            r.onload = ev => setPendingImage(ev.target?.result);
            r.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
};

export default HealthAssistant;
