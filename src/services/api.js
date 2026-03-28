import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request
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

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  sendOtp: async (mobileNumber) => {
    const response = await api.post('/auth/send-otp', { mobileNumber });
    return response.data;
  },
  verifyOtp: async (mobileNumber, otp) => {
    const response = await api.post('/auth/verify-otp', { mobileNumber, otp });
    return response.data;
  }
};

export default api;
