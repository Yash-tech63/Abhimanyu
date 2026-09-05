import React, { useState, useRef, useEffect } from 'react';
import { askHealthBot } from '../services/geminiService';
import { Language } from '../backened/types';

const HealthBot = ({ lang = Language.EN, isPopup = false, onClose }) => {
  const isHindi = lang === Language.HI;
  const initialBotMsg = isHindi
    ? '👋 **पल्स एआई सहायक** में आपका स्वागत है। \n\nमैं आपकी स्वास्थ्य आवश्यकताओं और नैदानिक प्रश्नों का विश्लेषण कर सकता हूं। \n\nआज मैं आपकी क्या सहायता कर सकता हूं?'
    : '👋 Welcome to **Pulse AI Assistant**. \n\nI can analyze your medical data and clinical lifestyle needs. \n\nHow can I support your health goals today?';

  const [messages, setMessages] = useState([
    { role: 'bot', text: initialBotMsg }
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
      { role: 'bot', text: initialBotMsg }
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
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async (customText) => {
    const userMsg = (customText || input).trim();
    if ((!userMsg && !pendingImage) || loading) return;
    const currentImage = pendingImage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg || (isHindi ? "विश्लेषण हो रहा है..." : "Analyzing..."), image: currentImage || undefined }]);
    if (!customText) setInput('');
    setPendingImage(null);
    setLoading(true);
    const reply = await askHealthBot(userMsg || (isHindi ? "चित्र का विश्लेषण करें" : "What do you see in this image?"), currentImage || undefined);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  const quickPrompts = isHindi
    ? ["🩺 लक्षण जांचें", "💊 दवा के बारे में पूछें", "🥗 आहार योजना सलाह"]
    : ["🩺 Check Symptoms", "💊 Medicine Advice", "🥗 Diet Suggestions"];

  return (
    <div className={`bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl flex flex-col ${isPopup ? 'h-[550px] w-full sm:w-[380px]' : 'h-full min-h-[500px] md:h-[750px] w-full'} border border-slate-200 dark:border-slate-800 overflow-hidden transition-all relative`}>
      <div className="bg-[#1e2a3a] dark:bg-slate-900 p-4 text-white shrink-0 flex items-center justify-between border-b dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2f80ed] rounded-xl flex items-center justify-center text-xl shadow-lg">🤖</div>
          <div>
            <h3 className="text-base font-black leading-none">{isHindi ? 'क्लिनिकल एआई डॉक्टर' : 'Clinical AI Assistant'}</h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mt-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-ping' : 'bg-green-400'}`}></span>
              {isListening ? (isHindi ? 'सुन रहा है...' : 'Listening...') : (isHindi ? 'ऑनलाइन' : 'Online')}
            </p>
          </div>
        </div>
        {isPopup && onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
            title={isHindi ? "बंद करें" : "Close"}
          >
            ✕
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-hide bg-[#f8fafc] dark:bg-slate-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] space-y-1.5 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              {m.image && <img src={m.image} className="inline-block rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md max-w-[140px]" alt="Attachment" />}
              <div className={`p-3.5 rounded-[1.25rem] text-xs leading-relaxed shadow-sm inline-block ${m.role === 'user' ? 'bg-[#2f80ed] text-white font-medium' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700'}`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl inline-block shadow-sm animate-pulse text-[10px] font-black uppercase text-slate-400">
            {isHindi ? 'सोच रहा है...' : 'Thinking...'}
          </div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 flex gap-1.5 overflow-x-auto border-t dark:border-slate-800">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-[#2f80ed] hover:text-white whitespace-nowrap transition-all shadow-sm"
            >
              {qp}
            </button>
          ))}
        </div>
      )}

      {pendingImage && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 flex items-center justify-between border-t border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-2">
            <img src={pendingImage} className="w-8 h-8 rounded-lg object-cover" alt="Preview" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{isHindi ? "फ़ोटो संलग्न" : "Photo attached"}</span>
          </div>
          <button onClick={() => setPendingImage(null)} className="text-xs text-red-500 font-bold">✕</button>
        </div>
      )}

      <div className="p-3 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-full p-1.5 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-[#2f80ed] transition-colors"
            title={isHindi ? "फ़ोटो जोड़ें" : "Attach Image"}
          >
            📷
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isHindi ? "स्वास्थ्य प्रश्न लिखें..." : "Type health query..."}
            className="flex-1 bg-transparent border-none outline-none text-xs font-medium px-1 text-slate-800 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-[#2f80ed]'}`}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            🎙️
          </button>
          <button
            onClick={() => handleSend()}
            className="bg-[#2f80ed] hover:bg-blue-600 text-white p-2.5 rounded-full transition-all shadow-md active:scale-95"
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

export default HealthBot;

