import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import api from "../services/api";

// =====================================================
// THREE.JS 3D BACKGROUND
// =====================================================

const AuthBackground3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;


    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 5;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    container.appendChild(renderer.domElement);

    // =================================================
    // PARTICLES
    // =================================================

    const particleCount = 150;

    const particleGeometry =
      new THREE.BufferGeometry();

    const positions =
      new Float32Array(
        particleCount * 3
      );

    for (
      let i = 0;
      i < particleCount * 3;
      i++
    ) {
      positions[i] =
        (Math.random() - 0.5) * 18;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    const particleMaterial =
      new THREE.PointsMaterial({
        color: 0x60a5fa,
        size: 0.045,
        transparent: true,
        opacity: 0.8,
      });

    const particles =
      new THREE.Points(
        particleGeometry,
        particleMaterial
      );

    scene.add(particles);

    // =================================================
    // 3D SPHERE
    // =================================================

    const sphereGeometry =
      new THREE.IcosahedronGeometry(
        1.6,
        2
      );

    const sphereMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x2f80ed,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });

    const sphere =
      new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
      );

    sphere.position.set(
      3,
      1.5,
      -1
    );

    scene.add(sphere);

    // =================================================
    // RING
    // =================================================

    const ringGeometry =
      new THREE.TorusGeometry(
        1.2,
        0.04,
        16,
        100
      );

    const ringMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
      });

    const ring =
      new THREE.Mesh(
        ringGeometry,
        ringMaterial
      );

    ring.position.set(
      -3,
      -1.5,
      -1
    );

    scene.add(ring);

    // =================================================
    // ANIMATION
    // =================================================

    let animationId;

    const animate = () => {
      animationId =
        requestAnimationFrame(animate);

      particles.rotation.y += 0.0008;

      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.003;

      ring.rotation.x += 0.002;
      ring.rotation.z += 0.002;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // =================================================
    // RESPONSIVE
    // =================================================

    const handleResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      particleGeometry.dispose();
      particleMaterial.dispose();

      sphereGeometry.dispose();
      sphereMaterial.dispose();

      ringGeometry.dispose();
      ringMaterial.dispose();

      renderer.dispose();

      if (
        renderer.domElement &&
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };


  }, []);

  return (<div
    ref={containerRef}
    className="
     absolute
     inset-0
     overflow-hidden
     pointer-events-none
   "
  />
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const LoginForm = ({
  onClose,
  onLoginSuccess,
}) => {

  // LOGIN | REGISTER | OTP
  const [screen, setScreen] =
    useState("LOGIN");

  // ===================================================
  // LOGIN DATA
  // ===================================================

  const [loginData, setLoginData] =
    useState({
      email: "",
      password: "",
    });

  // ===================================================
  // REGISTER DATA
  // ===================================================

  const [
    registerData,
    setRegisterData,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
  });

  // ===================================================
  // OTP
  // ===================================================

  const [otp, setOtp] =
    useState("");

  const [
    pendingLogin,
    setPendingLogin,
  ] = useState(null);

  // ===================================================
  // UI STATES
  // ===================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [seconds, setSeconds] =
    useState(0);

  // ===================================================
  // RESEND TIMER
  // ===================================================

  useEffect(() => {


    if (seconds <= 0) return;

    const timer =
      setInterval(() => {

        setSeconds(
          (current) =>
            current - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);


  }, [seconds]);

  // ===================================================
  // INPUT STYLES
  // ===================================================

  const inputClass = `     w-full
    rounded-xl
    border
    border-slate-200
    bg-slate-50
    px-4
    py-3
    text-sm
    text-slate-800
    outline-none
    transition
    focus:border-[#2f80ed]
    focus:ring-2
    focus:ring-blue-100
  `;

  // ===================================================
  // LOGIN INPUT CHANGE
  // ===================================================

  const handleLoginChange = (
    e
  ) => {


    const {
      name,
      value,
    } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));


  };

  // ===================================================
  // REGISTER INPUT CHANGE
  // ===================================================

  const handleRegisterChange = (
    e
  ) => {


    const {
      name,
      value,
    } = e.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));


  };

  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = async (
    e
  ) => {


    e.preventDefault();

    setError("");
    setMessage("");

    try {

      setLoading(true);

      // ===============================================
      // STEP 1
      // EMAIL + PASSWORD LOGIN
      // ===============================================

      const loginResponse =
        await api.post(
          "/auth/login",
          {
            email:
              loginData.email
                .trim()
                .toLowerCase(),

            password:
              loginData.password,
          }
        );

      if (
        loginResponse.data.success ===
        false
      ) {

        throw new Error(
          loginResponse.data.message ||
          "Invalid email or password"
        );

      }


      const token =
        loginResponse.data.token ||
        loginResponse.data.data?.token;

      const user =
        loginResponse.data.user ||
        loginResponse.data.data?.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(
        new Event("authChanged")
      );

      setMessage("Login successful!");

      setTimeout(() => {
        onLoginSuccess?.(user);
        onClose?.();
      }, 300);


    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }


  };

  // ===================================================
  // REGISTER
  // ===================================================

  const handleRegister = async (
    e
  ) => {


    e.preventDefault();

    setError("");
    setMessage("");

    // ===============================================
    // VALIDATION
    // ===============================================

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password
    ) {

      setError(
        "Please fill all required fields."
      );

      return;

    }


    if (
      registerData.password !==
      registerData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    if (
      registerData.password.length < 6
    ) {

      setError(
        "Password must be at least 6 characters."
      );

      return;

    }


    try {

      setLoading(true);

      // Remove confirm password before sending

      const {
        confirmPassword,
        ...dataToSend
      } = registerData;


      // ===============================================
      // REGISTER API
      // ===============================================

      const response =
        await api.post(
          "/auth/register",
          dataToSend
        );


      if (
        response.data.success ===
        false
      ) {

        throw new Error(
          response.data.message ||
          "Registration failed"
        );

      }


      setMessage(
        "Registration successful! Please login."
      );


      // Clear register form

      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "",
        bloodGroup: "",
        dateOfBirth: "",
      });


      // Email login field me automatically

      setLoginData({
        email:
          dataToSend.email,
        password: "",
      });


      // Go to login page

      setTimeout(() => {

        setScreen("LOGIN");

        setMessage("");

      }, 1000);


    } catch (err) {

      console.error(
        "REGISTER ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }


  };

  // ===================================================
  // VERIFY OTP
  // ===================================================

  const handleVerifyOTP = async (
    e
  ) => {


    e.preventDefault();

    setError("");
    setMessage("");

    if (
      otp.length !== 6
    ) {

      setError(
        "Please enter a valid 6 digit OTP."
      );

      return;

    }


    try {

      setLoading(true);


      // ===============================================
      // VERIFY OTP API
      // ===============================================

      const response =
        await api.post(
          "/otp/verify",
          {
            email:
              loginData.email
                .trim()
                .toLowerCase(),

            otp,
          }
        );


      if (
        response.data.success ===
        false
      ) {

        throw new Error(
          response.data.message ||
          "OTP verification failed"
        );

      }


      // ===============================================
      // OTP VERIFIED
      // ===============================================

      const token =
        pendingLogin?.token ||
        pendingLogin?.data?.token;

      const user =
        pendingLogin?.user ||
        pendingLogin?.data?.user;


      // Save token

      if (token) {

        localStorage.setItem(
          "token",
          token
        );

      }


      // Save user

      if (user) {

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

      }


      // Update Navbar

      window.dispatchEvent(
        new Event("authChanged")
      );





      // Login Success

      setTimeout(() => {

        if (onLoginSuccess) {

          onLoginSuccess(user);

        }


        if (onClose) {

          onClose();

        }

      }, 500);


    } catch (err) {

      console.error(
        "OTP VERIFY ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }


  };

  // ===================================================
  // RESEND OTP
  // ===================================================




  // ===================================================
  // BACK TO LOGIN
  // ===================================================

  const backToLogin = () => {


    setScreen("LOGIN");

    setOtp("");

    setError("");

    setMessage("");

    setSeconds(0);

    setPendingLogin(null);


  };

  // ===================================================
  // LOGIN PAGE
  // ===================================================

  const renderLogin = () => (


    <form
      onSubmit={handleLogin}
      className="space-y-5"
    >

      <div>

        <label className="mb-2 block text-sm font-bold text-slate-600">

          Email Address

        </label>

        <input
          type="email"

          name="email"

          value={
            loginData.email
          }

          onChange={
            handleLoginChange
          }

          placeholder="Enter your email"

          required

          className={inputClass}
        />

      </div>


      <div>

        <label className="mb-2 block text-sm font-bold text-slate-600">

          Password

        </label>

        <input
          type="password"

          name="password"

          value={
            loginData.password
          }

          onChange={
            handleLoginChange
          }

          placeholder="Enter your password"

          required

          className={inputClass}
        />

      </div>


      <button
        type="submit"

        disabled={loading}

        className="
      w-full
      rounded-xl
      bg-[#2f80ed]
      py-3.5
      font-black
      text-white
      shadow-lg
      shadow-blue-200
      transition
      hover:bg-blue-600
      disabled:opacity-60
    "
      >

        {loading
          ? "Please wait..."
          : "Login "}

      </button>


      <div className="pt-3 text-center">

        <p className="text-sm text-slate-500">

          Don't have an account?

        </p>


        <button
          type="button"

          onClick={() => {

            setScreen("REGISTER");

            setError("");

            setMessage("");

          }}

          className="
        mt-2
        font-bold
        text-[#2f80ed]
        hover:underline
      "
        >

          Create Account

        </button>

      </div>

    </form>


  );

  // ===================================================
  // REGISTER PAGE
  // ===================================================

  const renderRegister = () => (


    <form
      onSubmit={handleRegister}
      className="space-y-4"
    >

      <div className="grid gap-4 sm:grid-cols-2">


        {/* FULL NAME */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Full Name *

          </label>

          <input
            type="text"

            name="name"

            value={
              registerData.name
            }

            onChange={
              handleRegisterChange
            }

            placeholder="Full name"

            required

            className={inputClass}
          />

        </div>


        {/* EMAIL */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Email *

          </label>

          <input
            type="email"

            name="email"

            value={
              registerData.email
            }

            onChange={
              handleRegisterChange
            }

            placeholder="Email address"

            required

            className={inputClass}
          />

        </div>


        {/* PHONE */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Phone Number

          </label>

          <input
            type="tel"

            name="phone"

            value={
              registerData.phone
            }

            onChange={
              handleRegisterChange
            }

            placeholder="9876543210"

            maxLength="10"

            className={inputClass}
          />

        </div>


        {/* GENDER */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Gender

          </label>

          <select
            name="gender"

            value={
              registerData.gender
            }

            onChange={
              handleRegisterChange
            }

            className={inputClass}
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

        </div>


        {/* DATE OF BIRTH */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Date of Birth

          </label>

          <input
            type="date"

            name="dateOfBirth"

            value={
              registerData.dateOfBirth
            }

            onChange={
              handleRegisterChange
            }

            className={inputClass}
          />

        </div>


        {/* BLOOD GROUP */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Blood Group

          </label>

          <select
            name="bloodGroup"

            value={
              registerData.bloodGroup
            }

            onChange={
              handleRegisterChange
            }

            className={inputClass}
          >

            <option value="">
              Select Blood Group
            </option>

            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>

          </select>

        </div>


        {/* PASSWORD */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Password *

          </label>

          <input
            type="password"

            name="password"

            value={
              registerData.password
            }

            onChange={
              handleRegisterChange
            }

            placeholder="Minimum 6 characters"

            required

            className={inputClass}
          />

        </div>


        {/* CONFIRM PASSWORD */}

        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">

            Confirm Password *

          </label>

          <input
            type="password"

            name="confirmPassword"

            value={
              registerData.confirmPassword
            }

            onChange={
              handleRegisterChange
            }

            placeholder="Confirm password"

            required

            className={inputClass}
          />

        </div>

      </div>


      <button
        type="submit"

        disabled={loading}

        className="
      w-full
      rounded-xl
      bg-[#2f80ed]
      py-3.5
      font-black
      text-white
      shadow-lg
      shadow-blue-200
      transition
      hover:bg-blue-600
      disabled:opacity-60
    "
      >

        {loading
          ? "Creating Account..."
          : "Create Account"}

      </button>


      <div className="pt-2 text-center">

        <p className="text-sm text-slate-500">

          Already have an account?

        </p>


        <button
          type="button"

          onClick={() => {

            setScreen("LOGIN");

            setError("");

            setMessage("");

          }}

          className="
        mt-2
        font-bold
        text-[#2f80ed]
        hover:underline
      "
        >

          Login Here

        </button>

      </div>

    </form>


  );

  // ===================================================
  // OTP PAGE
  // ===================================================

  const renderOTP = () => (


    <form
      onSubmit={handleVerifyOTP}
      className="space-y-6"
    >

      <div className="text-center">

        <div className="mb-4 text-5xl">

          🔐

        </div>




      </div>


      <div>



        <input
          type="text"

          inputMode="numeric"

          autoComplete="one-time-code"

          maxLength={6}

          value={otp}

          onChange={(e) => {

            const value =
              e.target.value.replace(
                /\D/g,
                ""
              );

            setOtp(value);

          }}

          placeholder="000000"

          className="
        w-full
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        px-4
        py-4
        text-center
        text-2xl
        font-black
        tracking-[10px]
        outline-none
        transition
        focus:border-[#2f80ed]
        focus:ring-2
        focus:ring-blue-100
      "
        />

      </div>


      <button
        type="submit"

        disabled={
          loading ||
          otp.length !== 6
        }

        className="
      w-full
      rounded-xl
      bg-[#2f80ed]
      py-3.5
      font-black
      text-white
      shadow-lg
      shadow-blue-200
      transition
      hover:bg-blue-600
      disabled:opacity-60
    "
      >

        {loading
          ? "Verifying..."
          : "Verify OTP"}

      </button>


      {/* RESEND */}

      <div className="text-center">

        <button
          type="button"

          onClick={
            handleResendOTP
          }

          disabled={
            seconds > 0 ||
            loading
          }

          className={`
        font-bold
        transition

        ${seconds > 0
              ? "cursor-not-allowed text-slate-400"
              : "text-[#2f80ed] hover:underline"
            }
      `}
        >

          {seconds > 0
            ? `Resend OTP in ${seconds}s`
            : "Resend OTP"}

        </button>

      </div>


      {/* BACK */}

      <button
        type="button"

        onClick={backToLogin}

        className="
      w-full
      text-sm
      font-bold
      text-slate-500
      hover:text-[#2f80ed]
    "
      >

        ← Change Login Details

      </button>

    </form>


  );

  // ===================================================
  // MAIN UI
  // ===================================================

  return (


    <div
      className="
    fixed
    inset-0
    z-[9999]
    overflow-hidden
    bg-[#071a33]
  "
    >

      {/* 3D BACKGROUND */}

      <AuthBackground3D />


      {/* DARK OVERLAY */}

      <div
        className="
      absolute
      inset-0
      bg-gradient-to-br
      from-[#071a33]/90
      via-[#0b2545]/70
      to-[#2f80ed]/20
    "
      />


      {/* CONTENT */}

      <div
        className="
      relative
      z-10
      flex
      min-h-screen
      items-center
      justify-center
      overflow-y-auto
      p-4
    "
      >

        <div
          className={`
        relative
        w-full
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-2xl
        transition-all

        ${screen === "REGISTER"
              ? "max-w-2xl"
              : "max-w-md"
            }
      `}
        >

          {/* CLOSE */}

          <button
            type="button"

            onClick={onClose}

            className="
          absolute
          right-5
          top-5
          z-20
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-white/20
          text-lg
          font-bold
          text-white
          backdrop-blur
          transition
          hover:bg-red-500
        "
          >

            ✕

          </button>


          {/* HEADER */}

          <div
            className="
          bg-gradient-to-r
          from-[#1e2a3a]
          via-[#24456d]
          to-[#2f80ed]
          px-8
          py-7
          text-center
          text-white
        "
          >

            <div className="mb-2 text-4xl">

              {screen === "LOGIN"
                ? "🏥"
                : screen === "REGISTER"
                  ? "🩺"
                  : "🔐"}

            </div>


            <h1 className="text-2xl font-black">

              {screen === "LOGIN"
                ? "Abhimanyu Login"
                : screen === "REGISTER"
                  ? "Create Account"
                  : "Verify OTP"}

            </h1>


            <p className="mt-2 text-sm text-blue-100">

              {screen === "LOGIN"
                ? "Login to your healthcare account"
                : screen === "REGISTER"
                  ? "Join Abhimanyu Healthcare"
                  : "Secure your account with OTP"}

            </p>

          </div>


          {/* FORM AREA */}

          <div
            className="
          max-h-[75vh]
          overflow-y-auto
          p-6
          sm:p-8
        "
          >

            {/* ERROR */}

            {error && (

              <div
                className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              p-3
              text-sm
              font-semibold
              text-red-600
            "
              >

                ⚠️ {error}

              </div>

            )}


            {/* SUCCESS */}

            {message && (

              <div
                className="
              mb-5
              rounded-xl
              border
              border-green-200
              bg-green-50
              p-3
              text-sm
              font-semibold
              text-green-600
            "
              >

                ✅ {message}

              </div>

            )}


            {/* RENDER SCREEN */}

            {screen === "LOGIN" &&
              renderLogin()}

            {screen === "REGISTER" &&
              renderRegister()}

            {screen === "OTP" &&
              renderOTP()}

          </div>

        </div>

      </div>

    </div>


  );

};

export default LoginForm;
