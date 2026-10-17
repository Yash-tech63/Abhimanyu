import axios from "axios";


const API_URL = import.meta.env.PROD
    ? "https://abhimanyu-cn5i.vercel.app/api"
    : "http://localhost:5000/api";




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