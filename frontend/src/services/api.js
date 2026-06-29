import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wb_user');
      localStorage.removeItem('wb_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  sendOTP: (mobile) => api.post('/auth/otp/send', { mobile }),
  verifyOTP: (mobile, otp) => api.post('/auth/otp/verify', { mobile, otp }),
};

// Chat
export const chatAPI = {
  simulate: (message, session_id, mobile) => api.post('/chat/simulate', { message, session_id, mobile }),
  reset: (session_id) => api.post('/chat/reset', { session_id }),
  newSession: (mobile) => api.post('/chat/new-session', { mobile }),
};

// Leads
export const leadsAPI = {
  getAll: (filters) => api.get('/leads', { params: filters }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  getAnalytics: () => api.get('/leads/analytics'),
};

// Tickets
export const ticketsAPI = {
  getAll: (filters) => api.get('/tickets', { params: filters }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
};

// Customers
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
};

// Staff
export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
};

// Products
export const productsAPI = {
  getAll: (category) => api.get('/products', { params: { category } }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
};

// FAQs
export const faqsAPI = {
  getAll: (category) => api.get('/faqs', { params: { category } }),
  search: (q) => api.get('/faqs/search', { params: { q } }),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

// Campaigns
export const campaignsAPI = {
  getAll: () => api.get('/campaigns'),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getLeads: () => api.get('/analytics/leads'),
  getConversations: () => api.get('/analytics/conversations'),
  getCampaigns: () => api.get('/analytics/campaigns'),
};

export default api;
