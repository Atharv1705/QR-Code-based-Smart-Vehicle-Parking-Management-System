import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('parkingUser');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied:', data.message);
          break;
        case 404:
          console.error('Resource not found:', data.message);
          break;
        case 422:
          // Validation errors
          console.error('Validation errors:', data.errors);
          break;
        case 500:
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API Error:', data.message || 'Unknown error');
      }
      
      return Promise.reject({
        message: data.message || 'An error occurred',
        errors: data.errors || [],
        status,
      });
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      });
    }
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  refreshToken: () => api.post('/refresh-token'),
};

export const slotsAPI = {
  getAll: () => api.get('/slots'),
  add: (slotData) => api.post('/slots', slotData),
  delete: (slotId) => api.delete(`/slots/${slotId}`),
  book: (bookingData) => api.post('/book', bookingData),
  release: (plateData) => api.post('/release', plateData),
};

export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getByPlate: (plate) => api.get(`/history/${plate}`),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/dashboard/stats'),
  getAnalytics: () => api.get('/analytics'),
};

export const userAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.post('/profile', profileData),
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.post('/settings', settings),
};

export default api;