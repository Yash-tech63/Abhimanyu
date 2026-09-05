import React, { useState, useMemo } from 'react';
import { AppView, Language } from '../backened/types';
import { translations } from '../backened/i18n';
import BookingModal from './BookingModal';
import SpecialistProfileModal from './SpecialistProfileModal';

const DEFAULT_DOCTOR_IMAGE = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500';

const specialists = [
  { id: '1', name: 'Dr. Ananya Sharma', specialty: 'General Physician', description: 'Expert in primary healthcare and preventive clinical practices.', fee: 299, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 12, mciNumber: 'MCI-92831', education: 'MBBS, MD (General Medicine)', verificationSource: 'Ayushman Bharat' },
  { id: '2', name: 'Dr. Rajesh Khanna', specialty: 'Dermatologist', description: 'Renowned expert in medical dermatology and skin diagnostics.', fee: 399, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500', availability: 'busy', experience: 10, mciNumber: 'MCI-88219', education: 'MBBS, DDVL', verificationSource: 'MCI Verified' },
  { id: '3', name: 'Dr. Meera Reddy', specialty: 'Pediatrician', description: 'Dedicated to comprehensive childcare and developmental health.', fee: 499, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e59816?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 9, mciNumber: 'MCI-66120', education: 'MBBS, DCH, MD (Peds)', verificationSource: 'Ayushman Bharat' },
  { id: '4', name: 'Dr. Amitav Ghosh', specialty: 'Cardiologist', description: 'Leading interventional cardiologist for advanced cardiac care.', fee: 599, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500', availability: 'offline', experience: 20, mciNumber: 'MCI-00192', education: 'MBBS, MD, DM (Cardio)', verificationSource: 'MCI Verified' },
  { id: '5', name: 'Dr. Sunita Rao', specialty: 'Gynecologist', description: 'Specialist in reproductive health and maternal clinical care.', fee: 449, image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 18, mciNumber: 'MCI-99011', education: 'MBBS, MS (OBG)', verificationSource: 'Ayushman Bharat' },
  { id: '6', name: 'Dr. Harpreet Singh', specialty: 'Dentist', description: 'Aesthetic dentistry and clinical maxillofacial specialist.', fee: 349, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 7, mciNumber: 'DCI-9921', education: 'BDS, MDS', verificationSource: 'Ayushman Bharat' },
  { id: '7', name: 'Dr. Vikram Seth', specialty: 'Orthopedic', description: 'Expert in sports medicine and joint reconstruction therapy.', fee: 499, image: 'https://images.unsplash.com/photo-1582750433449-64c6fecf1df6?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 15, mciNumber: 'MCI-22310', education: 'MBBS, MS (Ortho)', verificationSource: 'MCI Verified' },
  { id: '8', name: 'Dr. Sneha Kapoor', specialty: 'Neurologist', description: 'Board-certified neurologist focusing on epilepsy and neuro-health.', fee: 699, image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=500', availability: 'busy', experience: 14, mciNumber: 'MCI-77102', education: 'MBBS, MD, DM (Neuro)', verificationSource: 'MCI Verified' },
  { id: '9', name: 'Dr. Arjun Nair', specialty: 'Oncologist', description: 'Specialist in clinical oncology and advanced chemotherapy.', fee: 799, image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 16, mciNumber: 'MCI-44102', education: 'MBBS, MD, DM (Onco)', verificationSource: 'MCI Verified' },
  { id: '10', name: 'Dr. Priya Das', specialty: 'Psychiatrist', description: 'Focus on therapeutic mental health and cognitive behavioral therapy.', fee: 549, image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 11, mciNumber: 'MCI-33211', education: 'MBBS, MD (Psych)', verificationSource: 'Ayushman Bharat' },
  { id: '11', name: 'Dr. Rohan Mehta', specialty: 'Endocrinologist', description: 'Expert in metabolic disorders and hormone replacement therapies.', fee: 459, image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=500', availability: 'busy', experience: 13, mciNumber: 'MCI-11922', education: 'MBBS, MD, DNB', verificationSource: 'MCI Verified' },
  { id: '12', name: 'Dr. Kavita Iyer', specialty: 'Ophthalmologist', description: 'Clinical eye care specialist focusing on retina and cataracts.', fee: 399, image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=500', availability: 'available', experience: 10, mciNumber: 'MCI-88200', education: 'MBBS, MS (Oph)', verificationSource: 'Ayushman Bharat' },
];

const SpecialistGrid = ({
  onNavigate,
  lang = Language.EN,
  limit
}) => {
  const [profileSpecialist, setProfileSpecialist] = useState(null);
  const [bookingSpecialist, setBookingSpecialist] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none');

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-4 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search verified specialists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 outline-none font-bold text-sm dark:text-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'GP', 'Skin', 'Kids', 'Heart', 'Neuro'].map(f => {
            const fullF = f === 'GP' ? 'General Physician' : f === 'Skin' ? 'Dermatologist' : f === 'Kids' ? 'Pediatrician' : f === 'Heart' ? 'Cardiologist' : f === 'Neuro' ? 'Neurologist' : 'All';
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(fullF)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === fullF
                  ? 'bg-[#2f80ed] text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
                  }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(s => (
          <div
            key={s.id}
            className="bg-white dark:bg-slate-800/50 p-4 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:shadow-2xl hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col"
            onClick={() => setProfileSpecialist(s)}
          >
            <div className="relative aspect-[1/1] rounded-[2rem] overflow-hidden mb-4 bg-slate-50 dark:bg-slate-900 shadow-inner">
              <img
                src={s.image || DEFAULT_DOCTOR_IMAGE}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white shadow-sm ${s.availability === 'available' ? 'bg-green-500' : s.availability === 'busy' ? 'bg-orange-500' : 'bg-slate-400'
                }`} />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="text-blue-500 text-[10px]">✔</span>
                <span className="text-[8px] font-black text-slate-800 uppercase tracking-tighter">Verified</span>
              </div>
            </div>

            <div className="px-1 flex-1 flex flex-col">
              <p className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest mb-1">{s.specialty}</p>
              <h4 className="font-black text-slate-800 dark:text-white text-base leading-tight mb-2 group-hover:text-[#2f80ed] transition-colors">{s.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">{s.description}</p>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-1">Fee</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">₹{s.fee}</span>
                </div>
                <button className="bg-[#1e2a3a] dark:bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:scale-105 transition-all">
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {profileSpecialist && (
        <SpecialistProfileModal
          specialist={profileSpecialist}
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
    </div>
  );
};

export default SpecialistGrid;
