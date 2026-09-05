import React, { useState, useEffect, useRef } from 'react';

const VideoConsultModal = ({ specialist, isOpen, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('requesting'); // 'requesting' | 'active' | 'denied' | 'error'
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('call'); // 'call' | 'chat' | 'rx'
  const [mainView, setMainView] = useState('patient'); // 'patient' | 'doctor' - Patient is default main view!
  const [isPhysicalWebcam, setIsPhysicalWebcam] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', text: 'Hello! I am Dr. Ananya. I can see your live video stream. How can I help you today?', time: 'Just now' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const userVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const startCamera = async () => {
    setCameraStatus('requesting');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true
        });

        mediaStreamRef.current = stream;

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.play().catch(() => {});
        }

        setCameraStatus('active');
        setIsPhysicalWebcam(true);
      } else {
        setCameraStatus('denied');
      }
    } catch (err) {
      console.warn('Camera access fallback active:', err);
      setCameraStatus('denied');
    }
  };

  // Initialize device camera on mount
  useEffect(() => {
    if (!isOpen) return;

    startCamera();

    // Call timer interval
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isOpen]);

  // Toggle Microphone
  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Video Camera
  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Handle End Call
  const handleEndCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    onClose();
  };

  // Format call duration MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userText = inputMsg.trim();
    setChatMessages((prev) => [...prev, { sender: 'patient', text: userText, time: 'Just now' }]);
    setInputMsg('');

    // Doctor auto response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'doctor', text: 'I am reviewing your live video stream & symptoms. Please hold camera steady.', time: 'Just now' }
      ]);
    }, 1500);
  };

  if (!isOpen) return null;

  const doctorName = specialist?.name || 'Dr. Ananya Sharma';
  const doctorSpecialty = specialist?.specialty || 'General Physician';
  const doctorImage = specialist?.image || 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600';
  const patientFacePhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0b111e] text-white rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-white/10 relative">
        
        {/* Top Video Call Header */}
        <div className="p-4 sm:p-6 bg-slate-900/80 border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <img
                src={doctorImage}
                alt={doctorName}
                className="w-12 h-12 rounded-2xl object-cover border border-blue-500"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0b111e]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">{doctorName}</h3>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  LIVE HD 5G
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{doctorSpecialty} • Ayushman Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Swap Button */}
            <button
              onClick={() => setMainView(mainView === 'patient' ? 'doctor' : 'patient')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-2xl text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Swap Main View (Patient / Doctor)"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Swap Main View ({mainView === 'patient' ? 'Patient' : 'Doctor'})</span>
            </button>

            {/* Live Call Duration Timer */}
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-2xl">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="font-mono font-black text-sm">{formatTime(callDuration)}</span>
            </div>

            <button
              onClick={handleEndCall}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center font-bold transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Video Viewport & Side Panel Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden bg-slate-950">
          
          {/* Main Video Streams Container */}
          <div className={`${activeTab === 'call' ? 'lg:col-span-12' : 'lg:col-span-8'} relative flex items-center justify-center overflow-hidden transition-all duration-300`}>
            
            {/* 1. PRIMARY MAIN VIEWPORT */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-black overflow-hidden">
              {mainView === 'patient' ? (
                /* Patient Camera Feed as MAIN view */
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Physical Webcam Video Element */}
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
                    className={`w-full h-full object-cover transform -scale-x-100 ${
                      cameraStatus === 'active' && !isVideoOff ? 'block' : 'hidden'
                    }`}
                  />

                  {/* Fallback HD Patient Face Stream Image when camera is loading or permission pending */}
                  {(cameraStatus !== 'active' || isVideoOff) && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={patientFacePhoto}
                        alt="Patient Face View"
                        className="w-full h-full object-cover filter brightness-95 scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>

                      {isVideoOff && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-4xl border border-red-500/30">
                            📷
                          </div>
                          <h4 className="text-2xl font-black text-white">Patient Camera Muted</h4>
                          <p className="text-xs text-slate-300 max-w-xs">
                            Click "Turn Camera On" in bottom toolbar to un-mute video feed.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Doctor Feed as MAIN view */
                <img
                  src={doctorImage}
                  alt={doctorName}
                  className="w-full h-full object-cover opacity-90 filter brightness-95 scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 pointer-events-none"></div>

              {/* Main View Status Badge */}
              <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 z-20">
                <span className="text-xs text-emerald-400 animate-pulse">●</span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {mainView === 'patient'
                    ? isVideoOff
                      ? '👤 PATIENT CAMERA MUTED (You)'
                      : '👤 LIVE PATIENT CAMERA STREAM (You)'
                    : `🩺 ${doctorName} (Doctor Feed)`}
                </span>
              </div>

              {/* Re-trigger Web Camera Access Button if needed */}
              {mainView === 'patient' && cameraStatus !== 'active' && !isVideoOff && (
                <button
                  onClick={startCamera}
                  className="absolute bottom-10 left-6 bg-[#2f80ed] hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-2xl border border-blue-400/30 flex items-center gap-2 z-30 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>📷</span>
                  <span>Enable Web Camera Feed</span>
                </button>
              )}
            </div>

            {/* 2. FLOATING OVERLAY PICTURE-IN-PICTURE (PIP) VIEWPORT */}
            <div 
              onClick={() => setMainView(mainView === 'patient' ? 'doctor' : 'patient')}
              className="absolute bottom-6 right-6 w-44 sm:w-60 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/60 bg-slate-900 z-30 transition-all hover:scale-105 cursor-pointer group"
              title="Click to Swap Main View"
            >
              {mainView === 'patient' ? (
                /* PIP shows Doctor */
                <div className="relative w-full h-full">
                  <img src={doctorImage} alt={doctorName} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-white tracking-wider backdrop-blur-sm flex items-center gap-1">
                    <span>🩺 {doctorName}</span>
                  </div>
                </div>
              ) : (
                /* PIP shows Patient Live Camera / Face */
                <div className="relative w-full h-full overflow-hidden">
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 ${
                      cameraStatus === 'active' && !isVideoOff ? 'block' : 'hidden'
                    }`}
                  />
                  {(cameraStatus !== 'active' || isVideoOff) && (
                    <img src={patientFacePhoto} alt="Patient Face" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase text-white tracking-wider backdrop-blur-sm">
                    👤 Patient (You)
                  </div>
                </div>
              )}

              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                SWAP VIEW 🔄
              </div>
            </div>

          </div>

          {/* Optional Right Drawer Side Tab (Chat / Doctor Notes / Prescription) */}
          {activeTab !== 'call' && (
            <div className="lg:col-span-4 bg-slate-900 border-l border-white/10 flex flex-col h-full z-20">
              
              {/* Tab Selector */}
              <div className="flex border-b border-white/10 bg-slate-950/50 p-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === 'chat' ? 'bg-[#2f80ed] text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💬 Live Chat
                </button>
                <button
                  onClick={() => setActiveTab('rx')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === 'rx' ? 'bg-[#2f80ed] text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💊 Prescription
                </button>
              </div>

              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-3 p-2">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium ${
                            msg.sender === 'patient'
                              ? 'bg-[#2f80ed] text-white rounded-br-none'
                              : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Type symptom or question..."
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#2f80ed]"
                    />
                    <button type="submit" className="bg-[#2f80ed] hover:bg-blue-600 px-4 py-2.5 rounded-xl text-xs font-black text-white">
                      Send
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'rx' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-xs font-black text-[#2f80ed]">Digital Clinical Note</span>
                      <span className="text-[10px] text-slate-400">Live Sync</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      • Recommended rest for 3 days.<br />
                      • Hydration & Warm Saline Rinse.<br />
                      • Paracetamol 500mg (1 tablet after meals twice daily if fever occurs).
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 z-20">
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isMuted ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700'
              }`}
            >
              <span className="text-lg">{isMuted ? '🔇' : '🎙️'}</span>
              <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute Mic'}</span>
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isVideoOff ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700'
              }`}
            >
              <span className="text-lg">{isVideoOff ? '📷' : '📹'}</span>
              <span className="hidden sm:inline">{isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? 'call' : 'chat')}
              className={`p-4 rounded-2xl font-bold text-xs border border-white/10 transition-all flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-[#2f80ed] text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span>💬</span>
              <span>Live Chat</span>
            </button>

            <button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>📞</span>
              <span>End Consultation</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VideoConsultModal;
