import axios from 'axios';

export const baseURL = 'http://localhost:3000'

export const httpClient = axios.create({
    baseURL,
    withCredentials: true
});

// Flag to track if a token refresh is in progress
let isRefreshing = false;
let refreshSubscribers: Function[] = [];

// Function to subscribe requests to be retried
function subscribeTokenRefresh(callback: Function) {
    refreshSubscribers.push(callback);
}

// Function to notify all subscribers once a token refresh is complete
function onRefreshed() {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
}

// Axios response interceptor
httpClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // If the response status is 401, try to refresh the token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            // If another refresh is already in progress, wait for it
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(httpClient(originalRequest));
                    });
                });
            }

            // Start the refresh process
            isRefreshing = true;

            try {
                await httpClient.get('/auth/refresh'); // Call the refresh token endpoint
                isRefreshing = false;
                onRefreshed(); // Notify all subscribers that the token has been refreshed
                return httpClient(originalRequest); // Retry the original request
            } catch (refreshError) {
                isRefreshing = false;
                return Promise.reject(refreshError); // If refresh fails, reject the original request
            }
        }

        // If the error is not 401, or retry fails, reject the promise
        return Promise.reject(error);
    }
);

