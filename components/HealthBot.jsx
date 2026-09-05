import React, { useState, useRef, useEffect } from 'react';
import { askHealthBot } from '../services/geminiService';

const HealthBot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Welcome to **Pulse AI Assistant**. \n\nI can analyze your medical data and clinical lifestyle needs. \n\nHow can I support your health goals today?' }
  ]);
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) setInput(prev => (prev ? prev + ' ' : '') + transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    const userMsg = input.trim();
    if ((!userMsg && !pendingImage) || loading) return;
    const currentImage = pendingImage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg || "Analyzing...", image: currentImage || undefined }]);
    setInput('');
    setPendingImage(null);
    setLoading(true);
    const reply = await askHealthBot(userMsg || "What do you see in this image?", currentImage || undefined);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl flex flex-col h-full min-h-[500px] md:h-[750px] border border-slate-100 dark:border-slate-800 overflow-hidden w-full transition-all">
      <div className="bg-[#1e2a3a] p-5 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shadow-lg">🤖</div>
          <div>
            <h3 className="text-lg font-black leading-none">Clinical AI</h3>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-60 mt-1 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-400 animate-ping' : 'bg-green-400'}`}></span>
              {isListening ? 'Listening' : 'Ready'}
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-hide bg-[#f8fafc] dark:bg-slate-900/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              {m.image && <img src={m.image} className="inline-block rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md max-w-[150px]" />}
              <div className={`p-4 rounded-[1.5rem] text-xs leading-relaxed shadow-sm inline-block ${m.role === 'user' ? 'bg-[#2f80ed] text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700'}`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl inline-block shadow-sm animate-pulse text-[10px] font-black uppercase text-slate-400">Thinking...</div>}
      </div>

      <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-full p-1.5">
          <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-[#2f80ed]">📷</button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type health query..."
            className="flex-1 bg-transparent border-none outline-none text-xs font-bold px-1 dark:text-white"
          />
          <button onClick={toggleListening} className={`p-3 rounded-full ${isListening ? 'bg-red-100 text-red-500' : 'text-slate-400'}`}>🎙️</button>
          <button onClick={handleSend} className="bg-[#1e2a3a] text-white p-3 rounded-full">➔</button>
        </div>
      </div>
      <input type="file" hidden ref={fileInputRef} onChange={e => {
        const file = e.target.files?.[0];
        if (file) {
          const r = new FileReader();
          r.onload = ev => setPendingImage(ev.target?.result);
          r.readAsDataURL(file);
        }
      }} />
    </div>
  );
};

export default HealthBot;
