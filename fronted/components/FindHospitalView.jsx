import React, { useState, useMemo } from 'react';
import { Language, AppView } from '../../backened/types';

const hospitalData = [
  {
    id: 'hosp-1',
    name: 'AIIMS New Delhi (All India Institute of Medical Sciences)',
    shortName: 'AIIMS New Delhi',
    type: 'Apex Institute',
    typeBadge: 'Apex Super Speciality',
    state: 'Delhi NCR',
    city: 'New Delhi',
    district: 'Central Delhi',
    pincode: '110029',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029',
    phone: '011-26588500',
    emergencyPhone: '011-26594405',
    opdHours: '08:00 AM - 01:00 PM (Mon-Sat)',
    totalBeds: 2478,
    icuBedsAvailable: 142,
    ventilatorsAvailable: 68,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.9,
    reviewsCount: 14200,
    departments: ['Trauma Center', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'Nephrology', 'Organ Transplant'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=AIIMS+New+Delhi'
  },
  {
    id: 'hosp-2',
    name: 'Vardhman Mahavir Medical College & Safdarjung Hospital',
    shortName: 'Safdarjung Hospital',
    type: 'Govt General Hospital',
    typeBadge: 'Govt Tertiary Hospital',
    state: 'Delhi NCR',
    city: 'New Delhi',
    district: 'South Delhi',
    pincode: '110029',
    address: 'Ring Road, Opposite AIIMS, New Delhi - 110029',
    phone: '011-26707444',
    emergencyPhone: '011-26707000',
    opdHours: '08:30 AM - 01:30 PM (Mon-Sat)',
    totalBeds: 2900,
    icuBedsAvailable: 98,
    ventilatorsAvailable: 45,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.7,
    reviewsCount: 9800,
    departments: ['Burn & Trauma Unit', 'General Surgery', 'General Medicine', 'Pulmonology', 'Obstetrics & Gynaecology', 'Dermatology'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=Safdarjung+Hospital+New+Delhi'
  },
  {
    id: 'hosp-3',
    name: 'PGIMER Chandigarh (Post Graduate Institute of Medical Education & Research)',
    shortName: 'PGIMER Chandigarh',
    type: 'Apex Institute',
    typeBadge: 'Apex Research Center',
    state: 'Punjab & UT',
    city: 'Chandigarh',
    district: 'Chandigarh',
    pincode: '160012',
    address: 'Madhya Marg, Sector 12, Chandigarh - 160012',
    phone: '0172-2747585',
    emergencyPhone: '0172-2756565',
    opdHours: '08:00 AM - 01:00 PM',
    totalBeds: 1950,
    icuBedsAvailable: 76,
    ventilatorsAvailable: 34,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.8,
    reviewsCount: 8400,
    departments: ['Advanced Cardiac Center', 'Advanced Eye Center', 'Pediatric Medicine', 'Nephrology', 'Bone Marrow Transplant'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=PGIMER+Chandigarh'
  },
  {
    id: 'hosp-4',
    name: "King George's Medical University (KGMU) & Hospital",
    shortName: 'KGMU Hospital',
    type: 'Govt General Hospital',
    typeBadge: 'Govt Medical College',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    district: 'Lucknow',
    pincode: '226003',
    address: 'Shah Mina Road, Chowk, Lucknow, Uttar Pradesh - 226003',
    phone: '0522-2257540',
    emergencyPhone: '0522-2257450',
    opdHours: '08:00 AM - 02:00 PM',
    totalBeds: 3500,
    icuBedsAvailable: 110,
    ventilatorsAvailable: 50,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.6,
    reviewsCount: 11200,
    departments: ['Trauma Center 24/7', 'Cardiovascular Surgery', 'Pediatric Surgery', 'Gastroenterology', 'Radiotherapy'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=KGMU+Lucknow'
  },
  {
    id: 'hosp-5',
    name: 'Seth GS Medical College & KEM Hospital',
    shortName: 'KEM Hospital Mumbai',
    type: 'Govt General Hospital',
    typeBadge: 'Municipal Govt Tertiary',
    state: 'Maharashtra',
    city: 'Mumbai',
    district: 'Mumbai City',
    pincode: '400012',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra - 400012',
    phone: '022-24107000',
    emergencyPhone: '022-24107400',
    opdHours: '08:30 AM - 01:30 PM',
    totalBeds: 2250,
    icuBedsAvailable: 85,
    ventilatorsAvailable: 40,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.7,
    reviewsCount: 10500,
    departments: ['Casualty & Acute Care', 'Neonatology', 'Nephrology & Dialysis', 'Orthopedics', 'Plastic Surgery'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=KEM+Hospital+Mumbai'
  },
  {
    id: 'hosp-6',
    name: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    shortName: 'RGGGH Chennai',
    type: 'Govt General Hospital',
    typeBadge: 'State Govt Apex',
    state: 'Tamil Nadu',
    city: 'Chennai',
    district: 'Chennai',
    pincode: '600003',
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu - 600003',
    phone: '044-25305000',
    emergencyPhone: '044-25305111',
    opdHours: '07:30 AM - 12:30 PM',
    totalBeds: 3100,
    icuBedsAvailable: 120,
    ventilatorsAvailable: 60,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.8,
    reviewsCount: 12800,
    departments: ['Trauma Care Unit', 'Cardiothoracic Care', 'Rheumatology', 'Vascular Surgery', 'Free Dialysis Center'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=Rajiv+Gandhi+Government+General+Hospital+Chennai'
  },
  {
    id: 'hosp-7',
    name: 'Community Health Center (CHC) Greater Noida & Primary Center',
    shortName: 'CHC Greater Noida',
    type: 'Community Health Center',
    typeBadge: 'Govt CHC Center',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    district: 'Gautam Buddha Nagar',
    pincode: '201310',
    address: 'Near Knowledge Park II, Greater Noida, Uttar Pradesh - 201310',
    phone: '0120-2326001',
    emergencyPhone: '0120-2326002',
    opdHours: '08:00 AM - 02:00 PM',
    totalBeds: 120,
    icuBedsAvailable: 18,
    ventilatorsAvailable: 8,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: false,
    rating: 4.4,
    reviewsCount: 1650,
    departments: ['General OPD', 'Maternal & Child Health', 'Immunization Center', 'Emergency Stabilization', 'Lab Diagnostics'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=CHC+Greater+Noida'
  },
  {
    id: 'hosp-8',
    name: 'Primary Health Center (PHC) Ballabgarh Rural Health Hub',
    shortName: 'PHC Ballabgarh',
    type: 'Primary Health Center',
    typeBadge: 'Govt PHC Health Center',
    state: 'Haryana',
    city: 'Ballabgarh',
    district: 'Faridabad',
    pincode: '121004',
    address: 'Main Market Road, Ballabgarh, Faridabad, Haryana - 121004',
    phone: '0129-2241022',
    emergencyPhone: '0129-2241099',
    opdHours: '09:00 AM - 03:00 PM',
    totalBeds: 50,
    icuBedsAvailable: 8,
    ventilatorsAvailable: 3,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: false,
    rating: 4.3,
    reviewsCount: 920,
    departments: ['Free OPD', 'Primary Maternal Care', 'Ayush Wellness Unit', 'Vaccination Drive', 'Free Essential Medicines'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=PHC+Ballabgarh'
  },
  {
    id: 'hosp-9',
    name: 'IPGMER & SSKM Hospital Kolkata',
    shortName: 'SSKM Hospital Kolkata',
    type: 'Govt General Hospital',
    typeBadge: 'State Apex Research',
    state: 'West Bengal',
    city: 'Kolkata',
    district: 'Kolkata',
    pincode: '700020',
    address: '244 AJC Bose Road, Bhowanipore, Kolkata, West Bengal - 700020',
    phone: '033-22231589',
    emergencyPhone: '033-22231515',
    opdHours: '08:30 AM - 01:30 PM',
    totalBeds: 1800,
    icuBedsAvailable: 64,
    ventilatorsAvailable: 28,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.7,
    reviewsCount: 7600,
    departments: ['Cardiology', 'Cardiothoracic Surgery', 'Neurology', 'Dialysis Center', 'Oncology Unit'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=SSKM+Hospital+Kolkata'
  },
  {
    id: 'hosp-10',
    name: 'Victoria Hospital (Bangalore Medical College & Research Institute)',
    shortName: 'Victoria Hospital Bengaluru',
    type: 'Govt General Hospital',
    typeBadge: 'Govt Medical College',
    state: 'Karnataka',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    pincode: '560002',
    address: 'Fort Road, Near City Market, Bengaluru, Karnataka - 560002',
    phone: '080-26701150',
    emergencyPhone: '080-26701100',
    opdHours: '08:00 AM - 01:00 PM',
    totalBeds: 1200,
    icuBedsAvailable: 52,
    ventilatorsAvailable: 22,
    is24x7Emergency: true,
    isAyushmanAccepted: true,
    isAbhaLinked: true,
    isCghsApproved: true,
    rating: 4.6,
    reviewsCount: 6800,
    departments: ['Burns Ward', 'Emergency Trauma Unit', 'General Surgery', 'E.N.T Speciality', 'Pathology Lab'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    mapsUrl: 'https://maps.google.com/?q=Victoria+Hospital+Bengaluru'
  }
];

const FindHospitalView = ({ onBack, onNavigate, lang = Language.EN }) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [onlyIcuAvailable, setOnlyIcuAvailable] = useState(false);
  const [onlyAyushman, setOnlyAyushman] = useState(false);
  const [only24x7, setOnly24x7] = useState(false);

  const isHindi = lang === Language.HI;

  // OPD Token Modal State
  const [selectedHospitalForToken, setSelectedHospitalForToken] = useState(null);
  const [tokenFormData, setTokenFormData] = useState({
    patientName: '',
    abhaId: '',
    phone: '',
    department: 'General Medicine',
    visitDate: new Date().toISOString().split('T')[0]
  });
  const [generatedToken, setGeneratedToken] = useState(null);

  const filteredHospitals = useMemo(() => {
    return hospitalData.filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()) ||
        h.district.toLowerCase().includes(search.toLowerCase()) ||
        h.pincode.includes(search) ||
        h.departments.some((d) => d.toLowerCase().includes(search.toLowerCase()));

      const matchType = selectedType === 'All' || h.type === selectedType;
      const matchState = selectedState === 'All' || h.state === selectedState;
      const matchIcu = !onlyIcuAvailable || h.icuBedsAvailable > 0;
      const matchAyushman = !onlyAyushman || h.isAyushmanAccepted;
      const match24x7 = !only24x7 || h.is24x7Emergency;

      return matchSearch && matchType && matchState && matchIcu && matchAyushman && match24x7;
    });
  }, [search, selectedType, selectedState, onlyIcuAvailable, onlyAyushman, only24x7]);

  const handleGenerateToken = (e) => {
    e.preventDefault();
    if (!tokenFormData.patientName || !tokenFormData.phone) {
      alert(isHindi ? 'कृपया मरीज़ का नाम और फोन नंबर भरें।' : 'Please fill in patient name and phone number.');
      return;
    }

    const randomQueueNum = Math.floor(Math.random() * 25) + 3;
    const tokenNum = `AB-OPD-${Math.floor(1000 + Math.random() * 9000)}`;

    setGeneratedToken({
      tokenId: tokenNum,
      queueNumber: randomQueueNum,
      hospitalName: selectedHospitalForToken.name,
      patientName: tokenFormData.patientName,
      abhaId: tokenFormData.abhaId || '14-Digit ABHA Linked',
      phone: tokenFormData.phone,
      department: tokenFormData.department,
      visitDate: tokenFormData.visitDate,
      estimatedTime: `${Math.floor(8 + Math.random() * 3)}:${(Math.floor(Math.random() * 4) * 15).toString().padStart(2, '0')} AM`
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] py-12 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      {/* Top Header Bar */}
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#2f80ed]/10 text-[#2f80ed] rounded-full text-xs font-black uppercase tracking-wider border border-[#2f80ed]/20">
            <span className="w-2 h-2 bg-[#2f80ed] rounded-full animate-ping"></span>
            {isHindi ? "राष्ट्रीय स्वास्थ्य निर्देशिका 🇮🇳" : "National Health Directory 🇮🇳"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            {isHindi ? "सरकारी अस्पताल और चिकित्सा स्वास्थ्य केंद्र" : "Government Hospitals & Medical Health Centers"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-3xl">
            {isHindi
              ? "आयुष्मान भारत PM-JAY सत्यापित अस्पताल, एम्स (AIIMS), CHC और PHC केंद्र 24x7 आईसीयू बेड ट्रैकिंग एवं डिजिटल ओपीडी टोकन के साथ।"
              : "Verified Ayushman Bharat PM-JAY facilities, AIIMS, CHCs, and PHCs across India with 24x7 ICU bed tracking and digital OPD queue tokens."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              {isHindi ? "➔ होम पर वापस जाएं" : "➔ Back to Home"}
            </button>
          )}
          <button
            onClick={() => onNavigate?.(AppView.AMBULANCE)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            🚑 {isHindi ? "एम्बुलेंस का अनुरोध करें" : "Request Ambulance"}
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Control Toolbar */}
      <div className="max-w-[1440px] mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 shadow-lg border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isHindi ? "अस्पताल का नाम, शहर, जिला या पिन कोड से खोजें (उदा. एम्स, सफदरजंग, 110029)..." : "Search by Hospital Name, City, District, PIN (e.g. AIIMS, Safdarjung, Lucknow, 110029)..."}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm focus:ring-2 focus:ring-[#2f80ed] outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">🔍</span>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* State Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm focus:ring-2 focus:ring-[#2f80ed] outline-none cursor-pointer"
            >
              <option value="All">{isHindi ? "📍 सभी राज्य / यूटी" : "📍 All States / UTs"}</option>
              <option value="Delhi NCR">Delhi NCR (दिल्ली एनसीआर)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
              <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
              <option value="Tamil Nadu">Tamil Nadu (तमिलनाडु)</option>
              <option value="Karnataka">Karnataka (कर्नाटक)</option>
              <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
              <option value="Punjab & UT">Punjab & UT (पंजाब)</option>
              <option value="Haryana">Haryana (हरियाणा)</option>
            </select>
          </div>

          {/* Facility Type Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm focus:ring-2 focus:ring-[#2f80ed] outline-none cursor-pointer"
            >
              <option value="All">{isHindi ? "🏛️ सभी प्रकार के केंद्र" : "🏛️ All Facility Types"}</option>
              <option value="Apex Institute">{isHindi ? "शीर्ष संस्थान (AIIMS/PGIMER)" : "Apex Institute (AIIMS/PGIMER)"}</option>
              <option value="Govt General Hospital">{isHindi ? "सरकारी सामान्य अस्पताल" : "Govt General Hospital"}</option>
              <option value="Community Health Center">{isHindi ? "सामुदायिक स्वास्थ्य केंद्र (CHC)" : "Community Health Center (CHC)"}</option>
              <option value="Primary Health Center">{isHindi ? "प्राथमिक स्वास्थ्य केंद्र (PHC)" : "Primary Health Center (PHC)"}</option>
            </select>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">
              {isHindi ? "त्वरित फ़िल्टर:" : "Quick Filters:"}
            </span>

            <button
              onClick={() => setOnlyIcuAvailable(!onlyIcuAvailable)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${onlyIcuAvailable
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
            >
              <span>{isHindi ? "🛏️ आईसीयू बेड उपलब्ध" : "🛏️ ICU Beds Available"}</span>
            </button>

            <button
              onClick={() => setOnlyAyushman(!onlyAyushman)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${onlyAyushman
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
            >
              <span>{isHindi ? "💳 आयुष्मान PM-JAY" : "💳 Ayushman PM-JAY"}</span>
            </button>

            <button
              onClick={() => setOnly24x7(!only24x7)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${only24x7
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
            >
              <span>{isHindi ? "🚨 24x7 आपातकालीन" : "🚨 24x7 Emergency"}</span>
            </button>
          </div>

          <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
            {isHindi
              ? <>कुल <span className="text-[#2f80ed] font-black">{filteredHospitals.length}</span> सत्यापित सरकारी केंद्र उपलब्ध हैं</>
              : <>Showing <span className="text-[#2f80ed] font-black">{filteredHospitals.length}</span> verified Government Facilities</>}
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Card Header & Image */}
            <div className="space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={hosp.image}
                  alt={hosp.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-[#2f80ed] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                    {hosp.typeBadge}
                  </span>
                  {hosp.is24x7Emergency && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                      24x7 Emergency
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-white">
                  <span className="text-xs font-extrabold flex items-center gap-1">
                    📍 {hosp.city}, {hosp.state}
                  </span>
                  <span className="bg-yellow-500/90 text-slate-950 font-black px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1 backdrop-blur-md">
                    ★ {hosp.rating} ({hosp.reviewsCount.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Card Main Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-[#2f80ed] transition-colors leading-snug">
                    {hosp.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 line-clamp-1">
                    {hosp.address}
                  </p>
                </div>

                {/* Vitals Bed Count Tracker Banner */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {isHindi ? "खाली आईसीयू बेड" : "Free ICU Beds"}
                    </span>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>🛏️ {hosp.icuBedsAvailable} {isHindi ? "बेड खाली" : "Beds"}</span>
                    </p>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-3">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {isHindi ? "कुल बेड क्षमता" : "Total Facility Beds"}
                    </span>
                    <p className="text-lg font-black text-slate-700 dark:text-slate-200">
                      🏛️ {hosp.totalBeds} {isHindi ? "कुल" : "Total"}
                    </p>
                  </div>
                </div>

                {/* Badges & Schemes */}
                <div className="flex flex-wrap gap-2">
                  {hosp.isAyushmanAccepted && (
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border border-blue-200 dark:border-blue-800/50">
                      💳 {isHindi ? "आयुष्मान मुफ्त इलाज" : "Ayushman PM-JAY Free Care"}
                    </span>
                  )}
                  {hosp.isAbhaLinked && (
                    <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border border-purple-200 dark:border-purple-800/50">
                      🆔 ABHA QR Token
                    </span>
                  )}
                  {hosp.isCghsApproved && (
                    <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800/50">
                      🏛️ {isHindi ? "सीजीएचएस स्वीकृत" : "CGHS Approved"}
                    </span>
                  )}
                </div>

                {/* Key Departments */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    {isHindi ? "विशेषता विभाग:" : "Clinical Specialties:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.departments.slice(0, 4).map((dept) => (
                      <span key={dept} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                        {dept}
                      </span>
                    ))}
                    {hosp.departments.length > 4 && (
                      <span className="bg-slate-100 dark:bg-slate-800 text-[#2f80ed] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                        +{hosp.departments.length - 4} {isHindi ? "अन्य" : "more"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Buttons Footer */}
            <div className="p-6 pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedHospitalForToken(hosp)}
                  className="w-full bg-[#2f80ed] hover:bg-blue-600 text-white py-3 rounded-2xl font-black text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🎫 {isHindi ? "ओपीडी टोकन" : "OPD Token"}</span>
                </button>

                <a
                  href={hosp.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white py-3 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 text-center"
                >
                  <span>🗺️ {isHindi ? "दिशा-निर्देश" : "Directions"}</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${hosp.emergencyPhone}`}
                  className="text-red-500 hover:text-red-600 font-extrabold flex items-center gap-1"
                >
                  <span>📞 {isHindi ? "आपातकालीन:" : "Emergency:"} {hosp.emergencyPhone}</span>
                </a>
                <button
                  onClick={() => onNavigate?.(AppView.AMBULANCE)}
                  className="text-[#2f80ed] hover:underline font-extrabold text-[11px]"
                >
                  {isHindi ? "एम्बुलेंस बुक करें ➔" : "Book Ambulance ➔"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="max-w-[1440px] mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center space-y-4 border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="text-6xl mb-2">🏥</div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">No Government Facilities Found</h3>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            No hospitals matched your search term "{search}". Try searching for a different city or clearing your quick filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedType('All');
              setSelectedState('All');
              setOnlyIcuAvailable(false);
              setOnlyAyushman(false);
              setOnly24x7(false);
            }}
            className="bg-[#2f80ed] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            Reset All Search Filters
          </button>
        </div>
      )}

      {/* OPD Queue Token Generator Modal */}
      {selectedHospitalForToken && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-start border-b dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#2f80ed] tracking-widest">
                  Ayushman Bharat Digital OPD Counter 🎫
                </span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {selectedHospitalForToken.shortName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedHospitalForToken(null);
                  setGeneratedToken(null);
                }}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full font-bold flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {!generatedToken ? (
              <form onSubmit={handleGenerateToken} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-400">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={tokenFormData.patientName}
                    onChange={(e) => setTokenFormData({ ...tokenFormData, patientName: e.target.value })}
                    placeholder="Enter Patient Name as per Aadhaar / ABHA"
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">ABHA Address / Number</label>
                    <input
                      type="text"
                      value={tokenFormData.abhaId}
                      onChange={(e) => setTokenFormData({ ...tokenFormData, abhaId: e.target.value })}
                      placeholder="e.g. 91-8492-1940-2918"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={tokenFormData.phone}
                      onChange={(e) => setTokenFormData({ ...tokenFormData, phone: e.target.value })}
                      placeholder="10-digit phone number"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">OPD Department *</label>
                    <select
                      value={tokenFormData.department}
                      onChange={(e) => setTokenFormData({ ...tokenFormData, department: e.target.value })}
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs"
                    >
                      {selectedHospitalForToken.departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">Visit Date</label>
                    <input
                      type="date"
                      value={tokenFormData.visitDate}
                      onChange={(e) => setTokenFormData({ ...tokenFormData, visitDate: e.target.value })}
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 font-medium">
                  ℹ️ Generating a Digital OPD Token allows priority queue access at the Ayushman Digital OPD desk without standing in manual registration queues.
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2f80ed] hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
                >
                  Issue Digital OPD Queue Token 🎟️
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 p-6 rounded-[2.5rem] border-2 border-[#2f80ed] text-center space-y-4 shadow-xl">
                  <div className="inline-block bg-[#2f80ed] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Official OPD Queue Pass 🇮🇳
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Token Reference ID</span>
                    <h4 className="text-3xl font-black text-[#2f80ed] font-mono tracking-widest">
                      {generatedToken.tokenId}
                    </h4>
                  </div>

                  <div className="flex justify-center items-center gap-6 py-3 border-y border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Queue Position</span>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        #{generatedToken.queueNumber}
                      </p>
                    </div>
                    <div className="h-8 border-r border-slate-200 dark:border-slate-700"></div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Estimated Counter Time</span>
                      <p className="text-xl font-black text-slate-800 dark:text-white">
                        {generatedToken.estimatedTime}
                      </p>
                    </div>
                  </div>

                  <div className="text-left text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <p><strong>Patient Name:</strong> {generatedToken.patientName}</p>
                    <p><strong>Department:</strong> {generatedToken.department}</p>
                    <p><strong>Hospital:</strong> {generatedToken.hospitalName}</p>
                    <p><strong>Date:</strong> {generatedToken.visitDate}</p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-mono text-center">
                      [QR CODE VERIFIED]
                      <br />
                      ABHA LINKED
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => alert(`OPD Token ${generatedToken.tokenId} saved to your ABHA Vault!`)}
                    className="w-full bg-[#2f80ed] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg"
                  >
                    Save to Health Vault 💾
                  </button>
                  <button
                    onClick={() => {
                      setSelectedHospitalForToken(null);
                      setGeneratedToken(null);
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider"
                  >
                    Close Pass
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindHospitalView;
