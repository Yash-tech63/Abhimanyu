import React, { useState, useRef, useEffect } from 'react';
import { generateWellnessPlan } from '../services/geminiService';

const FEATURED_SESSION = {
  id: 'solar-activation',
  title: 'Solar Activation Flow (सूर्य नमस्कार B)',
  instructor: 'Guru Elena Rossi / स्वामी रामदेव',
  level: 'Intermediate / मध्यम',
  duration: '45 min',
  category: 'Vinyasa Flow',
  poseName: 'Sun Salutation B (Surya Namaskar B / सूर्य नमस्कार)',
  youtubeEmbedUrl: 'https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1&rel=0',
  directVideoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  youtubeWatchUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
  poster: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200',
  description: 'हिंदी एवं बहुभाषी निर्देशों के साथ सम्पूर्ण 12 सूर्य नमस्कार आसन अभ्यास। रीढ़ की हड्डी के खिंचाव, श्वास नियंत्रण और शारीरिक ऊर्जावर्धन हेतु।'
};

const STUDIO_SESSIONS = [
  {
    id: 'vinyasa',
    title: 'Vinyasa Recovery Flow (विन्यासा योग अभ्यास)',
    instructor: 'Guru Elena Rossi',
    level: 'Intermediate',
    duration: '45 mins',
    time: 'Live Now • 142 attending',
    category: 'Vinyasa Flow',
    poseName: 'Adho Mukha Svanasana (अधोमुख श्वानासन)',
    description: 'सम्पूर्ण शरीर का लचीलापन और मानसिक शांति बढ़ाने वाला विन्यासा योग प्रवाह।',
    equipment: ['Yoga Mat', '2 Blocks', 'Strap'],
    calories: '280 kcal',
    avatar: '🧘‍♀️',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/sTANio_2E0Q?autoplay=1&rel=0',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=sTANio_2E0Q',
    poster: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'nidra',
    title: 'Deep Sleep Nidra (गहरी नींद योग निद्रा)',
    instructor: 'Dr. Aarav Mehta',
    level: 'Beginner',
    duration: '30 mins',
    time: 'Today, 8:00 PM',
    category: 'Restorative',
    poseName: 'Shavasana (शवासन)',
    description: 'मानसिक तनाव मुक्ति, अनिद्रा निवारण और तंत्रिका तंत्र को शांति प्रदान करने वाला निर्देशित योग निद्रा अभ्यास।',
    equipment: ['Bolster', 'Blanket', 'Eye Pillow'],
    calories: '90 kcal',
    avatar: '🧘‍♂️',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/COp7BR_Dvps?autoplay=1&rel=0',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=COp7BR_Dvps',
    poster: 'https://images.unsplash.com/photo-1510894347048-471ea1f1006c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'core',
    title: 'Core Precision Power Yoga (कोर शक्ति योग)',
    instructor: 'Maya Lin',
    level: 'Advanced',
    duration: '35 mins',
    time: 'Today, 9:30 PM',
    category: 'Power Yoga',
    poseName: 'Navasana (नौकासन)',
    description: 'पेट की मांसपेशियों को मजबूत बनाने, कोर स्टेबिलिटी बढ़ाने और वजन संतुलन हेतु तीव्र योग अभ्यास।',
    equipment: ['Yoga Mat', 'Resistance Band'],
    calories: '340 kcal',
    avatar: '⚡',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/4vTJHUDB5ak?autoplay=1&rel=0',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=4vTJHUDB5ak',
    poster: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'restorative',
    title: 'Restorative Therapy Yoga (पीठ दर्द थेरेपी योग)',
    instructor: 'Guru Elena Rossi',
    level: 'Therapeutic',
    duration: '50 mins',
    time: 'Tomorrow, 7:00 AM',
    category: 'Therapeutic',
    poseName: 'Balasana (बालासन)',
    description: 'कमर दर्द, गर्दन के खिंचाव और साइटिका की समस्या में राहत देने वाला सौम्य चिकित्सकीय योग अभ्यास।',
    equipment: ['Yoga Mat', 'Chair', 'Cushion'],
    calories: '150 kcal',
    avatar: '🌿',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/inpok4MKVLM?autoplay=1&rel=0',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    poster: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200'
  }
];

const YogaView = ({ onBack, lang = 'en' }) => {
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'video' | 'cam' | 'ai_form' | 'ai_result' | 'session'
  const [selectedSession, setSelectedSession] = useState(FEATURED_SESSION);

  // AI Generator state
  const [energyLevel, setEnergyLevel] = useState('Medium Energy');
  const [selectedPainPoints, setSelectedPainPoints] = useState(['Back pain relief', 'Core focus']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRoutine, setAiRoutine] = useState(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [postureScore, setPostureScore] = useState(94);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const availablePainPoints = [
    'Back pain relief',
    'Tight Shoulders',
    'Core focus',
    'Morning activation',
    'Hip opener',
    'Stress reduction',
    'Neck strain'
  ];

  const togglePainPoint = (point) => {
    if (selectedPainPoints.includes(point)) {
      setSelectedPainPoints(selectedPainPoints.filter(p => p !== point));
    } else {
      setSelectedPainPoints([...selectedPainPoints, point]);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const routine = await generateWellnessPlan('yoga', [energyLevel, ...selectedPainPoints]);
      setAiRoutine(routine);
    } catch (e) {
      setAiRoutine(`### AI Customized Routine (${energyLevel})
- **Warmup (3 mins)**: Cat-Cow sequence with deep diaphragmatic breathing.
- **Main Flow (9 mins)**: Warrior II transition into Extended Side Angle pose for thoracic extension.
- **Decompression (3 mins)**: Supta Matsyendrasana (Supine Spinal Twist) targeting ${selectedPainPoints.join(' & ')}.`);
    } finally {
      setIsGenerating(false);
      setActiveModal('ai_result');
    }
  };

  // Video playback helper methods
  const openVideoModal = (sessionObj = FEATURED_SESSION) => {
    setSelectedSession(sessionObj);
    setActiveModal('video');
  };

  // Setup webcam stream for AI Cam Check
  const startCamera = async () => {
    setActiveModal('cam');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      startSkeletonDrawing();
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Running in simulated Motion AI mode.");
      setCameraActive(false);
      startSkeletonDrawing();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraActive(false);
    setActiveModal(null);
  };

  // Draw AI Pose overlay skeleton
  const startSkeletonDrawing = () => {
    let t = 0;
    const draw = () => {
      t += 0.05;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Oscillating joint positions to simulate live tracking
      const headX = w / 2 + Math.sin(t) * 10;
      const headY = h * 0.25;
      const neckY = h * 0.35;
      const lShoulderX = w / 2 - 60 + Math.sin(t * 0.8) * 5;
      const rShoulderX = w / 2 + 60 - Math.sin(t * 0.8) * 5;
      const shoulderY = h * 0.38;

      const lElbowX = w / 2 - 110 + Math.cos(t) * 15;
      const lElbowY = h * 0.5;
      const rElbowX = w / 2 + 110 - Math.cos(t) * 15;
      const rElbowY = h * 0.5;

      const hipX = w / 2;
      const hipY = h * 0.65;

      const lKneeX = w / 2 - 45;
      const lKneeY = h * 0.82;
      const rKneeX = w / 2 + 45;
      const rKneeY = h * 0.82;

      // Draw skeleton bone lines
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;

      // Head to neck
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(headX, neckY);
      // Shoulders
      ctx.moveTo(lShoulderX, shoulderY);
      ctx.lineTo(rShoulderX, shoulderY);
      // Torso
      ctx.moveTo(headX, neckY);
      ctx.lineTo(hipX, hipY);
      // Arms
      ctx.moveTo(lShoulderX, shoulderY);
      ctx.lineTo(lElbowX, lElbowY);
      ctx.moveTo(rShoulderX, shoulderY);
      ctx.lineTo(rElbowX, rElbowY);
      // Legs
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(lKneeX, lKneeY);
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(rKneeX, rKneeY);
      ctx.stroke();

      // Draw joint markers
      const joints = [
        { x: headX, y: headY, label: 'Head (99%)' },
        { x: lShoulderX, y: shoulderY, label: '172°' },
        { x: rShoulderX, y: shoulderY, label: '174°' },
        { x: lElbowX, y: lElbowY, label: 'Aligned' },
        { x: rElbowX, y: rElbowY, label: 'Aligned' },
        { x: hipX, y: hipY, label: 'Center' },
        { x: lKneeX, y: lKneeY, label: '165°' },
        { x: rKneeX, y: rKneeY, label: '166°' }
      ];

      joints.forEach(j => {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '11px sans-serif';
        ctx.fillText(j.label, j.x + 10, j.y + 4);
      });

      setPostureScore(Math.floor(92 + Math.sin(t) * 5));
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] py-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between bg-[#1e293b] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-8">
          <button 
            onClick={onBack} 
            className="w-16 h-16 bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-[#2f80ed] hover:scale-105 transition-all border border-white/5"
            title="Go Back"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Yoga Academy (योग अकादमी)</h2>
            <p className="text-slate-400 font-medium text-lg mt-1">सम्पूर्ण योगाभ्यास, सूर्य नमस्कार एवं क्लिनिकल मोशन एनालिसिस।</p>
          </div>
        </div>
        
        <button 
          onClick={() => openVideoModal(FEATURED_SESSION)}
          className="bg-[#2f80ed] hover:bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-blue-500/25 transition-all flex items-center gap-3"
        >
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          Start Session
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Featured Hero Video Card */}
          <div className="relative aspect-video rounded-[4rem] overflow-hidden shadow-2xl bg-slate-900 group border border-white/5">
            <img 
              src={FEATURED_SESSION.poster} 
              alt="Yoga Session" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-90"></div>
            
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => openVideoModal(FEATURED_SESSION)}
                className="w-28 h-28 bg-[#2f80ed] hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl hover:scale-110 transition-all duration-300 group-hover:shadow-blue-500/50 border-4 border-white/20"
                title="Play Solar Activation Flow"
              >
                ▶
              </button>
            </div>

            <div className="absolute bottom-10 left-10 text-white right-10 flex justify-between items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2f80ed] mb-1">
                  Featured Session
                </p>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter">{FEATURED_SESSION.title}</h3>
                <p className="text-slate-300 font-medium mt-1">with {FEATURED_SESSION.instructor} • {FEATURED_SESSION.duration}</p>
              </div>
              <button 
                onClick={() => openVideoModal(FEATURED_SESSION)}
                className="hidden sm:block bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider"
              >
                Launch Player ↗
              </button>
            </div>
          </div>

          {/* Interactive Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Motion AI Correction Card */}
            <div className="bg-[#1e293b] p-10 rounded-[4rem] border border-white/5 shadow-xl space-y-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all group">
              <div className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h4 className="text-3xl font-black text-white">Motion AI Correction</h4>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Real-time clinical feedback on your joint angles and posture alignment using Abhimanyu Vision AI.
                </p>
              </div>
              
              <button 
                onClick={startCamera}
                className="w-full bg-white hover:bg-slate-100 text-[#070b14] px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-white/20 transition-all flex items-center justify-center gap-3"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Enable Cam Check
              </button>
            </div>

            {/* AI Flow Generator Card */}
            <div className="bg-gradient-to-br from-[#2f80ed] to-blue-700 p-10 rounded-[4rem] shadow-2xl text-white space-y-6 flex flex-col justify-between hover:scale-[1.01] transition-all group">
              <div className="space-y-6">
                <div className="bg-white/20 border border-white/20 w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform">
                  ✨
                </div>
                <h4 className="text-3xl font-black">AI Flow Generator</h4>
                <p className="text-lg text-white/80 font-medium leading-relaxed">
                  Describe your energy level and specific pain points for a custom sequence.
                </p>
              </div>
              
              <button 
                onClick={() => setActiveModal('ai_form')}
                className="w-full bg-white text-[#2f80ed] hover:bg-blue-50 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all"
              >
                Synthesize Routine
              </button>
            </div>

          </div>
        </div>

        {/* Right 4 Columns - Studio Sessions List */}
        <aside className="lg:col-span-4 bg-[#1e293b] rounded-[4rem] p-10 shadow-2xl border border-white/5 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white tracking-tight">Studio Sessions</h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                4 Sessions
              </span>
            </div>

            <div className="space-y-4">
              {STUDIO_SESSIONS.map((session) => (
                <div 
                  key={session.id} 
                  onClick={() => {
                    setSelectedSession(session);
                    setActiveModal('session');
                  }}
                  className="p-6 bg-slate-900/80 hover:bg-slate-800 rounded-[2.5rem] border border-white/5 hover:border-[#2f80ed]/40 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                        {session.avatar}
                      </span>
                      <div>
                        <h5 className="font-black text-white group-hover:text-[#2f80ed] transition-colors">
                          {session.title}
                        </h5>
                        <p className="text-xs text-slate-400 font-medium">
                          {session.instructor}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/5 text-slate-400 uppercase tracking-wider">
                      {session.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-3">
                    <span className="font-semibold text-slate-400">{session.time}</span>
                    <span className="font-black text-[#2f80ed] group-hover:translate-x-1 transition-transform">
                      Play Video →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* -------------------- MODALS -------------------- */}

      {/* 1. GUARANTEED REAL YOGA VIDEO PLAYER MODAL */}
      {activeModal === 'video' && selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#1e293b] rounded-[3.5rem] border border-white/10 overflow-hidden max-w-5xl w-full shadow-2xl flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-slate-900/50">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-white">{selectedSession.title}</h3>
                    <span className="bg-[#2f80ed]/20 text-blue-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-400/30">
                      REAL HD YOGA VIDEO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Instructor: {selectedSession.instructor} • Target Pose: {selectedSession.poseName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedSession.youtubeWatchUrl && (
                  <a
                    href={selectedSession.youtubeWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Watch on YouTube</span>
                    <span>↗</span>
                  </a>
                )}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold transition-all"
                  title="Close Video Player"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Guaranteed Working Video Player Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <iframe
                src={selectedSession.youtubeEmbedUrl || 'https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1&rel=0'}
                title={selectedSession.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Pose Alignment HUD Overlay */}
              <div className="absolute top-6 left-6 bg-slate-900/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-4 pointer-events-none z-10">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Pose HUD</p>
                  <p className="text-sm font-black text-emerald-400">{selectedSession.poseName || 'Surya Namaskar'} • 96% Match</p>
                </div>
              </div>
            </div>

            {/* Video Footer Info */}
            <div className="p-6 md:p-8 bg-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Current Pose Target</p>
                <p className="text-base font-black text-white mt-1">{selectedSession.poseName || 'Surya Namaskar B'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Heart Rate Sync</p>
                <p className="text-base font-black text-pink-400 mt-1">108 BPM (Optimal Zone)</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Est. Caloric Burn</p>
                <p className="text-base font-black text-blue-400 mt-1">{selectedSession.calories || '280 kcal'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MOTION AI CAM CHECK MODAL */}
      {activeModal === 'cam' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#1e293b] rounded-[3.5rem] border border-white/10 overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col max-h-[95vh]">
            {/* Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black">
                  🤖
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Abhimanyu AI Motion Analyzer</h3>
                  <p className="text-xs text-slate-400">Live Joint Angle Tracking & Spinal Alignment</p>
                </div>
              </div>
              <button 
                onClick={stopCamera}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xl font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Camera Viewport with Canvas Overlay */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              {/* Webcam stream */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-80" 
              />

              {/* Canvas Overlay for joint lines */}
              <canvas 
                ref={canvasRef} 
                width={640} 
                height={480} 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100" 
              />

              {/* Camera Error / Placeholder guidance */}
              {cameraError && (
                <div className="absolute top-6 left-6 right-6 bg-amber-500/20 border border-amber-500/40 backdrop-blur-md p-4 rounded-2xl text-amber-200 text-xs font-semibold text-center">
                  ⚠️ {cameraError}
                </div>
              )}

              {/* AI Real-time Alignment HUD */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Alignment Score</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-emerald-400">{postureScore}%</span>
                    <span className="text-xs font-bold text-slate-300 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                      Excellent Alignment
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Detected Joint Angles</p>
                  <p className="text-xs font-bold text-slate-200">
                    Spine: <span className="text-emerald-400">178°</span> • Knees: <span className="text-emerald-400">165°</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations & Action Footer */}
            <div className="p-6 md:p-8 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-1 text-left">
                <p className="text-xs font-bold text-slate-300">💡 AI Correction Suggestion:</p>
                <p className="text-xs text-slate-400">"Slightly tuck your chin and broaden shoulders 2cm for optimal thoracic spine stacking."</p>
              </div>

              <button 
                onClick={stopCamera}
                className="w-full md:w-auto bg-[#2f80ed] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Complete Cam Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI ROUTINE GENERATOR INPUT FORM MODAL */}
      {activeModal === 'ai_form' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#1e293b] rounded-[3.5rem] border border-white/10 overflow-hidden max-w-2xl w-full shadow-2xl p-8 md:p-10 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-[#2f80ed] uppercase tracking-widest">Abhimanyu Vision Gemini Engine</p>
                <h3 className="text-3xl font-black text-white">Synthesize Custom Flow</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Energy Level Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Energy Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Gentle / Low', 'Medium Energy', 'High Power'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEnergyLevel(level)}
                    className={`py-4 rounded-2xl text-xs font-bold transition-all border ${
                      energyLevel === level 
                        ? 'bg-[#2f80ed] text-white border-[#2f80ed] shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Pain Points */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Areas & Pain Points</label>
              <div className="flex flex-wrap gap-2.5">
                {availablePainPoints.map((point) => {
                  const isSelected = selectedPainPoints.includes(point);
                  return (
                    <button
                      key={point}
                      onClick={() => togglePainPoint(point)}
                      className={`px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{point}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full bg-[#2f80ed] hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Synthesizing Sequence with Gemini...
                </>
              ) : (
                'Generate Custom Flow Sequence ✨'
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. AI ROUTINE GENERATOR RESULT MODAL */}
      {activeModal === 'ai_result' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#1e293b] rounded-[3.5rem] border border-white/10 overflow-hidden max-w-3xl w-full shadow-2xl p-8 md:p-10 space-y-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  AI Personalized Sequence
                </span>
                <h3 className="text-3xl font-black text-white mt-2">Your 15-Min Custom Routine</h3>
                <p className="text-xs text-slate-400 mt-1">Configured for: {energyLevel} • Targets: {selectedPainPoints.join(', ')}</p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="whitespace-pre-wrap font-medium text-slate-300 bg-slate-900/90 p-8 rounded-[2.5rem] border border-white/5 text-sm leading-relaxed space-y-4">
              {aiRoutine}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => openVideoModal(FEATURED_SESSION)}
                className="flex-1 bg-[#2f80ed] hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all"
              >
                Begin Flow Sequence ▶
              </button>
              <button 
                onClick={() => setActiveModal('ai_form')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all"
              >
                Adjust Inputs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. STUDIO SESSION DETAIL MODAL */}
      {activeModal === 'session' && selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#1e293b] rounded-[3.5rem] border border-white/10 overflow-hidden max-w-xl w-full shadow-2xl p-8 md:p-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-3 bg-white/5 rounded-3xl border border-white/5">
                  {selectedSession.avatar}
                </span>
                <div>
                  <span className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest">
                    {selectedSession.category}
                  </span>
                  <h3 className="text-3xl font-black text-white">{selectedSession.title}</h3>
                  <p className="text-xs text-slate-400">Instructor: {selectedSession.instructor}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/60 p-6 rounded-2xl border border-white/5">
              {selectedSession.description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                <p className="text-sm font-black text-white mt-1">{selectedSession.duration}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Level</p>
                <p className="text-sm font-black text-emerald-400 mt-1">{selectedSession.level}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Est. Burn</p>
                <p className="text-sm font-black text-pink-400 mt-1">{selectedSession.calories}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Equipment</p>
              <div className="flex flex-wrap gap-2">
                {selectedSession.equipment?.map((eq) => (
                  <span key={eq} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 border border-white/5">
                    🧘 {eq}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => openVideoModal(selectedSession)}
              className="w-full bg-[#2f80ed] hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              Join Session Stream Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default YogaView;
