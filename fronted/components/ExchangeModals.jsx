import React, { useState } from 'react';

/* 1. Equipment Donation Modal */
export const DonateModal = ({ isOpen, onClose, onDonateSuccess }) => {
  const [formData, setFormData] = useState({
    equipmentName: 'Foldable Wheelchair',
    category: 'Mobility',
    condition: 'Gently Used',
    donorName: 'Uttam Kumar',
    phone: '+91 98765 43210',
    address: '123 Health Street, Zone 4',
    city: 'Bhopal',
    pincode: '462001'
  });
  const [submitted, setSubmitted] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `DONATE-${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptId(id);
    setSubmitted(true);
    if (onDonateSuccess) onDonateSuccess(id);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#0c1222] rounded-[3rem] max-w-lg w-full p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/10 relative overflow-hidden">
        
        <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl">
              🤝
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Donate Equipment</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ayushman Clinic Relief Program</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm font-bold">✕</button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-6 animate-in zoom-in">
            <div className="w-20 h-20 bg-purple-500 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-purple-500/40 animate-bounce">
              🎁
            </div>
            <div className="space-y-2">
              <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Receipt #{receiptId}
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white pt-2">Thank You for Donating!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                Your donation of <strong>{formData.equipmentName}</strong> will be sanitized and delivered to an Ayushman rural clinic.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs">
              🎉 500 Abhimanyu Health Credits Awarded to Your Account!
            </div>

            <button onClick={handleClose} className="w-full bg-[#2f80ed] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
              Back to Exchange Hub
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Equipment Name & Model</label>
              <input
                type="text"
                required
                value={formData.equipmentName}
                onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white focus:outline-none"
                >
                  <option value="Mobility">Mobility (Wheelchairs, Crutches)</option>
                  <option value="Respiratory">Respiratory (O2, Concentrators)</option>
                  <option value="Monitoring">Monitoring (BP, Pulse Oximeter)</option>
                  <option value="Surgical">Surgical & Beds</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white focus:outline-none"
                >
                  <option value="Like New">Like New (Unused / Boxed)</option>
                  <option value="Gently Used">Gently Used (Fully Working)</option>
                  <option value="Needs Minor Servicing">Needs Minor Servicing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Donor Name</label>
              <input
                type="text"
                required
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all mt-2"
            >
              Confirm Doorstep Donation Pickup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


/* 2. Trade-In Valuation Calculator & Pickup Modal */
export const TradeInModal = ({ isOpen, onClose, onTradeInSuccess }) => {
  const [equipmentType, setEquipmentType] = useState('Oxygen Concentrator');
  const [ageMonths, setAgeMonths] = useState('6');
  const [condition, setCondition] = useState('good');
  const [submitted, setSubmitted] = useState(false);
  const [tradeId, setTradeId] = useState('');

  if (!isOpen) return null;

  // Real-time valuation logic
  let baseVal = 10000;
  if (equipmentType === 'Oxygen Concentrator') baseVal = 25000;
  if (equipmentType === 'Wheelchair') baseVal = 10000;
  if (equipmentType === 'Patient Monitor') baseVal = 35000;
  if (equipmentType === 'Hospital Bed') baseVal = 20000;

  const ageMultiplier = ageMonths === '3' ? 0.75 : ageMonths === '6' ? 0.6 : ageMonths === '12' ? 0.45 : 0.3;
  const conditionMultiplier = condition === 'excellent' ? 1.1 : condition === 'good' ? 0.9 : 0.7;

  const estimatedValue = Math.round(baseVal * ageMultiplier * conditionMultiplier);
  const healthCredits = Math.round(estimatedValue / 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `TRADE-${Math.floor(100000 + Math.random() * 900000)}`;
    setTradeId(id);
    setSubmitted(true);
    if (onTradeInSuccess) onTradeInSuccess(id, estimatedValue);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#0c1222] rounded-[3rem] max-w-xl w-full p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/10 relative overflow-hidden">
        
        <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">Trade-In Estimator</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Instant Valuation & Credit Swap</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm font-bold">✕</button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-6 animate-in zoom-in">
            <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-blue-500/40 animate-bounce">
              ✓
            </div>
            <div className="space-y-2">
              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Trade Request #{tradeId}
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white pt-2">Trade-In Request Locked!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                Our technician will inspect your <strong>{equipmentType}</strong> at doorstep.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Approved Exchange Credit Value</span>
              <span className="text-3xl font-black text-[#2f80ed]">₹{estimatedValue.toLocaleString()}</span>
              <span className="text-xs text-emerald-500 font-bold block">({healthCredits.toLocaleString()} Abhimanyu Health Credits)</span>
            </div>

            <button onClick={handleClose} className="w-full bg-[#2f80ed] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
              Back to Exchange Hub
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">1. Select Equipment Type</label>
              <select
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold dark:text-white focus:outline-none"
              >
                <option value="Oxygen Concentrator">Oxygen Concentrator (5L / 10L)</option>
                <option value="Wheelchair">Wheelchair (Manual / Motorized)</option>
                <option value="Patient Monitor">Digital Patient Vitals Monitor</option>
                <option value="Hospital Bed">Hospital Bed (Semi-Electric / Hydraulic)</option>
                <option value="Nebulizer">Mesh Nebulizer / Suction Machine</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">2. Equipment Age</label>
                <select
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white focus:outline-none"
                >
                  <option value="3">Less than 6 Months</option>
                  <option value="6">6 to 12 Months</option>
                  <option value="12">1 to 2 Years</option>
                  <option value="24">More than 2 Years</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">3. Working Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white focus:outline-none"
                >
                  <option value="excellent">Excellent (Like New, Fully Serviced)</option>
                  <option value="good">Good (Normal wear, Fully Functional)</option>
                  <option value="fair">Fair (Needs Minor Repair / Calibration)</option>
                </select>
              </div>
            </div>

            {/* Estimated Value Card */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 rounded-3xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Estimated Trade-In Value</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">₹{estimatedValue.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Bonus Credits</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+{healthCredits.toLocaleString()} P+ Credits</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2f80ed] hover:bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all"
            >
              Schedule Inspection & Trade-In Pickup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
