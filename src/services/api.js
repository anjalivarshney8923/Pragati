import axios from 'axios';

// Use Vite env var if provided, otherwise default to IPv4 loopback to avoid localhost IPv6 issues
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';

const api = axios.create({
  baseURL: API_BASE,
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

// Global response interceptor: if auth errors occur, clear token and redirect to login
api.interceptors.response.use(
  response => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/login';
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Villager Auth
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Officer Auth (Governance Portal)
  registerOfficer: async (formData) => {
    // Let the browser set Content-Type (including multipart boundary)
    const response = await api.post('/auth/register-officer', formData);
    return response.data;
  },
  loginOfficer: async (credentials) => {
    const response = await api.post('/auth/login-officer', credentials);
    return response.data;
  }
};

export const complaintService = {
  createComplaint: async (complaintData) => {
    // For FormData, don't set Content-Type header so the browser sets the correct multipart boundary
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },
  getMyComplaints: async () => {
    const response = await api.get('/complaints/my');
    return response.data;
  },
  getAllComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data;
  },
  getOfficerComplaints: async () => {
    const response = await api.get('/officer/complaints');
    return response.data;
  },
  updateComplaintStatus: async (id, status) => {
    const response = await api.put(`/officer/complaints/${id}/status`, { status });
    return response.data;
  }
};

export default api;
