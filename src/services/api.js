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
    const response = await api.post('/auth/register-officer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  loginOfficer: async (credentials) => {
    const response = await api.post('/auth/login-officer', credentials);
    return response.data;
  }
};

export const complaintService = {
  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getMyComplaints: async () => {
    const response = await api.get('/complaints/my');
    return response.data;
  },
  getAllComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data;
  }
};

export default api;
