import axios from 'axios';

const API = axios.create({
  baseURL: 'https://shapeupmate-server.onrender.com/api',
  timeout: 10000
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip error handling for demo mode
    const token = localStorage.getItem('token');
    if (token === 'demo-token') {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  exportData: () => API.get('/auth/export', { responseType: 'blob' })
};

export const meals = {
  create: (data) => API.post('/meals', data),
  getAll: () => API.get('/meals'),
  delete: (id) => API.delete(`/meals/${id}`)
};

export const workouts = {
  create: (data) => API.post('/workouts', data),
  getAll: () => API.get('/workouts'),
  delete: (id) => API.delete(`/workouts/${id}`)
};

export const trainers = {
  getAll: () => API.get('/trainers'),
  assign: (trainerId) => API.post('/trainers/assign', { trainerId }),
  getUsers: () => API.get('/trainers/users'),
  createGuidance: (data) => API.post('/trainers/guidance', data),
  getUserProgress: (userId) => API.get(`/trainers/progress/${userId}`),
  getGuidance: () => API.get('/trainers/guidance/me')
};

export default API;