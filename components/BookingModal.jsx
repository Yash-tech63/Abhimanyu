import React, { useState } from 'react';
import { storage } from '../services/storageService';
import { simulateEmailSending } from '../services/geminiService';

const BookingModal = ({ specialist, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [email, setEmail] = useState('');
  const [reminderType, setReminderType] = useState('email');
  const [reminderTiming, setReminderTiming] = useState('1h');
  const [step, setStep] = useState('selection');
  const [isSending, setIsSending] = useState(false);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const times = ['09:00 AM', '10:30 AM', '11:45 AM', '02:15 PM', '04:00 PM', '05:30 PM', '07:00 PM'];

  const handleNext = () => {
    if (step === 'selection' && selectedDate && selectedTime) {
      setStep('reminders');
    } else if (step === 'reminders') {
      setStep('contact');
    }
  };

  const handleConfirm = async () => {
    if (!email.includes('@')) {
      alert("Please enter a valid email for confirmation.");
      return;
    }

    setIsSending(true);
    const appointment = {
      id: Date.now().toString(),
      specialistId: specialist.id,
      specialistName: specialist.name,
      date: `March ${selectedDate}, 2025`,
      time: selectedTime || '',
      reminderType,
      reminderTiming
    };

    await simulateEmailSending(email, appointment);

    storage.saveAppointment(appointment);
    setStep('success');
    setIsSending(false);

    setTimeout(() => {
      onConfirm();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e2a3a]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">

        {step === 'selection' && (
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-50 dark:border-slate-700 shadow-sm">
                  <img src={specialist.image} className="w-full h-full object-cover" alt={specialist.name} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1e2a3a] dark:text-white leading-tight">{specialist.name}</h3>
                  <p className="text-xs font-bold text-[#2f80ed] uppercase tracking-widest mt-1">Specialist Consultation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Select Date (March 2025)</label>
              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 py-1">{d}</div>
                ))}
                {days.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`h-10 w-full rounded-xl text-sm font-bold transition-all ${selectedDate === d
                      ? 'bg-[#2f80ed] text-white shadow-lg shadow-blue-200 scale-105'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Select Time</label>
              <div className="flex flex-wrap gap-2">
                {times.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTime === t
                      ? 'bg-[#1e2a3a] dark:bg-[#2f80ed] text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-[#1e2a3a] dark:bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
            >
              Continue to Reminders
            </button>
          </div>
        )}

        {step === 'reminders' && (
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white">Reminder Settings</h3>
              <p className="text-slate-500 text-sm font-medium">How should we notify you about your consult?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Notification Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['email', 'sms', 'both', 'none'].map(type => (
                    <button
                      key={type}
                      onClick={() => setReminderType(type)}
                      className={`py-4 rounded-2xl font-bold text-sm border-2 transition-all ${reminderType === type
                        ? 'border-[#2f80ed] bg-blue-50/50 text-[#2f80ed] dark:bg-blue-500/10'
                        : 'border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Alert Timing</label>
                <div className="grid grid-cols-3 gap-3">
                  {['24h', '1h', '15m'].map(timing => (
                    <button
                      key={timing}
                      onClick={() => setReminderTiming(timing)}
                      className={`py-4 rounded-2xl font-bold text-sm border-2 transition-all ${reminderTiming === timing
                        ? 'border-[#2f80ed] bg-blue-50/50 text-[#2f80ed] dark:bg-blue-500/10'
                        : 'border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}
                    >
                      {timing === '24h' ? '1 Day before' : timing === '1h' ? '1 Hour before' : '15 Mins before'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#1e2a3a] dark:bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Continue to Contact
            </button>
          </div>
        )}

        {step === 'contact' && (
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white">Final Step</h3>
              <p className="text-slate-500 text-sm font-medium">Verify your contact details for the clinical report.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 ring-blue-100 font-bold transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isSending || !email.includes('@')}
              className="w-full bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
            >
              {isSending ? 'Syncing with Server...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">✅</div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-[#1e2a3a] dark:text-white">Booking Confirmed!</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Your session with **{specialist.name}** is scheduled for **March {selectedDate}, 2025** at **{selectedTime}**.
                Check your email for the meeting link.
              </p>
            </div>
            <div className="pt-6">
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-[progress_4.5s_linear]"></div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Redirecting to Vault...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
