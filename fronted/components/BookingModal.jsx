
import React, { useState } from "react";
import { storage } from "../services/storageService";
import api from "../services/api";

const BookingModal = ({ specialist, onClose, onConfirm }) => {
  // =====================================================
  // STATES
  // =====================================================

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [step, setStep] = useState("selection");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Generated OPD token
  const [createdToken, setCreatedToken] = useState(null);

  // =====================================================
  // NEXT 30 DAYS
  // =====================================================

  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() + index);

    return {
      value: date.toISOString().split("T")[0],

      day: date.getDate(),

      month: date.toLocaleString("en-US", {
        month: "short",
      }),

      weekday: date.toLocaleString("en-US", {
        weekday: "short",
      }),
    };
  });

  // =====================================================
  // OPD TIME SLOTS
  // =====================================================

  const times = [
    "09:00 AM",
    "10:30 AM",
    "11:45 AM",
    "02:15 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM",
  ];

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formattedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )
    : "";

  // =====================================================
  // DOCTOR DETAILS
  // =====================================================

  const doctorName = specialist?.name || "Doctor";

  const doctorId =
    specialist?.doctorId ||
    specialist?.id ||
    specialist?._id;

  const department =
    specialist?.specialty ||
    specialist?.specialization ||
    "General Medicine";

  const hospitalName =
    specialist?.hospitalName ||
    "Smart Healthcare Hospital";

  // =====================================================
  // STEP 1 -> STEP 2
  // =====================================================

  const handleNext = () => {
    setError("");

    if (!selectedDate) {
      setError("Please select appointment date.");
      return;
    }

    if (!selectedTime) {
      setError("Please select appointment time.");
      return;
    }

    setStep("details");
  };

  // =====================================================
  // STEP 2 -> STEP 3
  // =====================================================

  const handleReview = () => {
    setError("");

    if (!selectedDate || !selectedTime) {
      setError("Please select appointment date and time.");
      return;
    }

    setStep("confirmation");
  };

  // =====================================================
  // CREATE OPD TOKEN
  // =====================================================

  const handleConfirm = async () => {
    try {
      setError("");
      setIsSending(true);

      // -------------------------------------------------
      // 1. CHECK LOGIN
      // -------------------------------------------------

      const storedUser = localStorage.getItem("user");
      const authToken = localStorage.getItem("token");

      if (!storedUser || !authToken) {
        setError("Please login first.");
        setIsSending(false);
        return;
      }

      // -------------------------------------------------
      // 2. GET PATIENT PROFILE
      // -------------------------------------------------

      console.log("================================");
      console.log("FETCHING PATIENT PROFILE");
      console.log("================================");

      let profileResponse;

      try {
        profileResponse = await api.get("/auth/profile");

        console.log(
          "PATIENT PROFILE:",
          profileResponse.data
        );
      } catch (profileError) {
        console.error(
          "PATIENT PROFILE ERROR:",
          profileError.response?.data ||
          profileError.message
        );

        setError(
          profileError.response?.data?.message ||
          "Unable to fetch patient profile. Please login again."
        );

        setIsSending(false);
        return;
      }

      const patient = profileResponse?.data?.user;

      if (!patient?._id) {
        setError(
          "Patient profile not found. Please login again."
        );

        setIsSending(false);
        return;
      }

      const patientId = patient._id;

      // -------------------------------------------------
      // 3. CHECK DOCTOR
      // -------------------------------------------------

      if (!doctorId) {
        setError("Doctor information is missing.");
        setIsSending(false);
        return;
      }

      // -------------------------------------------------
      // 4. CHECK REQUIRED OPD FIELDS
      // -------------------------------------------------

      if (!hospitalName) {
        setError("Hospital information is missing.");
        setIsSending(false);
        return;
      }

      if (!department) {
        setError("Department information is missing.");
        setIsSending(false);
        return;
      }

      if (!selectedDate) {
        setError("Please select appointment date.");
        setIsSending(false);
        return;
      }

      if (!selectedTime) {
        setError("Please select appointment time.");
        setIsSending(false);
        return;
      }

      // -------------------------------------------------
      // 5. OPD DATA
      // -------------------------------------------------

      const opdData = {
        patientId,
        hospitalName,
        doctorId,
        department,
        appointmentDate: selectedDate,
        estimatedTime: selectedTime,
        symptoms: symptoms?.trim() || "",
      };

      console.log("================================");
      console.log("SENDING OPD DATA:");
      console.log(opdData);
      console.log("================================");

      // -------------------------------------------------
      // 6. CREATE OPD TOKEN
      // -------------------------------------------------

      const response = await api.post(
        "/opd/create",
        opdData
      );

      console.log(
        "OPD CREATE RESPONSE:",
        response.data
      );

      // -------------------------------------------------
      // 7. CHECK RESPONSE
      // -------------------------------------------------

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
          "Failed to generate OPD token."
        );
      }

      // -------------------------------------------------
      // 8. GET CREATED TOKEN
      // -------------------------------------------------

      const tokenData = response.data?.token;

      if (!tokenData) {
        throw new Error(
          "Token was created but token data was not returned."
        );
      }

      console.log(
        "OPD TOKEN CREATED:",
        tokenData
      );

      // -------------------------------------------------
      // 9. SAVE TOKEN IN STATE
      // -------------------------------------------------

      setCreatedToken(tokenData);

      // -------------------------------------------------
      // 10. SAVE BOOKING LOCALLY
      // -------------------------------------------------

      const appointment = {
        id:
          tokenData?._id ||
          Date.now().toString(),

        tokenId: tokenData?._id,

        tokenNumber: tokenData?.tokenNumber,

        patientId,

        doctorId,

        specialistId: doctorId,

        specialistName: doctorName,

        doctorName,

        hospitalName,

        department,

        appointmentDate: selectedDate,

        date: selectedDate,

        estimatedTime: selectedTime,

        time: selectedTime,

        symptoms: symptoms?.trim() || "",

        queuePosition:
          tokenData?.queuePosition,

        status:
          tokenData?.status ||
          "booked",

        notification: "email",

        createdAt:
          new Date().toISOString(),
      };

      console.log(
        "SAVING APPOINTMENT:",
        appointment
      );

      // -------------------------------------------------
      // IMPORTANT:
      // Storage fail hone par backend booking
      // fail nahi honi chahiye.
      // -------------------------------------------------

      try {
        storage.saveAppointment(appointment);

        console.log(
          "BOOKING SAVED SUCCESSFULLY"
        );
      } catch (storageError) {
        console.error(
          "STORAGE SAVE ERROR:",
          storageError
        );
      }

      // -------------------------------------------------
      // 11. OPEN SUCCESS PAGE
      // -------------------------------------------------

      console.log(
        "OPENING SUCCESS PAGE..."
      );

      setCreatedToken(tokenData);

      setIsSending(false);

      setStep("success");

      // IMPORTANT:
      // onConfirm yahan call NAHI karna.
      //
      // Agar parent onConfirm ke andar modal close karta hai,
      // to success page render hone se pehle component unmount
      // ho jayega.
      //
      // onConfirm Done button par call hoga.

    } catch (error) {
      console.error(
        "================================"
      );

      console.error(
        "BOOKING ERROR:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error.response?.data
      );

      console.error(
        "================================"
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to book appointment."
      );

      setIsSending(false);
    }
  };

  // =====================================================
  // DONE
  // =====================================================

  const handleDone = () => {
    console.log(
      "BOOKING DONE:",
      createdToken
    );

    // Parent callback only after success screen
    if (onConfirm) {
      onConfirm(createdToken);
    }

    onClose();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e2a3a]/60 backdrop-blur-sm animate-in fade-in duration-300">

      <div className="bg-white dark:bg-[#1e293b] w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">

        {/* =================================================
            STEP 1
        ================================================= */}

        {step === "selection" && (
          <div className="p-8 md:p-12 space-y-8">

            {/* HEADER */}

            <div className="flex justify-between items-start">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-50 dark:border-slate-700 shadow-sm">

                  <img
                    src={
                      specialist?.image ||
                      "/default-doctor.png"
                    }
                    className="w-full h-full object-cover"
                    alt={doctorName}
                    onError={(e) => {
                      e.currentTarget.onerror =
                        null;

                      e.currentTarget.src =
                        "/default-doctor.png";
                    }}
                  />

                </div>

                <div>

                  <h3 className="text-xl font-black text-[#1e2a3a] dark:text-white leading-tight">
                    {doctorName}
                  </h3>

                  <p className="text-xs font-bold text-[#2f80ed] uppercase tracking-widest mt-1">
                    OPD Consultation
                  </p>

                </div>

              </div>

              <button
                onClick={onClose}
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

            </div>

            {/* OPD INFORMATION */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* HOSPITAL */}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Hospital
                </p>

                <p className="mt-1 font-bold text-[#1e2a3a] dark:text-white">
                  {hospitalName}
                </p>

              </div>

              {/* DOCTOR */}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Doctor
                </p>

                <p className="mt-1 font-bold text-[#1e2a3a] dark:text-white">
                  {doctorName}
                </p>

              </div>

              {/* DEPARTMENT */}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 sm:col-span-2">

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Department
                </p>

                <p className="mt-1 font-bold text-[#1e2a3a] dark:text-white">
                  {department}
                </p>

              </div>

            </div>

            {/* DATE */}

            <div className="space-y-4">

              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Appointment Date *
              </label>

              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">

                {days.map((date) => (

                  <button
                    key={date.value}
                    type="button"
                    onClick={() => {
                      setSelectedDate(
                        date.value
                      );

                      setError("");
                    }}
                    className={`
                      p-2 rounded-xl transition-all
                      ${selectedDate ===
                        date.value
                        ? "bg-[#2f80ed] text-white shadow-lg shadow-blue-200 scale-105"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }
                    `}
                  >

                    <span className="block text-[9px] font-black uppercase opacity-70">
                      {date.weekday}
                    </span>

                    <span className="block text-lg font-black">
                      {date.day}
                    </span>

                    <span className="block text-[9px] font-bold opacity-70">
                      {date.month}
                    </span>

                  </button>

                ))}

              </div>

            </div>

            {/* TIME */}

            <div className="space-y-4">

              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Estimated Consultation Time *
              </label>

              <div className="flex flex-wrap gap-2">

                {times.map((time) => (

                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time);
                      setError("");
                    }}
                    className={`
                      px-4 py-3 rounded-xl text-xs font-bold transition-all
                      ${selectedTime === time
                        ? "bg-[#1e2a3a] dark:bg-[#2f80ed] text-white shadow-lg"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100"
                      }
                    `}
                  >
                    {time}
                  </button>

                ))}

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* CONTINUE */}

            <button
              type="button"
              onClick={handleNext}
              disabled={
                !selectedDate ||
                !selectedTime
              }
              className="w-full bg-[#1e2a3a] dark:bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue to Details
            </button>

          </div>
        )}

        {/* =================================================
            STEP 2
        ================================================= */}

        {step === "details" && (
          <div className="p-8 md:p-12 space-y-8">

            <div className="flex justify-between items-start">

              <div>

                <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white">
                  Appointment Details
                </h3>

                <p className="text-slate-500 text-sm font-medium mt-1">
                  Add symptoms or reason for your visit.
                </p>

              </div>

              <button
                onClick={onClose}
                className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                ✕
              </button>

            </div>

            {/* SUMMARY */}

            <div className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Doctor
                  </p>

                  <p className="font-bold text-[#1e2a3a] dark:text-white mt-1">
                    {doctorName}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Department
                  </p>

                  <p className="font-bold text-[#1e2a3a] dark:text-white mt-1">
                    {department}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Date
                  </p>

                  <p className="font-bold text-[#1e2a3a] dark:text-white mt-1">
                    {formattedDate}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Time
                  </p>

                  <p className="font-bold text-[#1e2a3a] dark:text-white mt-1">
                    {selectedTime}
                  </p>

                </div>

              </div>

            </div>

            {/* SYMPTOMS */}

            <div className="space-y-3">

              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">

                Symptoms

                <span className="text-slate-300 ml-2">
                  Optional
                </span>

              </label>

              <textarea
                value={symptoms}
                onChange={(e) =>
                  setSymptoms(
                    e.target.value
                  )
                }
                placeholder="Describe your symptoms or reason for visit..."
                rows={5}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 ring-blue-100 font-medium transition-all resize-none text-[#1e2a3a] dark:text-white"
              />

              <p className="text-xs text-slate-400">
                This information will be sent with your OPD booking.
              </p>

            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setStep("selection")
                }
                className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-2xl font-black text-sm transition-all hover:bg-slate-200"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleReview}
                className="flex-1 bg-[#1e2a3a] dark:bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Review Booking
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 3
        ================================================= */}

        {step === "confirmation" && (
          <div className="p-8 md:p-12 space-y-8">

            <div>

              <h3 className="text-2xl font-black text-[#1e2a3a] dark:text-white">
                Confirm OPD Appointment
              </h3>

              <p className="text-slate-500 text-sm font-medium mt-1">
                Verify your details before generating the OPD token.
              </p>

            </div>

            {/* DOCTOR */}

            <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800">

              <div className="w-14 h-14 rounded-2xl overflow-hidden">

                <img
                  src={
                    specialist?.image ||
                    "/default-doctor.png"
                  }
                  alt={doctorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror =
                      null;

                    e.currentTarget.src =
                      "/default-doctor.png";
                  }}
                />

              </div>

              <div>

                <h4 className="font-black text-[#1e2a3a] dark:text-white">
                  {doctorName}
                </h4>

                <p className="text-sm text-[#2f80ed] font-semibold">
                  {department}
                </p>

              </div>

            </div>

            {/* OPD FIELDS */}

            <div className="space-y-3">

              <div className="flex justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">

                <span className="text-sm text-slate-400">
                  Hospital
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {hospitalName}
                </span>

              </div>

              <div className="flex justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">

                <span className="text-sm text-slate-400">
                  Doctor
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {doctorName}
                </span>

              </div>

              <div className="flex justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">

                <span className="text-sm text-slate-400">
                  Department
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {department}
                </span>

              </div>

              <div className="flex justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">

                <span className="text-sm text-slate-400">
                  Appointment Date
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {formattedDate}
                </span>

              </div>

              <div className="flex justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">

                <span className="text-sm text-slate-400">
                  Estimated Time
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {selectedTime}
                </span>

              </div>

              {symptoms && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">

                  <p className="text-sm text-slate-400 mb-1">
                    Symptoms
                  </p>

                  <p className="font-medium text-[#1e2a3a] dark:text-white">
                    {symptoms}
                  </p>

                </div>
              )}

            </div>

            {/* EMAIL */}

            <div className="p-5 rounded-3xl border border-blue-100 bg-blue-50/70 dark:bg-blue-500/10 dark:border-blue-500/20">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-xl">
                  📧
                </div>

                <div>

                  <p className="font-black text-[#1e2a3a] dark:text-white">
                    Email Confirmation
                  </p>

                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Your OPD token and appointment details will be sent to your registered email address.
                  </p>

                </div>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setStep("details")
                }
                disabled={isSending}
                className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-2xl font-black text-sm transition-all hover:bg-slate-200 disabled:opacity-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSending}
                className="flex-1 bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending
                  ? "Generating OPD Token..."
                  : "Confirm & Generate Token"}
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 4 — BOOKING SAVED / TOKEN PAGE
        ================================================= */}

        {step === "success" && (
          <div className="p-8 md:p-12 text-center space-y-7 animate-in zoom-in duration-500">

            {/* SUCCESS ICON */}

            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">
              ✅
            </div>

            {/* TITLE */}

            <div className="space-y-2">

              <h3 className="text-3xl font-black text-[#1e2a3a] dark:text-white">
                Booking Confirmed!
              </h3>

              <p className="text-slate-500 font-medium">
                Your OPD appointment has been successfully booked.
              </p>

            </div>

            {/* TOKEN CARD */}

            <div className="p-7 rounded-[2rem] bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">

              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">
                Your OPD Token
              </p>

              <p className="text-6xl font-black text-[#2f80ed] mt-3">
                #{createdToken?.tokenNumber || "-"}
              </p>

              <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-800">

                <span className="text-sm text-slate-400">
                  Queue Position:
                </span>

                <span className="ml-2 font-black text-[#1e2a3a] dark:text-white">
                  {createdToken?.queuePosition || "-"}
                </span>

              </div>

            </div>

            {/* BOOKING DETAILS */}

            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 text-left space-y-4">

              <div className="flex justify-between gap-4">

                <span className="text-slate-400">
                  Doctor
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {doctorName}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-400">
                  Department
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {department}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-400">
                  Date
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {formattedDate}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-400">
                  Time
                </span>

                <span className="font-bold text-right text-[#1e2a3a] dark:text-white">
                  {selectedTime}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-slate-400">
                  Status
                </span>

                <span className="font-bold text-green-600">
                  Booked
                </span>

              </div>

            </div>

            {/* EMAIL */}

            <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">

              <div className="text-3xl mb-2">
                📧
              </div>

              <p className="font-black text-[#1e2a3a] dark:text-white">
                Confirmation Email Sent
              </p>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Your OPD token and appointment details have been sent to your registered email address.
              </p>

            </div>

            {/* DONE */}

            <button
              type="button"
              onClick={handleDone}
              className="w-full bg-[#2f80ed] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Done
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default BookingModal;
