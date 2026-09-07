import React, { useEffect, useState } from 'react';
import api from '../services/api';

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

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');

  const [error, setError] = useState('');


  /*
  
  * LOAD PROFILE
    */
  useEffect(() => {


    const loadProfile = async () => {

      try {

        setLoading(true);
        setError('');

        const response = await api.get(
          '/auth/profile'
        );


        /*
         * API can return:
         *
         * response.data.user
         * OR
         * response.data
         */
        const userData =
          response.data?.user ||
          response.data?.profile ||
          response.data;


        const nextProfile =
          normalizeProfile(userData);


        setProfile(nextProfile);


        /*
         * Save locally
         */
        localStorage.setItem(
          'user',
          JSON.stringify(nextProfile)
        );


      } catch (requestError) {

        console.error(
          'Profile load error:',
          requestError
        );


        /*
         * Fallback localStorage
         */
        try {

          const savedUser =
            localStorage.getItem('user');


          if (savedUser) {

            const parsedUser =
              JSON.parse(savedUser);


            setProfile(
              normalizeProfile(parsedUser)
            );

          } else {

            setError(
              requestError.response?.data?.message ||
              'Unable to load profile.'
            );

          }

        } catch (storageError) {

          console.error(
            'LocalStorage profile error:',
            storageError
          );

          setError(
            'Unable to load profile.'
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadProfile();


  }, []);

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

    setSaving(true);

    setMessage('');

    setError('');


    try {

      /*
       * Send complete profile
       */
      const response = await api.put(
        '/auth/profile',
        profile
      );


      const savedProfile =
        response.data?.user ||
        response.data?.profile ||
        response.data ||
        profile;


      const normalizedProfile =
        normalizeProfile(savedProfile);


      setProfile(
        normalizedProfile
      );


      localStorage.setItem(
        'user',
        JSON.stringify(normalizedProfile)
      );


      /*
       * Update navbar login state if needed
       */
      window.dispatchEvent(
        new Event('authChanged')
      );


      setMessage(
        'Profile updated successfully!'
      );


      setEditing(false);


    } catch (requestError) {

      console.error(
        'Profile update error:',
        requestError
      );


      /*
       * IMPORTANT:
       * If backend update fails,
       * do NOT lose edited data.
       */


      const backendMessage =
        requestError.response?.data?.message;


      setError(
        backendMessage ||
        'Unable to update profile. Please check the backend API.'
      );

    } finally {

      setSaving(false);

    }


  };

  /*
  
  * LOGOUT
    */
  const logout = () => {


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


        </form>


      </div>


    </main>



  );

};

export default ProfileView;
