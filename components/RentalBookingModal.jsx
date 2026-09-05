import React, { useState } from 'react';

const RentalBookingModal = ({ equipment, isOpen, onClose, onBookingSuccess }) => {
  const [durationDays, setDurationDays] = useState(14);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [needTechnicianSetup, setNeedTechnicianSetup] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const [formData, setFormData] = useState({
    patientName: 'Uttam Kumar',
    phone: '+91 98765 43210',
    address: '123 Health Street, Cyber City, Zone 4',
    city: 'Bhopal',
    pincode: '462001',
    medicalNote: 'Ground floor delivery preferred.',
    paymentMethod: 'upi'
  });

  if (!isOpen || !equipment) return null;

  const dailyRate = equipment.rentalPrice || 150;
  const rawRentalFee = dailyRate * durationDays;

  // Discount calculation
  let discountPercentage = 0;
  if (durationDays >= 30) discountPercentage = 25;
  else if (durationDays >= 14) discountPercentage = 15;
  else if (durationDays >= 7) discountPercentage = 10;

  const discountAmount = Math.round((rawRentalFee * discountPercentage) / 100);
  const netRentalFee = rawRentalFee - discountAmount;
  const refundableDeposit = Math.min(dailyRate * 5, 2000);
  const deliveryFee = netRentalFee > 1000 ? 0 : 150;
  const grandTotal = netRentalFee + refundableDeposit + deliveryFee;

  // Date calculation
  const start = new Date(startDate || Date.now());
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);

  const formatDate = (d) => {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = `RENT-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(generatedId);
    setIsSubmitted(true);

    if (onBookingSuccess) {
      onBookingSuccess({
        id: equipment.id,
        name: equipment.name,
        brand: equipment.brand,
        price: netRentalFee,
        dailyRate: dailyRate,
        days: durationDays,
        deposit: refundableDeposit,
        bookingId: generatedId,
        startDate: formatDate(start),
        endDate: formatDate(end),
        image: equipment.image,
        mode: 'rent'
      });
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0c1222] rounded-[3rem] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden relative">
        
        {/* Modal Top Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#1e2a3a] via-[#1a2d48] to-[#0f1926] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#2f80ed]/20 rounded-2xl flex items-center justify-center text-3xl border border-[#2f80ed]/40">
              🦽
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-400/30 mb-1">
                <span>CLINICAL RENTAL BOOKING</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {equipment.name}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 text-white transition-all flex items-center justify-center font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {isSubmitted ? (
            /* Booking Confirmation Success Screen */
            <div className="py-10 text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-emerald-500/40 animate-bounce">
                ✓
              </div>

              <div className="space-y-3">
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  Booking Reserved • {bookingId}
                </span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white pt-2">
                  Rental Booking Confirmed! 🎉
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto font-medium">
                  Your clinical hardware booking for <strong>{equipment.name}</strong> has been scheduled.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left max-w-md mx-auto space-y-4">
                <div className="flex justify-between text-xs border-b dark:border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold uppercase">Rental Period</span>
                  <span className="font-black text-slate-800 dark:text-white">{formatDate(start)} ➔ {formatDate(end)}</span>
                </div>
                <div className="flex justify-between text-xs border-b dark:border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold uppercase">Duration</span>
                  <span className="font-black text-[#2f80ed]">{durationDays} Days ({dailyRate} / day)</span>
                </div>
                <div className="flex justify-between text-xs border-b dark:border-slate-800 pb-3">
                  <span className="text-slate-400 font-bold uppercase">Refundable Deposit</span>
                  <span className="font-black text-emerald-500">₹{refundableDeposit.toLocaleString()} (100% Refundable)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1">
                  <span className="dark:text-white">Total Amount Paid</span>
                  <span className="text-[#2f80ed] text-lg">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
                <span>🚚 Technician Dispatch: Doorstep delivery scheduled within 4 hours.</span>
              </div>

              <button
                onClick={handleClose}
                className="px-10 py-4 bg-[#2f80ed] hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105"
              >
                Back to Equipment Portal
              </button>
            </div>
          ) : (
            /* Interactive Rental Booking Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Equipment Quick Overview */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-28 h-28 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-md"
                />
                <div className="flex-1 text-center md:text-left space-y-1">
                  <span className="text-xs font-black text-[#2f80ed] uppercase tracking-widest">
                    {equipment.brand} • {equipment.category}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                    {equipment.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {equipment.description || 'Verified clinical hardware for recovery & diagnostic care.'}
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="text-sm font-black text-[#2f80ed]">
                      ₹{dailyRate} / day
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-0.5 rounded-full">
                      ✓ Sanitized & Hospital Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Duration & Dates Selector */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📅</span>
                  <span>1. Select Rental Duration & Start Date</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Rental Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>

                  {/* Preset Duration Buttons */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Popular Duration Packages
                    </label>
                    <div className="flex gap-2">
                      {[
                        { days: 7, label: '7 Days', disc: '10% OFF' },
                        { days: 14, label: '14 Days', disc: '15% OFF' },
                        { days: 30, label: '30 Days', disc: '25% OFF' }
                      ].map((pkg) => (
                        <button
                          key={pkg.days}
                          type="button"
                          onClick={() => setDurationDays(pkg.days)}
                          className={`flex-1 py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                            durationDays === pkg.days
                              ? 'bg-[#2f80ed] text-white border-[#2f80ed] shadow-lg scale-105'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-xs font-black">{pkg.label}</span>
                          <span className={`text-[9px] font-bold ${durationDays === pkg.days ? 'text-blue-100' : 'text-emerald-500'}`}>
                            {pkg.disc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Days Counter & Date Range Summary */}
                <div className="p-4 bg-blue-50/50 dark:bg-slate-900/50 rounded-2xl border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">Custom Days:</span>
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setDurationDays(Math.max(1, durationDays - 1))}
                        className="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-lg font-bold text-sm text-slate-700 dark:text-white"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-black text-sm text-[#2f80ed]">
                        {durationDays}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDurationDays(durationDays + 1)}
                        className="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-lg font-bold text-sm text-slate-700 dark:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Calculated Schedule</span>
                    <span className="text-xs font-black text-[#2f80ed]">
                      {formatDate(start)} ➔ {formatDate(end)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Patient & Delivery Address Form */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📍</span>
                  <span>2. Patient & Delivery Information</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Emergency Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>
                </div>

                {/* Technician Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    id="techSetup"
                    checked={needTechnicianSetup}
                    onChange={(e) => setNeedTechnicianSetup(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-[#2f80ed] cursor-pointer"
                  />
                  <label htmlFor="techSetup" className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                    Include FREE Doorstep Setup & Clinical Demonstration by Certified Technician
                  </label>
                </div>
              </div>

              {/* Section 4: Cost Calculation & Payment */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>💳</span>
                  <span>3. Pricing & Payment Breakdown</span>
                </h4>

                <div className="bg-slate-50 dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span>Base Rental ({durationDays} days × ₹{dailyRate})</span>
                    <span className="font-bold">₹{rawRentalFee.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Duration Discount ({discountPercentage}% OFF)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span>Refundable Security Deposit (100% Refundable)</span>
                    <span className="font-bold text-slate-800 dark:text-white">₹{refundableDeposit.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span>Doorstep Express Delivery & Setup</span>
                    <span className="font-bold text-emerald-500">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>

                  <div className="pt-3 border-t dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Payable Now</span>
                      <span className="text-2xl font-black text-[#2f80ed]">₹{grandTotal.toLocaleString()}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider block">100% Money-Back Guarantee</span>
                      <span className="text-[11px] text-slate-400">Cancel or return anytime</span>
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / GPay', icon: '📱' },
                      { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                      { id: 'abha', label: 'ABHA Health Card', icon: '🆔' },
                      { id: 'cod', label: 'Pay on Delivery', icon: '💵' }
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                        className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                          formData.paymentMethod === pm.id
                            ? 'bg-[#2f80ed] text-white border-[#2f80ed] shadow-md'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-lg">{pm.icon}</span>
                        <span className="text-[10px] truncate">{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#2f80ed] to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Lock & Confirm Rental Booking</span>
                  <span className="text-lg">➔</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default RentalBookingModal;
