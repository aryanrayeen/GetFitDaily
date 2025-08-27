import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Clear auth store if available
      if (window.authStore?.clearAuth) {
        window.authStore.clearAuth();
      }
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;