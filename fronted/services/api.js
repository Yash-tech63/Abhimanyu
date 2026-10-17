import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

console.log("API_URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {

        // Doctor token first
        const token =
            localStorage.getItem("doctorToken") ||
            localStorage.getItem("doctor_token") ||
            localStorage.getItem("token");

        console.log("========== API REQUEST ==========");
        console.log("URL:", config.url);
        console.log("TOKEN EXISTS:", !!token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // FormData ke liye browser khud Content-Type set karega
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;