import React, { useState, useMemo } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';
import BookingModal from './BookingModal';
import SpecialistProfileModal from './SpecialistProfileModal';
import VideoConsultModal from './VideoConsultModal';

const DEFAULT_DOCTOR_IMAGE = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';

const specialists = [
  { id: '1', name: 'Dr. Ananya Sharma', specialty: 'General Physician', description: 'Expert in primary healthcare and preventive clinical practices.', fee: 299, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 12, mciNumber: 'MCI-92831', education: 'MBBS, MD (General Medicine)', verificationSource: 'Ayushman Bharat' },
  { id: '2', name: 'Dr. Rajesh Khanna', specialty: 'Dermatologist', description: 'Renowned expert in medical dermatology and skin diagnostics.', fee: 399, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600', availability: 'busy', experience: 10, mciNumber: 'MCI-88219', education: 'MBBS, DDVL', verificationSource: 'MCI Verified' },
  { id: '3', name: 'Dr. Meera Reddy', specialty: 'Pediatrician', description: 'Dedicated to comprehensive childcare and developmental health.', fee: 499, image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 9, mciNumber: 'MCI-66120', education: 'MBBS, DCH, MD (Peds)', verificationSource: 'Ayushman Bharat' },
  { id: '4', name: 'Dr. Amitav Ghosh', specialty: 'Cardiologist', description: 'Leading interventional cardiologist for advanced cardiac care.', fee: 599, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600', availability: 'offline', experience: 20, mciNumber: 'MCI-00192', education: 'MBBS, MD, DM (Cardio)', verificationSource: 'MCI Verified' },
  { id: '5', name: 'Dr. Sunita Rao', specialty: 'Gynecologist', description: 'Specialist in reproductive health and maternal clinical care.', fee: 449, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 18, mciNumber: 'MCI-99011', education: 'MBBS, MS (OBG)', verificationSource: 'Ayushman Bharat' },
  { id: '6', name: 'Dr. Harpreet Singh', specialty: 'Dentist', description: 'Aesthetic dentistry and clinical maxillofacial specialist.', fee: 349, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 7, mciNumber: 'DCI-9921', education: 'BDS, MDS', verificationSource: 'Ayushman Bharat' },
  { id: '7', name: 'Dr. Vikram Seth', specialty: 'Orthopedic', description: 'Expert in sports medicine and joint reconstruction therapy.', fee: 499, image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 15, mciNumber: 'MCI-22310', education: 'MBBS, MS (Ortho)', verificationSource: 'MCI Verified' },
  { id: '8', name: 'Dr. Sneha Kapoor', specialty: 'Neurologist', description: 'Board-certified neurologist focusing on epilepsy and neuro-health.', fee: 699, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600', availability: 'busy', experience: 14, mciNumber: 'MCI-77102', education: 'MBBS, MD, DM (Neuro)', verificationSource: 'MCI Verified' },
  { id: '9', name: 'Dr. Arjun Nair', specialty: 'Oncologist', description: 'Specialist in clinical oncology and advanced chemotherapy.', fee: 799, image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 16, mciNumber: 'MCI-44102', education: 'MBBS, MD, DM (Onco)', verificationSource: 'MCI Verified' },
  { id: '10', name: 'Dr. Priya Das', specialty: 'Psychiatrist', description: 'Focus on therapeutic mental health and cognitive behavioral therapy.', fee: 549, image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 11, mciNumber: 'MCI-33211', education: 'MBBS, MD (Psych)', verificationSource: 'Ayushman Bharat' },
  { id: '11', name: 'Dr. Rohan Mehta', specialty: 'Endocrinologist', description: 'Expert in metabolic disorders and hormone replacement therapies.', fee: 459, image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=600', availability: 'busy', experience: 13, mciNumber: 'MCI-11922', education: 'MBBS, MD, DNB', verificationSource: 'MCI Verified' },
  { id: '12', name: 'Dr. Kavita Iyer', specialty: 'Ophthalmologist', description: 'Clinical eye care specialist focusing on retina and cataracts.', fee: 399, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', availability: 'available', experience: 10, mciNumber: 'MCI-88200', education: 'MBBS, MS (Oph)', verificationSource: 'Ayushman Bharat' },
];

const specialistHindiSpecialties = {
  'General Physician': 'जनरल फिजिशियन',
  'Dermatologist': 'त्वचा रोग विशेषज्ञ',
  'Pediatrician': 'बाल रोग विशेषज्ञ',
  'Cardiologist': 'हृदय रोग विशेषज्ञ',
  'Gynecologist': 'स्त्री रोग विशेषज्ञ',
  'Dentist': 'दंत चिकित्सक',
  'Orthopedic': 'अस्थि रोग विशेषज्ञ',
  'Neurologist': 'न्यूरोलॉजिस्ट',
  'Oncologist': 'कैंसर रोग विशेषज्ञ',
  'Psychiatrist': 'मनोचिकित्सक',
  'Endocrinologist': 'एंडोक्रिनोलॉजिस्ट',
  'Ophthalmologist': 'नेत्र रोग विशेषज्ञ'
};

const specialistHindiNames = {
  '1': 'डॉ. अनन्या शर्मा',
  '2': 'डॉ. राजेश खन्ना',
  '3': 'डॉ. मीरा रेड्डी',
  '4': 'डॉ. अमिताव घोष',
  '5': 'डॉ. सुनिता राव',
  '6': 'डॉ. हरप्रीत सिंह',
  '7': 'डॉ. विक्रम सेठ',
  '8': 'डॉ. स्नेहा कपूर',
  '9': 'डॉ. अर्जुन नायर',
  '10': 'डॉ. प्रिया दास',
  '11': 'डॉ. रोहन मेहता',
  '12': 'डॉ. कविता अय्यर'
};

const specialistHindiDescs = {
  '1': 'प्राथमिक स्वास्थ्य देखभाल और निवारक चिकित्सा पद्धतियों में विशेषज्ञ।',
  '2': 'मेडिकल डर्मेटोलॉजी और त्वचा निदान के प्रसिद्ध विशेषज्ञ।',
  '3': 'व्यापक बाल देखभाल और विकासात्मक स्वास्थ्य के लिए समर्पित।',
  '4': 'उन्नत हृदय देखभाल के लिए प्रमुख इंटरवेंशनल कार्डियोलॉजिस्ट।',
  '5': 'प्रजनन स्वास्थ्य और मातृ नैदानिक देखभाल में विशेषज्ञ।',
  '6': 'सौंदर्य दंत चिकित्सा और नैदानिक मैक्सिलोफेशियल विशेषज्ञ।',
  '7': 'खेल चिकित्सा और जोड़ पुनर्निर्माण थेरेपी के विशेषज्ञ।',
  '8': 'मिर्गी और न्यूरो-स्वास्थ्य पर केंद्रित बोर्ड-प्रमाणित न्यूरोलॉजिस्ट।',
  '9': 'नैदानिक ऑन्कोलॉजी और उन्नत कीमोथेरेपी में विशेषज्ञ।',
  '10': 'चिकित्सकीय मानसिक स्वास्थ्य और संज्ञानात्मक व्यवहार थेरेपी।',
  '11': 'चयापचय संबंधी विकारों और हार्मोन रिप्लेसमेंट थेरेपी के विशेषज्ञ।',
  '12': 'रेटीना और मोतियाबिंद पर ध्यान केंद्रित करने वाले नैदानिक नेत्र विशेषज्ञ।'
};

const SpecialistGrid = ({
  onNavigate,
  lang = Language.EN,
  limit
}) => {
  const [profileSpecialist, setProfileSpecialist] = useState(null);
  const [bookingSpecialist, setBookingSpecialist] = useState(null);
  const [videoSpecialist, setVideoSpecialist] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none');

  const isHindi = lang === Language.HI;
  const t = translations[lang].sections;

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(t => t.length > 0);

    return specialists
      .filter(s => activeFilter === 'All' || s.specialty === activeFilter)
      .map(s => {
        let score = 0;
        if (tokens.length > 0) {
          const nameLower = s.name.toLowerCase();
          const specialtyLower = s.specialty.toLowerCase();
          const descLower = s.description.toLowerCase();
          const eduLower = s.education.toLowerCase();

          if (nameLower.includes(q)) score += 100;
          tokens.forEach(token => {
            if (nameLower.includes(token)) score += 50;
            if (specialtyLower.includes(token)) score += 30;
            if (eduLower.includes(token)) score += 20;
            if (descLower.includes(token)) score += 10;
          });
          if (nameLower.startsWith(q)) score += 150;
        } else {
          score = 1;
        }
        return { ...s, relevanceScore: score };
      })
      .filter(s => s.relevanceScore > 0)
      .sort((a, b) => {
        if (tokens.length > 0 && b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        if (sortBy === 'fee') return a.fee - b.fee;
        if (sortBy === 'experience') return b.experience - a.experience;
        return 0;
      })
      .slice(0, limit);
  }, [searchQuery, activeFilter, sortBy, limit]);

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Instant Video Consultation Call Section */}
      <div className="bg-gradient-to-r from-[#1e2a3a] via-[#16273e] to-[#0f1d2e] rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="space-y-3 max-w-2xl text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-black uppercase tracking-wider border border-blue-400/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            <span>24/7 LIVE DOCTOR CAMERA CALL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Instant Specialist Video Consultation
          </h2>
          <p className="text-slate-300 text-sm md:text-base font-normal leading-relaxed">
            Connect live with Ayushman Bharat verified doctors. Launches your real device camera & microphone for instant video diagnosis.
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <button
            onClick={() => setVideoSpecialist(specialists[0])}
            className="bg-gradient-to-r from-[#2f80ed] to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer border border-blue-400/30"
          >
            <span className="text-xl animate-pulse">📹</span>
            <span>{isHindi ? "अभी वीडियो कॉल शुरू करें" : "Start Video Call Now"}</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-4 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder={isHindi ? "सत्यापित डॉक्टर खोजें..." : "Search verified specialists..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 outline-none font-bold text-sm dark:text-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'GP', 'Skin', 'Kids', 'Heart', 'Neuro'].map(f => {
            const fullF = f === 'GP' ? 'General Physician' : f === 'Skin' ? 'Dermatologist' : f === 'Kids' ? 'Pediatrician' : f === 'Heart' ? 'Cardiologist' : f === 'Neuro' ? 'Neurologist' : 'All';
            const labelF = isHindi
              ? (f === 'All' ? 'सभी' : f === 'GP' ? 'फिजिशियन' : f === 'Skin' ? 'त्वचा' : f === 'Kids' ? 'बच्चों के' : f === 'Heart' ? 'हृदय' : 'न्यूरो')
              : f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(fullF)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === fullF
                  ? 'bg-[#2f80ed] text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
                  }`}
              >
                {labelF}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(s => (
          <div
            key={s.id}
            className="bg-white dark:bg-slate-800/50 p-5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:shadow-2xl hover:border-blue-500/30 transition-all group flex flex-col justify-between"
          >
            <div
              className="relative aspect-[1/1] rounded-[2rem] overflow-hidden mb-4 bg-slate-50 dark:bg-slate-900 shadow-inner cursor-pointer"
              onClick={() => setProfileSpecialist(s)}
            >
              <img
                src={s.image || DEFAULT_DOCTOR_IMAGE}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_DOCTOR_IMAGE; }}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute top-3 right-3 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${s.availability === 'available' ? 'bg-green-500' : s.availability === 'busy' ? 'bg-orange-500' : 'bg-slate-400'
                }`} />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="text-blue-500 text-[10px]">✔</span>
                <span className="text-[8px] font-black text-slate-800 uppercase tracking-tighter">
                  {isHindi ? "सत्यापित" : "Verified"}
                </span>
              </div>
            </div>

            <div className="px-1 flex-1 flex flex-col">
              <p className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest mb-1">
                {isHindi ? (specialistHindiSpecialties[s.specialty] || s.specialty) : s.specialty}
              </p>
              <h4
                onClick={() => setProfileSpecialist(s)}
                className="font-black text-slate-800 dark:text-white text-base leading-tight mb-2 group-hover:text-[#2f80ed] transition-colors cursor-pointer"
              >
                {isHindi ? (specialistHindiNames[s.id] || s.name) : s.name}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">
                {isHindi ? (specialistHindiDescs[s.id] || s.description) : s.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                    {isHindi ? "परामर्श शुल्क" : "Consult Fee"}
                  </span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">₹{s.fee}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVideoSpecialist(s)}
                    className="bg-[#2f80ed] hover:bg-blue-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    title="Start Live Video Camera Consult"
                  >
                    <span>📹</span>
                    <span>{isHindi ? "वीडियो" : "Video"}</span>
                  </button>

                  <button
                    onClick={() => setBookingSpecialist(s)}
                    className="bg-[#1e2a3a] dark:bg-slate-700 hover:bg-slate-800 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {isHindi ? "बुक करें" : "Book"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {profileSpecialist && (
        <SpecialistProfileModal
          specialist={profileSpecialist}
          lang={lang}
          onClose={() => setProfileSpecialist(null)}
          onProceedToBooking={() => {
            setBookingSpecialist(profileSpecialist);
            setProfileSpecialist(null);
          }}
        />
      )}

      {bookingSpecialist && (
        <BookingModal
          specialist={bookingSpecialist}
          onClose={() => setBookingSpecialist(null)}
          onConfirm={() => setBookingSpecialist(null)}
        />
      )}

      {/* Dedicated Video Consultation Room Modal with Real Camera Support */}
      <VideoConsultModal
        specialist={videoSpecialist}
        isOpen={!!videoSpecialist}
        onClose={() => setVideoSpecialist(null)}
      />
    </div>
  );
};

export default SpecialistGrid;
