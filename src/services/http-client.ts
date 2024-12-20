import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const httpClient = axios.create({
    baseURL,
    withCredentials: true
});

let isRefreshing = false;
let refreshSubscribers: Function[] = [];

function subscribeTokenRefresh(callback: Function) {
    refreshSubscribers.push(callback);
}

function onRefreshed() {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
}

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !/auth\/refresh/.test(originalRequest.url)) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(httpClient(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                await httpClient.post('/auth/refresh');
                isRefreshing = false;
                onRefreshed();
                return httpClient(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                window.location.href = `${baseURL}/auth/google`
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

