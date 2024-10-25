// src/api.js
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://140.245.214.34/api'  // Production API URL
  : 'http://localhost:3500';      // Development API URL

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers you need
  },
  timeout: 10000  // 10 seconds timeout
});

// Add request interceptor for handling tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // If you're using JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;