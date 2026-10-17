import React, { useEffect, useState } from 'react';

import api from '../services/api';

import { storage } from '../services/storageService';



const emptyProfile = {

  name: '',

  email: '',

  phone: '',

  gender: '',

  bloodGroup: '',

  dateOfBirth: '',

  height: '',

  weight: '',



  location: {

    address: '',

    city: '',

    state: '',

    country: 'India',

    pincode: '',

  },



  emergencyContact: {

    name: '',

    phone: '',

    relation: '',

  },

};



/*



* Safely normalize profile data

  */

const normalizeProfile = (user = {}) => {

  return {

    ...emptyProfile,



    ...user,



    location: {

      ...emptyProfile.location,

      ...(user.location || {}),

    },



    emergencyContact: {

      ...emptyProfile.emergencyContact,

      ...(user.emergencyContact || {}),

    },

  };

};





const ProfileView = ({ onBack }) => {




  const [profile, setProfile] = useState(

    emptyProfile

  );

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [reports, setReports] = useState([]);

  const [uploadingReport, setUploadingReport] = useState(false);

  const [reportMessage, setReportMessage] = useState('');



  const [editing, setEditing] = useState(false);



  const [loading, setLoading] = useState(true);



  const [saving, setSaving] = useState(false);



  const [message, setMessage] = useState('');



  const [error, setError] = useState('');
  /*
   * LOAD PROFILE
   * Backend is the source of truth.
   * localStorage is used only as a fallback.
   */
  useEffect(() => {
    const loadProfileAndAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const profileResponse = await api.get("/auth/profile");



        const userData =
          profileResponse.data?.user ||
          profileResponse.data?.profile ||
          profileResponse.data?.data ||
          profileResponse.data;

        if (!userData || typeof userData !== "object") {
          throw new Error("Profile data not found");
        }

        const nextProfile = normalizeProfile(userData);
        setProfile(nextProfile);

        localStorage.setItem(
          "user",
          JSON.stringify(nextProfile)
        );

        const patientId =
          userData?._id ||
          userData?.id ||
          nextProfile?._id ||
          nextProfile?.id;

        if (patientId) {
          try {
            setAppointmentsLoading(true);

            const appointmentResponse = await api.get(
              `/opd/patient/${patientId}`
            );


            const appointmentData =
              appointmentResponse.data?.tokens ||
              appointmentResponse.data?.appointments ||
              appointmentResponse.data?.data?.tokens ||
              appointmentResponse.data?.data?.appointments ||
              appointmentResponse.data?.data ||
              [];

            setAppointments(
              Array.isArray(appointmentData)
                ? appointmentData
                : []
            );
          } catch (appointmentError) {
            console.error(
              "APPOINTMENT LOAD ERROR:",
              appointmentError.response?.data ||
              appointmentError.message
            );

            setAppointments(
              Array.isArray(userData?.appointments)
                ? userData.appointments
                : []
            );
          } finally {
            setAppointmentsLoading(false);
          }
        } else {
          setAppointments(
            Array.isArray(userData?.appointments)
              ? userData.appointments
              : []
          );
          setAppointmentsLoading(false);
        }

      } catch (requestError) {
        console.error(
          "PROFILE LOAD ERROR:",
          requestError.response?.data ||
          requestError.message
        );

        try {
          const savedUser = localStorage.getItem("user");

          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            const fallbackProfile =
              normalizeProfile(parsedUser);

            setProfile(fallbackProfile);

            const patientId =
              parsedUser?._id ||
              parsedUser?.id ||
              fallbackProfile?._id ||
              fallbackProfile?.id;

            if (patientId) {
              try {
                const appointmentResponse = await api.get(
                  `/opd/patient/${patientId}`
                );

                const appointmentData =
                  appointmentResponse.data?.tokens ||
                  appointmentResponse.data?.appointments ||
                  appointmentResponse.data?.data?.tokens ||
                  appointmentResponse.data?.data?.appointments ||
                  appointmentResponse.data?.data ||
                  [];

                setAppointments(
                  Array.isArray(appointmentData)
                    ? appointmentData
                    : []
                );
              } catch (appointmentError) {
                console.error(
                  "FALLBACK APPOINTMENT LOAD ERROR:",
                  appointmentError.response?.data ||
                  appointmentError.message
                );
              }
            }
          } else {
            setError(
              requestError.response?.data?.message ||
              "Unable to load profile."
            );
          }
        } catch (storageError) {
          console.error(
            "LOCAL STORAGE PROFILE ERROR:",
            storageError
          );

          setError("Unable to load profile.");
        }

        setAppointmentsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndAppointments();
  }, []);

  const handleReportUpload = async (event) => {

    const file = event.target.files?.[0];



    if (!file) return;



    // Allowed files

    const allowedTypes = [

      'application/pdf',

      'image/jpeg',

      'image/png',

      'image/jpg'

    ];



    if (!allowedTypes.includes(file.type)) {

      setReportMessage('Please upload PDF, JPG or PNG file.');

      return;

    }



    // 10 MB limit

    if (file.size > 10 * 1024 * 1024) {

      setReportMessage('File size must be less than 10MB.');

      return;

    }



    try {

      setUploadingReport(true);

      setReportMessage('');



      const formData = new FormData();



      formData.append('report', file);



      const response = await api.post(

        '/reports/upload',

        formData,

        {

          headers: {

            'Content-Type': 'multipart/form-data'

          }

        }

      );






      setReports((prev) => [

        ...prev,

        response.data.report

      ]);



      setReportMessage('Report uploaded successfully.');



    } catch (error) {



      console.error(

        'REPORT UPLOAD ERROR:',

        error.response?.data || error.message

      );



      setReportMessage(

        error.response?.data?.message ||

        'Report upload failed.'

      );



    } finally {



      setUploadingReport(false);



      // Reset input

      event.target.value = '';

    }

  };

  /*



  * UPDATE NORMAL FIELD

    */

  const updateField = (event) => {



    const { name, value } =

      event.target;





    setProfile((current) => ({



      ...current,



      [name]: value,



    }));



  };



  /*



  * UPDATE LOCATION / EMERGENCY CONTACT

    */

  const updateNestedField =

    (section, event) => {



      const {

        name,

        value

      } = event.target;



      setProfile((current) => ({



        ...current,



        [section]: {



          ...(current[section] || {}),



          [name]: value,



        },



      }));



    };



  /*



  * EDIT PROFILE

    */

  const startEditing = () => {



    setEditing(true);



    setMessage('');



    setError('');



  };



  /*



  * CANCEL EDIT

    */

  const cancelEditing = () => {



    setEditing(false);



    setMessage('');



    setError('');



    /*

     * Restore saved user

     */

    try {



      const savedUser =

        localStorage.getItem('user');





      if (savedUser) {



        setProfile(

          normalizeProfile(

            JSON.parse(savedUser)

          )

        );



      }



    } catch (error) {



      console.error(

        'Cancel edit error:',

        error

      );



    }



  };



  /*



  * SAVE PROFILE

    */
  const saveProfile = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      /*
       * Send only editable fields.
       * MongoDB/system fields such as _id, createdAt and updatedAt
       * are intentionally not sent from the frontend.
       */
      const profilePayload = {
        name: profile.name?.trim() || "",
        email: profile.email?.trim() || "",
        phone: profile.phone?.trim() || "",
        gender: profile.gender || "",
        bloodGroup: profile.bloodGroup || "",
        dateOfBirth: profile.dateOfBirth || "",
        height: profile.height || "",
        weight: profile.weight || "",

        location: {
          address: profile.location?.address || "",
          city: profile.location?.city || "",
          state: profile.location?.state || "",
          country: profile.location?.country || "India",
          pincode: profile.location?.pincode || "",
        },

        emergencyContact: {
          name: profile.emergencyContact?.name || "",
          phone: profile.emergencyContact?.phone || "",
          relation: profile.emergencyContact?.relation || "",
        },
      };


      const response = await api.put(
        "/auth/profile",
        profilePayload
      );



      const savedProfile =
        response.data?.user ||
        response.data?.profile ||
        response.data?.data ||
        response.data;

      if (
        !savedProfile ||
        typeof savedProfile !== "object"
      ) {
        throw new Error(
          "Updated profile data was not returned by the server."
        );
      }

      const normalizedProfile =
        normalizeProfile(savedProfile);

      setProfile(normalizedProfile);

      localStorage.setItem(
        "user",
        JSON.stringify(normalizedProfile)
      );

      window.dispatchEvent(
        new Event("authChanged")
      );

      setMessage(
        response.data?.message ||
        "Profile updated successfully!"
      );

      setEditing(false);

    } catch (requestError) {
      console.error(
        "PROFILE UPDATE ERROR:",
        requestError.response?.data ||
        requestError.message
      );

      setError(
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };





  /*



  * LOGOUT

    */

  const logout = () => {



    storage.logout();



    localStorage.removeItem(

      'token'

    );



    localStorage.removeItem(

      'authToken'

    );



    localStorage.removeItem(

      'accessToken'

    );



    localStorage.removeItem(

      'jwtToken'

    );



    localStorage.removeItem(

      'user'

    );



    localStorage.removeItem(

      'currentUser'

    );





    /*

     * Update Navbar

     */

    window.dispatchEvent(

      new Event('authChanged')

    );





    /*

     * Go back Home

     */

    if (onBack) {



      onBack();



    } else {



      window.location.href = '/';



    }



  };



  /*



  * LOADING

    */

  if (loading) {



    return (



      <div className="min-h-screen flex items-center justify-center bg-slate-50">



        <div className="text-center">



          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#2f80ed]" />



          <p className="font-bold text-slate-500">



            Loading profile...



          </p>



        </div>



      </div>



    );



  }



  return (



    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">



      <div className="mx-auto max-w-4xl space-y-6">





        {/* TOP BUTTONS */}



        <div className="flex flex-wrap items-center justify-between gap-4">





          <button

            type="button"



            onClick={onBack}



            className="rounded-xl bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"

          >



            ← Back



          </button>





          <button

            type="button"



            onClick={logout}



            className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-700"

          >



            Logout



          </button>





        </div>





        {/* PROFILE FORM */}



        <form

          onSubmit={saveProfile}



          className="space-y-8 rounded-3xl bg-white p-6 shadow-sm sm:p-10"

        >





          {/* HEADER */}



          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">





            <div>



              <h1 className="text-3xl font-black text-slate-800">



                Personal Health Profile



              </h1>





              <p className="mt-2 text-slate-500">



                Manage your account and health details.



              </p>





              {editing && (



                <p className="mt-2 font-bold text-[#2f80ed]">



                  ✏️ Edit mode is active



                </p>



              )}



            </div>





            {!editing && (



              <button

                type="button"



                onClick={startEditing}



                className="rounded-xl bg-[#2f80ed] px-6 py-3 font-black text-white transition hover:scale-105 active:scale-95"

              >



                ✏️ Edit Profile



              </button>



            )}





          </div>





          {/* SUCCESS / ERROR */}



          {error && (



            <div className="rounded-xl bg-red-50 p-4 font-bold text-red-600">



              ❌ {error}



            </div>



          )}





          {message && (



            <div className="rounded-xl bg-green-50 p-4 font-bold text-green-600">



              ✅ {message}



            </div>



          )}





          {/* ================= PERSONAL DETAILS ================= */}



          <section>



            <h2 className="mb-5 text-xl font-black text-slate-800">



              Personal Details



            </h2>





            <div className="grid gap-5 sm:grid-cols-2">





              {/* NAME */}



              <label className="space-y-2 font-bold text-slate-600">



                Full Name



                <input

                  type="text"



                  name="name"



                  value={profile.name || ''}



                  onChange={updateField}



                  disabled={!editing}



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                />



              </label>





              {/* EMAIL */}



              <label className="space-y-2 font-bold text-slate-600">



                Email



                <input

                  type="email"



                  name="email"



                  value={profile.email || ''}



                  onChange={updateField}



                  disabled={!editing}



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                />



              </label>





              {/* PHONE */}



              <label className="space-y-2 font-bold text-slate-600">



                Phone



                <input

                  type="tel"



                  name="phone"



                  value={profile.phone || ''}



                  onChange={updateField}



                  disabled={!editing}



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                />



              </label>





              {/* GENDER */}



              <label className="space-y-2 font-bold text-slate-600">



                Gender



                <select

                  name="gender"



                  value={profile.gender || ''}



                  onChange={updateField}



                  disabled={!editing}



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 disabled:cursor-not-allowed disabled:bg-slate-50"

                >



                  <option value="">



                    Select Gender



                  </option>



                  <option value="Male">



                    Male



                  </option>



                  <option value="Female">



                    Female



                  </option>



                  <option value="Other">



                    Other



                  </option>



                </select>



              </label>





              {/* BLOOD GROUP */}



              <label className="space-y-2 font-bold text-slate-600">



                Blood Group



                <select

                  name="bloodGroup"



                  value={profile.bloodGroup || ''}



                  onChange={updateField}



                  disabled={!editing}



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 disabled:cursor-not-allowed disabled:bg-slate-50"

                >



                  <option value="">



                    Select Blood Group



                  </option>



                  <option value="A+">



                    A+



                  </option>



                  <option value="A-">



                    A-



                  </option>



                  <option value="B+">



                    B+



                  </option>



                  <option value="B-">



                    B-



                  </option>



                  <option value="AB+">



                    AB+



                  </option>



                  <option value="AB-">



                    AB-



                  </option>



                  <option value="O+">



                    O+



                  </option>



                  <option value="O-">



                    O-



                  </option>



                </select>



              </label>





              {/* DATE OF BIRTH */}



              <label className="space-y-2 font-bold text-slate-600">



                Date of Birth



                <input

                  type="date"



                  name="dateOfBirth"



                  value={

                    profile.dateOfBirth

                      ? String(profile.dateOfBirth).slice(0, 10)

                      : ''

                  }



                  onChange={updateField}



                  disabled={!editing}



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                />



              </label>





              {/* HEIGHT */}



              <label className="space-y-2 font-bold text-slate-600">



                Height (cm)



                <input

                  type="number"



                  name="height"



                  value={profile.height || ''}



                  onChange={updateField}



                  disabled={!editing}



                  placeholder="Example: 175"



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                />



              </label>





              {/* WEIGHT */}



              <label className="space-y-2 font-bold text-slate-600">



                Weight (kg)



                <input

                  type="number"



                  name="weight"



                  value={profile.weight || ''}



                  onChange={updateField}



                  disabled={!editing}



                  placeholder="Example: 70"



                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                />



              </label>





            </div>



          </section>





          {/* ================= LOCATION ================= */}



          <section>



            <h2 className="mb-5 text-xl font-black text-slate-800">



              Location Details



            </h2>





            <div className="grid gap-5 sm:grid-cols-2">





              {[

                ['address', 'Address'],

                ['city', 'City'],

                ['state', 'State'],

                ['pincode', 'Pincode'],

              ].map(([name, label]) => (



                <label

                  key={name}



                  className="space-y-2 font-bold text-slate-600"

                >



                  {label}





                  <input

                    type="text"



                    name={name}



                    value={

                      profile.location?.[name] || ''

                    }



                    onChange={(event) =>

                      updateNestedField(

                        'location',

                        event

                      )

                    }



                    disabled={!editing}



                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"

                  />



                </label>



              ))}





            </div>



          </section>





          {/* ================= EMERGENCY CONTACT ================= */}







          {/* ================= ACTION BUTTONS ================= */}



          {editing && (



            <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-6">





              <button

                type="submit"



                disabled={saving}



                className="rounded-xl bg-[#2f80ed] px-6 py-3 font-black text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"

              >



                {saving

                  ? 'Saving...'

                  : '💾 Save Profile'

                }



              </button>





              <button

                type="button"



                onClick={cancelEditing}



                disabled={saving}



                className="rounded-xl bg-slate-100 px-6 py-3 font-black text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"

              >



                Cancel



              </button>





            </div>



          )}

          {/* ================= APPOINTMENTS ================= */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  My Appointments
                </h2>
                <p className="text-sm text-slate-500">
                  Your booked appointments and OPD tokens.
                </p>
              </div>

              {!appointmentsLoading && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-[#2f80ed]">
                  {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {appointmentsLoading ? (
              <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center font-bold text-slate-500">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="font-black text-slate-700">
                  No appointments found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Your booked OPD appointments will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {appointments.map((appointment, index) => {
                  const tokenNumber =
                    appointment.tokenNumber ||
                    appointment.token ||
                    appointment.tokenNo ||
                    "-";

                  const doctorName =
                    appointment.doctorName ||
                    appointment.doctor?.name ||
                    appointment.doctorId?.name ||
                    "Doctor";

                  const hospitalName =
                    appointment.hospitalName ||
                    appointment.hospital?.name ||
                    "Hospital";

                  const department =
                    appointment.department ||
                    appointment.specialization ||
                    "General";

                  const appointmentDate =
                    appointment.appointmentDate ||
                    appointment.date;

                  const estimatedTime =
                    appointment.estimatedTime ||
                    appointment.time ||
                    "-";

                  const status =
                    appointment.status ||
                    "booked";

                  const queuePosition =
                    appointment.queuePosition ??
                    appointment.position;

                  return (
                    <div
                      key={
                        appointment._id ||
                        appointment.tokenId ||
                        index
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            OPD Token
                          </p>
                          <p className="mt-1 text-3xl font-black text-[#2f80ed]">
                            #{tokenNumber}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-sm font-black ${String(status).toLowerCase() === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : String(status).toLowerCase() === "completed"
                              ? "bg-green-50 text-green-600"
                              : "bg-blue-50 text-[#2f80ed]"
                            }`}
                        >
                          {String(status).toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            Doctor
                          </p>
                          <p className="font-black text-slate-800">
                            {doctorName}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            Department
                          </p>
                          <p className="font-black text-slate-800">
                            {department}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            Hospital
                          </p>
                          <p className="font-black text-slate-800">
                            {hospitalName}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            Appointment Date
                          </p>
                          <p className="font-black text-slate-800">
                            {appointmentDate
                              ? new Date(appointmentDate).toLocaleDateString("en-IN")
                              : "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400">
                            Estimated Time
                          </p>
                          <p className="font-black text-slate-800">
                            {estimatedTime}
                          </p>
                        </div>

                        {queuePosition !== undefined &&
                          queuePosition !== null && (
                            <div>
                              <p className="text-xs font-bold text-slate-400">
                                Queue Position
                              </p>
                              <p className="font-black text-slate-800">
                                {queuePosition}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-6">



            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">



              <div>

                <h2 className="text-xl font-black text-slate-800">

                  Medical Reports

                </h2>



                <p className="text-sm text-slate-500">

                  Upload your medical reports, prescriptions or test results.

                </p>

              </div>



              <label className="cursor-pointer rounded-xl bg-[#2f80ed] px-5 py-3 font-black text-sm text-white hover:bg-blue-600 transition-all">



                {uploadingReport

                  ? 'Uploading...'

                  : '📄 Upload Report'}



                <input

                  type="file"

                  hidden

                  accept=".pdf,.jpg,.jpeg,.png"

                  onChange={handleReportUpload}

                  disabled={uploadingReport}

                />



              </label>



            </div>





            {reportMessage && (



              <p className="mt-3 text-sm font-bold text-slate-600">

                {reportMessage}

              </p>



            )}





            {reports.length > 0 && (



              <div className="mt-5 space-y-3">



                {reports.map((report, index) => (



                  <div

                    key={report._id || index}

                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"

                  >



                    <div className="flex items-center gap-3">



                      <span className="text-2xl">

                        📄

                      </span>



                      <div>



                        <p className="font-bold text-slate-800">

                          {report.originalName ||

                            report.name ||

                            'Medical Report'}

                        </p>



                        <p className="text-xs text-slate-500">

                          Uploaded medical document

                        </p>



                      </div>



                    </div>





                    {report.url && (



                      <a

                        href={report.url}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#2f80ed] shadow-sm"

                      >

                        View

                      </a>



                    )}



                  </div>



                ))}



              </div>



            )}



          </div>





        </form>





      </div>





    </main>



  );



};



export default ProfileView;