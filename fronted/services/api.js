import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const isJwtLike = (value) => {
    return typeof value === "string" && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value.trim());
};

const getStoredToken = () => {
    const keys = ["token", "authToken", "accessToken", "jwtToken"];
    const candidates = keys.map((key) => localStorage.getItem(key));

    for (const candidate of candidates) {
        if (candidate && isJwtLike(candidate)) {
            return candidate.trim();
        }
    }

    for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value && (!isJwtLike(value) || ["undefined", "null"].includes(value.trim().toLowerCase()))) {
            localStorage.removeItem(key);
        }
    }

    return "";
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
