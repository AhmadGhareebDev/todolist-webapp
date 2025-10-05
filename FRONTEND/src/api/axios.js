import axios from "axios";
import { useAuthStore } from "../store/authStore";
import authApis from "./api";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await authApis.refreshToken();
                if (response.success) {
                    const { accessToken, user } = response.data;
                    useAuthStore.getState().setAuth(accessToken, user);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    useAuthStore.getState().clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(new Error(response.message));
                }
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;