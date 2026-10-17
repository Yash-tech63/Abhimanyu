import React, { useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";

import api from "../services/api";
import DoctorProfilePicture from "./DoctorProfilePicture";

/*

Doctor.jsx

\\----------------------------------------------------

Features:

\\- Doctor Login

\\- Doctor Registration

\\- Doctor Profile

\\- All Doctors API/list

\\- Search + specialization filter

\\- Logout

\\- No react-router-dom / no useNavigate

\\- Works with the current state-based App.jsx

Expected backend routes:

    POST  /api/doctors/signup

    POST  /api/doctors/login

    GET   /api/doctors/profile

    GET   /api/doctors

    PATCH /api/doctors/profile   (optional)

If your backend uses different profile/update routes,

change only API below.

*/

const API = {

    signup: "/doctors/signup",

    login: "/doctors/login",

    profile: "/doctors/get-profile",

    allDoctors: "/doctors/get-doctors",
    opdToday: "/opd/today",
    opdDelete: (tokenId) => `/opd/delete/${tokenId}`,
    opdUpdate: (tokenId) => `/opd/update/${tokenId}`,

    updateProfile: "/doctors/update-profile",

};

const getToken = () =>

    localStorage.getItem("doctorToken") ||

    localStorage.getItem("doctor_token") ||

    localStorage.getItem("token");

const getStoredDoctor = () => {

    try {

        return JSON.parse(localStorage.getItem("doctor") || "null");

    } catch {

        return null;

    }

};

const extractData = (response) => response?.data?.data ?? response?.data ?? {};

const extractToken = (response) => {

    const data = extractData(response);

    return (

        response?.data?.token ||

        response?.data?.accessToken ||

        data?.token ||

        data?.accessToken ||

        data?.doctorToken ||

        ""

    );

};

const extractDoctor = (response) => {

    const data = extractData(response);

    return (

        response?.data?.doctor ||

        data?.doctor ||

        response?.data?.user ||

        data?.user ||

        data

    );

};

const extractDoctors = (response) => {

    const data = extractData(response);

    if (Array.isArray(response?.data)) return response.data;

    if (Array.isArray(data)) return data;

    return (

        response?.data?.doctors ||

        data?.doctors ||

        response?.data?.results ||

        data?.results ||

        []

    );

};

const getErrorMessage = (error, fallback) =>

    error?.response?.data?.message ||

    error?.response?.data?.error ||

    error?.response?.data?.errors?.[0]?.message ||

    error?.message ||

    fallback;

const DoctorBackground = () => {

    const ref = useRef(null);

    useEffect(() => {

        const container = ref.current;

        if (!container) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(

            55,

            window.innerWidth / window.innerHeight,

            0.1,

            100

        );

        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({

            alpha: true,

            antialias: true,

        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setClearColor(0x000000, 0);

        container.appendChild(renderer.domElement);

        const group = new THREE.Group();

        scene.add(group);

        const particleCount = 700;

        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {

            positions[i * 3] = (Math.random() - 0.5) * 22;

            positions[i * 3 + 1] = (Math.random() - 0.5) * 14;

            positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

        }

        const particleGeometry = new THREE.BufferGeometry();

        particleGeometry.setAttribute(

            "position",

            new THREE.BufferAttribute(positions, 3)

        );

        const particleMaterial = new THREE.PointsMaterial({

            color: 0x60a5fa,

            size: 0.035,

            transparent: true,

            opacity: 0.65,

        });

        const particles = new THREE.Points(

            particleGeometry,

            particleMaterial

        );

        group.add(particles);

        const sphere = new THREE.Mesh(

            new THREE.IcosahedronGeometry(2.7, 2),

            new THREE.MeshBasicMaterial({

                color: 0x2563eb,

                wireframe: true,

                transparent: true,

                opacity: 0.08,

            })

        );

        group.add(sphere);

        const ring = new THREE.Mesh(

            new THREE.TorusGeometry(3.2, 0.012, 16, 160),

            new THREE.MeshBasicMaterial({

                color: 0x38bdf8,

                transparent: true,

                opacity: 0.18,

            })

        );

        ring.rotation.x = Math.PI / 2.4;

        group.add(ring);

        const clock = new THREE.Clock();

        let frame;

        const animate = () => {

            frame = requestAnimationFrame(animate);

            const t = clock.getElapsedTime();

            particles.rotation.y += 0.00035;

            particles.rotation.x = Math.sin(t * 0.15) * 0.08;

            sphere.rotation.x += 0.0007;

            sphere.rotation.y += 0.0012;

            ring.rotation.z += 0.001;

            ring.position.y = Math.sin(t * 0.4) * 0.3;

            renderer.render(scene, camera);

        };

        animate();

        const onResize = () => {

            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        };

        window.addEventListener("resize", onResize);

        return () => {

            cancelAnimationFrame(frame);

            window.removeEventListener("resize", onResize);

            particleGeometry.dispose();

            particleMaterial.dispose();

            sphere.geometry.dispose();

            sphere.material.dispose();

            ring.geometry.dispose();

            ring.material.dispose();

            renderer.dispose();

            if (renderer.domElement && container.contains(renderer.domElement)) {

                container.removeChild(renderer.domElement);

            }

        };

    }, []);

    return (

        <div

            ref={ref}

            className="pointer-events-none fixed inset-0 overflow-hidden bg-[#061426]"

        />

    );

};

const Icon = ({ children }) => (

    <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm">

        {children}

    </span>

);

const Doctor = ({ onClose, onLoginSuccess }) => {

    const [screen, setScreen] = useState(() => {
        const token = getToken();
        const storedDoctor = getStoredDoctor();
        return token && storedDoctor ? "DASHBOARD" : "LOGIN";
    });

    const [dashboardTab, setDashboardTab] = useState("PROFILE");

    const [loginData, setLoginData] = useState({

        email: "",

        password: "",

    });

    const [registerData, setRegisterData] = useState({

        name: "",

        email: "",

        phone: "",

        number: "",

        password: "",

        confirmPassword: "",

        specialization: "",

        qualification: "",

        experienceYears: "",

        consultationFee: "",

        councilName: "",

        medicalCouncilRegistration: "",

        hospital: "",

        city: "",

        about: "",

    });

    const [doctor, setDoctor] = useState(getStoredDoctor());

    const [doctors, setDoctors] = useState([]);

    const [profileForm, setProfileForm] = useState({

        name: "",

        phone: "",

        specialization: "",

        qualification: "",

        experienceYears: "",

        consultationFee: "",

        hospital: "",

        city: "",

        about: "",

    });

    const [search, setSearch] = useState("");

    const [specializationFilter, setSpecializationFilter] = useState("ALL");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [profileLoading, setProfileLoading] = useState(false);

    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [opdTokens, setOpdTokens] = useState([]);
    const [opdLoading, setOpdLoading] = useState(false);
    const [opdActionLoading, setOpdActionLoading] = useState("");

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const inputClass =

        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

    const clearAlerts = () => {

        setError("");

        setMessage("");

    };
    const saveDoctorSession = (token, doctorData) => {

        if (token) {

            localStorage.setItem("doctorToken", token);

            localStorage.setItem("doctor_token", token);

        }

        if (doctorData) {

            localStorage.setItem("doctor", JSON.stringify(doctorData));

        }

        localStorage.setItem("role", "doctor");

        window.dispatchEvent(new Event("authChanged"));

    };

    const clearDoctorSession = () => {

        localStorage.removeItem("doctorToken");

        localStorage.removeItem("doctor_token");

        localStorage.removeItem("doctor");

        localStorage.removeItem("role");

        window.dispatchEvent(new Event("authChanged"));

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        clearAlerts();

        if (!loginData.email.trim() || !loginData.password) {

            setError("Email and password are required.");

            return;

        }

        try {

            setLoading(true);

            const response = await api.post(API.login, {

                email: loginData.email.trim().toLowerCase(),

                password: loginData.password,

            });

            if (response?.data?.success === false) {

                throw new Error(response.data.message || "Doctor login failed.");

            }

            const token = extractToken(response);

            const doctorData = extractDoctor(response);

            if (!token) {

                throw new Error(

                    "Login succeeded but doctor token was not returned by the server."

                );

            }

            saveDoctorSession(token, doctorData);

            setDoctor(doctorData);

            setProfileFormFromDoctor(doctorData);

            setMessage("Doctor login successful.");

            setScreen("DASHBOARD");

            onLoginSuccess?.(doctorData);

        } catch (err) {

            console.error("DOCTOR LOGIN ERROR:", err);

            setError(getErrorMessage(err, "Doctor login failed."));

        } finally {

            setLoading(false);

        }

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        clearAlerts();

        const d = registerData;

        if (!d.name?.trim() || !d.email?.trim() || !d.password) {

            setError("Name, email and password are required.");

            return;

        }

        if (d.password !== d.confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        if (d.password.length < 6) {

            setError("Password must contain at least 6 characters.");

            return;

        }

        if (d.phone && !/^[0-9+\-\s]{7,15}$/.test(d.phone)) {

            setError("Please enter a valid phone number.");

            return;

        }

        try {

            setLoading(true);

            const payload = {

                name: d.name.trim(),

                email: d.email.trim().toLowerCase(),

                phone: d.phone?.trim() || "",

                number: d.number?.trim() || `DOC-${Date.now()}`,

                password: d.password,

                specialization: d.specialization?.trim() || "",

                qualification: d.qualification?.trim() || "",

                experienceYears: d.experienceYears !== "" ? Number(d.experienceYears) : 0,

                consultationFee: d.consultationFee !== "" ? Number(d.consultationFee) : 0,

                medicalCouncilRegistration: {

                    councilName: d.councilName?.trim() || "Medical Council of India",

                    registrationNumber: d.medicalCouncilRegistration?.trim() || "",

                },

                hospital: d.hospital?.trim() || "",

                city: d.city?.trim() || "",

                about: d.about?.trim() || "",

            };






            const response = await api.post(API.signup, payload);


            if (response?.data?.success === false) {

                throw new Error(response.data.message || "Doctor registration failed.");

            }

            const token = extractToken(response);

            const doctorData = extractDoctor(response);



            if (token) {

                saveDoctorSession(token, doctorData);

                setDoctor(doctorData);

                setProfileFormFromDoctor(doctorData);

                setScreen("DASHBOARD");

                setMessage("Doctor account created successfully.");

                onLoginSuccess?.(doctorData);

            } else {

                setLoginData({ email: d.email.trim().toLowerCase(), password: "" });

                setRegisterData({

                    name: "", email: "", phone: "", number: "", password: "", confirmPassword: "",

                    specialization: "", qualification: "", experienceYears: "", consultationFee: "",

                    councilName: "", medicalCouncilRegistration: "", hospital: "", city: "", about: "",

                });

                setScreen("LOGIN");

                setMessage("Registration successful. Please login.");

            }

        } catch (err) {

            console.error("=================================");

            console.error("DOCTOR REGISTER ERROR:", err);

            console.error("STATUS:", err?.response?.status);

            console.error("SERVER RESPONSE:", err?.response?.data);

            console.error("SERVER ERROR MESSAGE:", err?.response?.data?.error);

            console.error("SERVER MESSAGE:", err?.response?.data?.message);

            console.error("SERVER VALIDATION ERRORS:", err?.response?.data?.errors);

            console.error("=================================");

            setError(

                err?.response?.data?.error ||

                err?.response?.data?.message ||

                err?.response?.data?.errors?.[0]?.message ||

                err?.message ||

                "Doctor registration failed."

            );

        } finally {

            setLoading(false);

        }

    };

    const setProfileFormFromDoctor = (d) => {

        if (!d) return;

        setProfileForm({

            name: d.name || "",

            phone: d.phone || "",

            specialization: d.specialization || "",

            qualification: d.qualification || "",

            experienceYears: d.experienceYears ?? "",

            consultationFee: d.consultationFee ?? "",

            hospital: d.hospital || "",

            city: d.city || "",

            about: d.about || "",

        });

    };

    const loadProfile = async () => {

        const token = getToken();

        if (!token) {

            setDoctor(null);

            return;

        }

        try {

            setProfileLoading(true);

            clearAlerts();

            const response = await api.get(API.profile, {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            });

            if (response?.data?.success === false) {

                throw new Error(response.data.message || "Unable to load profile.");

            }

            const doctorData = extractDoctor(response);

            setDoctor(doctorData);

            setProfileFormFromDoctor(doctorData);

            localStorage.setItem("doctor", JSON.stringify(doctorData));

        } catch (err) {

            console.error("DOCTOR PROFILE ERROR:", err);

            if (err?.response?.status === 401) {

                clearDoctorSession();

                setDoctor(null);

                setScreen("LOGIN");

            }

            setError(getErrorMessage(err, "Unable to load doctor profile."));

        } finally {

            setProfileLoading(false);

        }

    };

    const loadAllDoctors = async () => {

        try {

            setDoctorsLoading(true);

            const response = await api.get(API.allDoctors);

            const list = extractDoctors(response);

            setDoctors(Array.isArray(list) ? list : []);

        } catch (err) {

            console.error("ALL DOCTORS ERROR:", err);

            setError(getErrorMessage(err, "Unable to load doctors."));

        } finally {

            setDoctorsLoading(false);

        }

    };
    const getDoctorId = (doctorData) => {
        return (
            doctorData?._id ||
            doctorData?.id ||
            doctorData?.doctorId ||
            doctorData?.doctor?._id ||
            doctorData?.doctor?.id ||
            ""
        );
    };

    const loadOPDTokens = async () => {
        try {
            const doctorId =
                doctor?._id ||
                doctor?.id ||
                doctor?.doctorId ||
                doctor?.doctor?._id ||
                doctor?.doctor?.id;



            if (!doctorId) {
                setOpdTokens([]);
                return;
            }

            setOpdLoading(true);

            const response = await api.get(`/opd/doctor/${doctorId}`);


            const tokens = response?.data?.tokens || [];


            setOpdTokens(tokens);

        } catch (error) {
            console.error(
                "❌ DOCTOR OPD ERROR:",
                error.response?.data || error.message
            );

            setOpdTokens([]);
        } finally {
            setOpdLoading(false);
        }
    };

    const updateOPDStatus = async (token, status) => {
        const tokenId = token?._id || token?.id;
        if (!tokenId) return;
        try {
            setOpdActionLoading(tokenId);
            await api.put(API.opdUpdate(tokenId), { status });
            await loadOPDTokens();
        } catch (err) {
            console.error("OPD STATUS ERROR:", err);
            setError(getErrorMessage(err, "Unable to update token status."));
        } finally {
            setOpdActionLoading("");
        }
    };

    const deleteOPDToken = async (token) => {
        const tokenId = token?._id || token?.id;
        if (!tokenId) return;
        if (!window.confirm(`Cancel token #${token?.tokenNumber ?? ""}?`)) return;
        try {
            setOpdActionLoading(tokenId);
            await api.delete(API.opdDelete(tokenId));
            await loadOPDTokens();
        } catch (err) {
            console.error("OPD DELETE ERROR:", err);
            setError(getErrorMessage(err, "Unable to cancel OPD token."));
        } finally {
            setOpdActionLoading("");
        }
    };

    const renderOPDTokens = () => (
        <div>
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">OPD Tokens</h2>
                    <p className="mt-1 text-sm text-slate-500">Today's patient queue</p>
                </div>
                <button type="button" onClick={loadOPDTokens} disabled={opdLoading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50">
                    {opdLoading ? "Loading..." : "Refresh"}
                </button>
            </div>
            {opdLoading && opdTokens.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500">Loading OPD tokens...</div>
            ) : opdTokens.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No OPD tokens for today.</div>
            ) : (
                <div className="space-y-3">
                    {opdTokens.map((token) => {
                        const patient = token?.patientId && typeof token.patientId === "object" ? token.patientId : null;
                        const busy = opdActionLoading === token?._id;
                        const status = token?.status || "booked";
                        return (
                            <div key={token._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="grid flex-1 grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                                        <div><p className="text-xs font-bold text-slate-400">TOKEN</p><p className="text-xl font-black text-blue-600">#{token.tokenNumber}</p></div>
                                        <div><p className="text-xs font-bold text-slate-400">PATIENT</p><p className="font-bold text-slate-800">{patient?.name || "Patient"}</p><p className="text-xs text-slate-500">{patient?.phone || patient?.email || ""}</p></div>
                                        <div><p className="text-xs font-bold text-slate-400">TIME</p><p className="font-bold text-slate-800">{token.estimatedTime || "-"}</p><p className="text-xs text-slate-500">Queue #{token.queuePosition || "-"}</p></div>
                                        <div><p className="text-xs font-bold text-slate-400">STATUS</p><p className="font-bold capitalize text-slate-800">{status.replace(/-/g, " ")}</p><p className="text-xs text-slate-500">{token.department || "OPD"}</p></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {status !== "completed" && status !== "cancelled" && <button type="button" disabled={busy} onClick={() => updateOPDStatus(token, "completed")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50">Complete</button>}
                                        {status !== "cancelled" && <button type="button" disabled={busy} onClick={() => deleteOPDToken(token)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50">Cancel Token</button>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );


    const updateProfile = async (e) => {

        e.preventDefault();

        clearAlerts();

        const token = getToken();

        if (!token) {

            setError("Doctor session expired. Please login again.");

            setScreen("LOGIN");

            return;

        }

        try {

            setProfileLoading(true);

            const payload = Object.fromEntries(

                Object.entries(profileForm).filter(

                    ([, value]) => value !== "" && value !== null && value !== undefined

                )

            );

            const response = await api.patch(API.updateProfile, payload, {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            });

            if (response?.data?.success === false) {

                throw new Error(

                    response.data.message || "Profile update failed."

                );

            }

            const updatedDoctor = extractDoctor(response);

            if (updatedDoctor && typeof updatedDoctor === "object") {

                setDoctor(updatedDoctor);

                localStorage.setItem("doctor", JSON.stringify(updatedDoctor));

                setProfileFormFromDoctor(updatedDoctor);

            }

            setMessage("Profile updated successfully.");

        } catch (err) {

            console.error("DOCTOR PROFILE UPDATE ERROR:", err);

            setError(

                getErrorMessage(

                    err,

                    "Profile update failed. If your backend does not have PATCH /doctors/profile, remove this feature or add that route."

                )

            );

        } finally {

            setProfileLoading(false);

        }

    };

    const logout = () => {

        clearDoctorSession();

        setDoctor(null);

        setDoctors([]);

        setProfileForm({

            name: "",

            phone: "",

            specialization: "",

            qualification: "",

            experienceYears: "",

            consultationFee: "",

            hospital: "",

            city: "",

            about: "",

        });

        setLoginData({ email: "", password: "" });

        clearAlerts();

        setScreen("LOGIN");

        setDashboardTab("PROFILE");

    };

    useEffect(() => {
        const token = getToken();
        const storedDoctor = getStoredDoctor();

        if (!token || !storedDoctor) {
            return;
        }

        setDoctor(storedDoctor);
        setProfileFormFromDoctor(storedDoctor);

        // Refresh doctor data from backend, but keep dashboard open.
        loadProfile();
    }, []);

    useEffect(() => {
        if (
            screen === "DASHBOARD" &&
            doctor
        ) {
            loadOPDTokens();
        }
    }, [
        screen,
        doctor?._id,
        doctor?.id,
        doctor?.doctorId,
    ]);

    useEffect(() => {
        if (dashboardTab === "DOCTORS" && doctors.length === 0) loadAllDoctors();
        if (dashboardTab === "OPD") loadOPDTokens();
    }, [dashboardTab, doctor?._id, doctor?.id]);

    const specializations = useMemo(() => {

        const values = doctors

            .map((d) => d?.specialization)

            .filter(Boolean)

            .map((x) => String(x).trim());

        return ["ALL", ...Array.from(new Set(values))];

    }, [doctors]);

    const filteredDoctors = useMemo(() => {

        const q = search.trim().toLowerCase();

        return doctors.filter((d) => {

            const text = [

                d?.name,

                d?.specialization,

                d?.qualification,

                d?.hospital,

                d?.city,

            ]

                .filter(Boolean)

                .join(" ")

                .toLowerCase();

            const matchesSearch = !q || text.includes(q);

            const matchesSpecialization =

                specializationFilter === "ALL" ||

                String(d?.specialization || "").toLowerCase() ===

                specializationFilter.toLowerCase();

            return matchesSearch && matchesSpecialization;

        });

    }, [doctors, search, specializationFilter]);

    const doctorId = doctor?._id || doctor?.id || doctor?.doctorId;

    const input = (name, value, onChange, placeholder, type = "text") => (

        <input

            type={type}

            name={name}

            value={value}

            onChange={onChange}

            placeholder={placeholder}

            className={inputClass}

        />

    );

    const renderAlerts = () => (

        <>

            {error && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">

                    ⚠️ {error}

                </div>

            )}

            {message && (

                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">

                    ✅ {message}

                </div>

            )}

        </>

    );

    const renderLogin = () => (

        <form onSubmit={handleLogin} className="space-y-5">

            <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">

                    Email Address

                </label>

                {input(

                    "email",

                    loginData.email,

                    (e) =>

                        setLoginData((p) => ({

                            ...p,

                            email: e.target.value,

                        })),

                    "doctor@example.com",

                    "email"

                )}

            </div>

            <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">

                    Password

                </label>

                <div className="relative">

                    <input

                        type={showPassword ? "text" : "password"}

                        value={loginData.password}

                        onChange={(e) =>

                            setLoginData((p) => ({

                                ...p,

                                password: e.target.value,

                            }))

                        }

                        placeholder="Enter password"

                        className={`${inputClass} pr-20`}

                    />

                    <button

                        type="button"

                        onClick={() => setShowPassword((v) => !v)}

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"

                    >

                        {showPassword ? "HIDE" : "SHOW"}

                    </button>

                </div>

            </div>

            <button

                type="submit"

                disabled={loading}

                className="w-full rounded-xl bg-blue-600 py-3.5 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"

            >

                {loading ? "Signing in..." : "🩺 Login as Doctor"}

            </button>

            <div className="text-center">

                <p className="text-sm text-slate-500">New doctor?</p>

                <button

                    type="button"

                    onClick={() => {

                        clearAlerts();

                        setScreen("REGISTER");

                    }}

                    className="mt-1 font-black text-blue-600 hover:underline"

                >

                    Create Doctor Account

                </button>

            </div>

        </form>

    );

    const renderRegister = () => {

        const update = (e) =>

            setRegisterData((p) => ({

                ...p,

                [e.target.name]: e.target.value,

            }));

        return (

            <form onSubmit={handleRegister} className="space-y-5">

                <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Full Name *

                        </label>

                        {input("name", registerData.name, update, "Dr. Rahul Sharma")}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Email *

                        </label>

                        {input(

                            "email",

                            registerData.email,

                            update,

                            "doctor\@example.com",

                            "email"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Phone

                        </label>

                        {input(

                            "phone",

                            registerData.phone,

                            update,

                            "9876543210",

                            "tel"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Doctor Number

                        </label>

                        {input("number", registerData.number, update, "DOC-1001")}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Medical Council Name

                        </label>

                        {input("councilName", registerData.councilName, update, "Medical Council of India")}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Specialization

                        </label>

                        {input(

                            "specialization",

                            registerData.specialization,

                            update,

                            "Cardiologist"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Qualification

                        </label>

                        {input(

                            "qualification",

                            registerData.qualification,

                            update,

                            "MBBS, MD"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Experience (years)

                        </label>

                        {input(

                            "experienceYears",

                            registerData.experienceYears,

                            update,

                            "5",

                            "number"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Consultation Fee

                        </label>

                        {input(

                            "consultationFee",

                            registerData.consultationFee,

                            update,

                            "500",

                            "number"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Medical Council Registration Number

                        </label>

                        {input(

                            "medicalCouncilRegistration",

                            registerData.medicalCouncilRegistration,

                            update,

                            "MCI/State registration number"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Hospital / Clinic

                        </label>

                        {input(

                            "hospital",

                            registerData.hospital,

                            update,

                            "City Hospital"

                        )}

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            City

                        </label>

                        {input("city", registerData.city, update, "Bhopal")}

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">

                        About Doctor

                    </label>

                    <textarea

                        name="about"

                        value={registerData.about}

                        onChange={update}

                        rows={3}

                        placeholder="Short professional introduction..."

                        className={`${inputClass} resize-none`}

                    />

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Password *

                        </label>

                        <div className="relative">

                            <input

                                type={showPassword ? "text" : "password"}

                                name="password"

                                value={registerData.password}

                                onChange={update}

                                placeholder="Minimum 6 characters"

                                className={`${inputClass} pr-20`}

                            />

                            <button

                                type="button"

                                onClick={() => setShowPassword((v) => !v)}

                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"

                            >

                                {showPassword ? "HIDE" : "SHOW"}

                            </button>

                        </div>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">

                            Confirm Password *

                        </label>

                        <div className="relative">

                            <input

                                type={showConfirmPassword ? "text" : "password"}

                                name="confirmPassword"

                                value={registerData.confirmPassword}

                                onChange={update}

                                placeholder="Repeat password"

                                className={`${inputClass} pr-20`}

                            />

                            <button

                                type="button"

                                onClick={() => setShowConfirmPassword((v) => !v)}

                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"

                            >

                                {showConfirmPassword ? "HIDE" : "SHOW"}

                            </button>

                        </div>

                    </div>

                </div>

                <button

                    type="submit"

                    disabled={loading}

                    className="w-full rounded-xl bg-blue-600 py-3.5 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"

                >

                    {loading ? "Creating account..." : "Create Doctor Account"}

                </button>

                <div className="text-center">

                    <button

                        type="button"

                        onClick={() => {

                            clearAlerts();

                            setScreen("LOGIN");

                        }}

                        className="font-bold text-blue-600 hover:underline"

                    >

                        ← Back to Doctor Login

                    </button>

                </div>

            </form>

        );

    };
    const renderProfile = () => (
        <div>

            {/* Profile heading */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">
                        DoctorX Profile
                    </h2>

                    <p className="text-sm text-slate-500">
                        Manage your professional information.
                    </p>
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                    ID: {doctorId || "N/A"}
                </div>
            </div>
            {/* Profile Picture - separate component */}
            <DoctorProfilePicture
                doctor={doctor}
                onDoctorUpdated={(updatedDoctor) => {
                    setDoctor(updatedDoctor);
                    localStorage.setItem("doctor", JSON.stringify(updatedDoctor));
                    setProfileFormFromDoctor(updatedDoctor);
                }}
                onError={setError}
                onSuccess={setMessage}
            />

            {/* Loading */}
            {profileLoading && (
                <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-700">
                    Loading profile...
                </div>
            )}


            {/* Profile Form */}
            <form onSubmit={updateProfile} className="space-y-5">

                <div className="grid gap-4 sm:grid-cols-2">

                    {[
                        ["name", "Full Name", "Dr. Your Name"],
                        ["phone", "Phone", "Phone number"],
                        ["specialization", "Specialization", "Cardiologist"],
                        ["qualification", "Qualification", "MBBS, MD"],
                        ["experienceYears", "Experience", "5"],
                        ["consultationFee", "Consultation Fee", "500"],
                        ["hospital", "Hospital / Clinic", "Hospital name"],
                        ["city", "City", "Bhopal"],
                    ].map(([key, label, placeholder]) => (

                        <div key={key}>

                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                {label}
                            </label>

                            <input
                                type={
                                    key === "experienceYears" ||
                                        key === "consultationFee"
                                        ? "number"
                                        : "text"
                                }
                                value={profileForm[key]}
                                onChange={(e) =>
                                    setProfileForm((p) => ({
                                        ...p,
                                        [key]: e.target.value,
                                    }))
                                }
                                placeholder={placeholder}
                                className={inputClass}
                            />

                        </div>

                    ))}

                </div>


                <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        About
                    </label>

                    <textarea
                        rows={4}
                        value={profileForm.about}
                        onChange={(e) =>
                            setProfileForm((p) => ({
                                ...p,
                                about: e.target.value,
                            }))
                        }
                        placeholder="Professional introduction..."
                        className={`${inputClass} resize-none`}
                    />

                </div>


                <button
                    type="submit"
                    disabled={profileLoading}
                    className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {profileLoading ? "Saving..." : "Save Profile"}
                </button>

            </form>

        </div>
    );

    const renderDoctorCard = (d, index) => (

        <div

            key={d?._id || d?.id || index}

            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"

        >

            <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">

                    🩺

                </div>

                <div className="min-w-0 flex-1">

                    <h3 className="truncate text-lg font-black text-slate-900">

                        {d?.name || "Doctor"}

                    </h3>

                    <p className="mt-1 text-sm font-bold text-blue-600">

                        {d?.specialization || "Medical Specialist"}

                    </p>

                </div>

            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-600">

                {d?.qualification && (

                    <p>

                        <b>Qualification:</b> {d.qualification}

                    </p>

                )}

                {d?.experienceYears !== undefined && (

                    <p>

                        <b>Experience:</b> {d.experienceYears} years

                    </p>

                )}

                {d?.hospital && (

                    <p>

                        <b>Hospital:</b> {d.hospital}

                    </p>

                )}

                {d?.city && (

                    <p>

                        <b>City:</b> {d.city}

                    </p>

                )}

                {d?.consultationFee !== undefined && (

                    <p>

                        <b>Consultation:</b> ₹{d.consultationFee}

                    </p>

                )}

            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">

                {d?.about || "Professional healthcare provider."}

            </div>

        </div>

    );

    const renderAllDoctors = () => (

        <div>

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

                <div>

                    <h2 className="text-2xl font-black text-slate-900">

                        All Doctors

                    </h2>

                    <p className="text-sm text-slate-500">

                        Doctors loaded from the backend API.

                    </p>

                </div>

                <button

                    type="button"

                    onClick={loadAllDoctors}

                    disabled={doctorsLoading}

                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"

                >

                    {doctorsLoading ? "Loading..." : "↻ Refresh"}

                </button>

            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px]">

                <input

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    placeholder="Search doctor, hospital, city, specialization..."

                    className={inputClass}

                />

                <select

                    value={specializationFilter}

                    onChange={(e) => setSpecializationFilter(e.target.value)}

                    className={inputClass}

                >

                    {specializations.map((s) => (

                        <option key={s} value={s}>

                            {s === "ALL" ? "All Specializations" : s}

                        </option>

                    ))}

                </select>

            </div>

            {doctorsLoading ? (

                <div className="rounded-2xl bg-white p-10 text-center font-bold text-slate-500 shadow-sm">

                    Loading doctors...

                </div>

            ) : filteredDoctors.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                    <div className="text-4xl">🩺</div>

                    <h3 className="mt-3 font-black text-slate-800">

                        No doctors found

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                        Try another search or refresh the list.

                    </p>

                </div>

            ) : (

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {filteredDoctors.map(renderDoctorCard)}

                </div>

            )}

        </div>

    );

    const renderDashboard = () => (

        <div className="relative z-10 flex min-h-screen flex-col bg-slate-50/95">

            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-8">

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">

                            🩺

                        </div>

                        <div>

                            <h1 className="font-black text-slate-900">

                                Doctor Portal

                            </h1>

                            <p className="text-xs text-slate-500">

                                Abhimanyu Healthcare

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-2">

                        <span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 sm:block">

                            ● Online

                        </span>

                        <button

                            type="button"

                            onClick={logout}

                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-100"

                        >

                            Logout

                        </button>

                        {onClose && (

                            <button

                                type="button"

                                onClick={onClose}

                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50"

                            >

                                Close

                            </button>

                        )}

                    </div>

                </div>

            </header>

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-8 lg:flex-row">

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:w-64">

                    <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white">

                        <div className="text-3xl">👨‍⚕️</div>

                        <p className="mt-3 text-xs font-bold text-blue-100">

                            Welcome

                        </p>

                        <h2 className="truncate text-lg font-black">

                            {doctor?.name || "Doctor"}

                        </h2>

                    </div>

                    <nav className="space-y-2">

                        {[

                            ["PROFILE", "👤", "My Profile"],

                            ["DOCTORS", "🩺", "All Doctors"],
                            ["OPD", "🎫", "OPD Tokens"],

                        ].map(([key, icon, label]) => (

                            <button

                                key={key}

                                type="button"

                                onClick={() => {

                                    clearAlerts();

                                    setDashboardTab(key);

                                }}

                                className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-black transition ${dashboardTab === key

                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"

                                    : "text-slate-600 hover:bg-slate-100"

                                    }`}

                            >

                                <Icon>{icon}</Icon>

                                <span className={dashboardTab === key ? "text-white" : ""}>

                                    {label}

                                </span>

                            </button>

                        ))}

                    </nav>

                </aside>

                <main className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                    {renderAlerts()}

                    {dashboardTab === "PROFILE" && renderProfile()}

                    {dashboardTab === "DOCTORS" && renderAllDoctors()}

                    {dashboardTab === "OPD" && renderOPDTokens()}

                </main>

            </div>

        </div>

    );

    if (screen === "DASHBOARD") {

        return (

            <div className="fixed inset-0 z-[100] overflow-auto">

                <DoctorBackground />

                {renderDashboard()}

            </div>

        );

    }

    return (

        <div className="fixed inset-0 z-[100] overflow-y-auto">

            <DoctorBackground />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">

                <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl">

                    <div className="grid lg:grid-cols-[0.85fr_1.15fr]">

                        <section className="relative hidden min-h-[720px] overflow-hidden bg-gradient-to-br from-[#061426] via-[#0b3155] to-blue-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">

                            <div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">

                                    🩺

                                </div>

                                <p className="mt-8 text-sm font-black uppercase tracking-[0.25em] text-cyan-200">

                                    Abhimanyu Healthcare

                                </p>

                                <h1 className="mt-4 text-5xl font-black leading-tight">

                                    Doctor

                                    <br />

                                    Portal

                                </h1>

                                <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100">

                                    Securely manage your professional profile and discover

                                    healthcare professionals from one place.

                                </p>

                            </div>

                            <div className="grid grid-cols-2 gap-3">

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                                    <div className="text-2xl">🔐</div>

                                    <p className="mt-2 text-xs font-bold text-blue-100">

                                        Secure Login

                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                                    <div className="text-2xl">👨‍⚕️</div>

                                    <p className="mt-2 text-xs font-bold text-blue-100">

                                        Doctor Network

                                    </p>

                                </div>

                            </div>

                        </section>

                        <section className="max-h-[92vh] overflow-y-auto p-6 sm:p-10">

                            <div className="mb-8 flex items-start justify-between gap-4">

                                <div>

                                    <div className="mb-3 text-3xl lg:hidden">🩺</div>

                                    <h2 className="text-3xl font-black text-slate-900">

                                        {screen === "LOGIN"

                                            ? "Doctor Login"

                                            : "Create Doctor Account"}

                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">

                                        {screen === "LOGIN"

                                            ? "Sign in to access your doctor portal."

                                            : "Register your professional healthcare profile."}

                                    </p>

                                </div>

                                {onClose && (

                                    <button

                                        type="button"

                                        onClick={onClose}

                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-black text-slate-500 hover:bg-slate-200"

                                    >

                                        ×

                                    </button>

                                )}

                            </div>

                            {renderAlerts()}

                            {screen === "LOGIN" ? renderLogin() : renderRegister()}

                        </section>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Doctor;
// 