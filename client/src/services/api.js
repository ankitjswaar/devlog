import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const postsAPI = {
  generate: (data) => api.post('/posts/generate', data),
  getAll: () => api.get('/posts'),
  getStats: () => api.get('/posts/stats'),
  getById: (id) => api.get(`/posts/${id}`),
};

export const linkedinAPI = {
  getAuthUrl: () => api.get('/linkedin/auth-url'),
  getProfile: () => api.get('/linkedin/profile'),
  post: (data) => api.post('/linkedin/post', data),
  disconnect: () => api.delete('/linkedin/disconnect'),
};

export default api;
