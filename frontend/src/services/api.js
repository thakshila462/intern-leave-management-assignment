import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Normalize common backend response formats
export function getList(response, keys = []) {
    const data = response.data;

    if (Array.isArray(data)) {
        return data;
    }

    for (const key of keys) {
        if (Array.isArray(data?.[key])) {
            return data[key];
        }
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

export function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong."
    );
}

export default api;