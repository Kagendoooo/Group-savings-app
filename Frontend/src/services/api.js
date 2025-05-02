import axios from 'axios';
import { getFromLocalStorage } from '../utils/localStorage';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getFromLocalStorage('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data, // Already returns response.data
  (error) => {
    console.error('API Error:', error.response || error);
    
    // Check for token expiration or auth issues
    if (error.response?.status === 401) {
      // Let AuthContext handle this in its catch blocks
      return Promise.reject({ 
        message: 'Your session has expired. Please log in again.',
        status: 401 
      });
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;