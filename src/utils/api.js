import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Token will be sent via cookies, but you can also use headers if needed
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (username, password, role) => {
    const response = await api.post('/auth/login', { username, password, role });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Home Content API
export const homeAPI = {
  getContent: async () => {
    const response = await api.get('/home');
    return response.data;
  },
  
  updateWelcome: async (title, description) => {
    const response = await api.post('/home/welcome', { title, description });
    return response.data;
  },
  
  addQuickLink: async (label, link, icon) => {
    const response = await api.post('/home/quick-link', { label, link, icon });
    return response.data;
  },
  
  addAnnouncement: async (title, message) => {
    const response = await api.post('/home/announcement', { title, message });
    return response.data;
  },
  
  deleteContent: async (id) => {
    const response = await api.delete(`/home/${id}`);
    return response.data;
  },
};

// About API
export const aboutAPI = {
  getContent: async () => {
    const response = await api.get('/about');
    return response.data;
  },
  
  addContent: async (title, description, displayOrder = 0) => {
    const response = await api.post('/about', { title, description, displayOrder });
    return response.data;
  },
  
  updateContent: async (id, title, description, displayOrder = 0) => {
    const response = await api.put(`/about/${id}`, { title, description, displayOrder });
    return response.data;
  },
  
  deleteContent: async (id) => {
    const response = await api.delete(`/about/${id}`);
    return response.data;
  },
};

// Team API
export const teamAPI = {
  getMembers: async () => {
    const response = await api.get('/team');
    return response.data;
  },
  
  addMember: async (name, position, department, level, bio, startDate) => {
    const response = await api.post('/team', {
      name,
      position,
      department,
      level,
      bio,
      startDate,
    });
    return response.data;
  },
  
  updateMember: async (id, name, position, department, level, bio, startDate) => {
    const response = await api.put(`/team/${id}`, {
      name,
      position,
      department,
      level,
      bio,
      startDate,
    });
    return response.data;
  },
  
  deleteMember: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};

// Development API
export const developmentAPI = {
  getContent: async () => {
    const response = await api.get('/development');
    return response.data;
  },
  
  addContent: async (title, description, links, category, displayOrder = 0) => {
    const response = await api.post('/development', {
      title,
      description,
      links,
      category,
      displayOrder,
    });
    return response.data;
  },
  
  updateContent: async (id, title, description, links, category, displayOrder = 0) => {
    const response = await api.put(`/development/${id}`, {
      title,
      description,
      links,
      category,
      displayOrder,
    });
    return response.data;
  },
  
  deleteContent: async (id) => {
    const response = await api.delete(`/development/${id}`);
    return response.data;
  },
};

// Benefits API
export const benefitsAPI = {
  getBenefits: async () => {
    const response = await api.get('/benefits');
    return response.data;
  },
  
  addBenefit: async (title, description, category, displayOrder = 0) => {
    const response = await api.post('/benefits', {
      title,
      description,
      category,
      displayOrder,
    });
    return response.data;
  },
  
  updateBenefit: async (id, title, description, category, displayOrder = 0) => {
    const response = await api.put(`/benefits/${id}`, {
      title,
      description,
      category,
      displayOrder,
    });
    return response.data;
  },
  
  deleteBenefit: async (id) => {
    const response = await api.delete(`/benefits/${id}`);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  getDocuments: async (category = null) => {
    const response = await api.get('/documents', {
      params: category ? { category } : {},
    });
    return response.data;
  },
  
  uploadDocument: async (title, description, category, file) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('documents', file);
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateDocument: async (id, title, description, category) => {
    const response = await api.put(`/documents/${id}`, {
      title,
      description,
      category,
    });
    return response.data;
  },
  
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
  
  downloadDocument: async (id) => {
    const response = await api.get(`/documents/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Photos API
export const photosAPI = {
  getPhotos: async (category = null) => {
    const response = await api.get('/photos', {
      params: category ? { category } : {},
    });
    return response.data;
  },
  
  uploadPhotos: async (category, files) => {
    const formData = new FormData();
    formData.append('category', category);
    
    Array.from(files).forEach((file) => {
      formData.append('photos', file);
    });
    
    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updatePhoto: async (id, title, description, category) => {
    const response = await api.put(`/photos/${id}`, {
      title,
      description,
      category,
    });
    return response.data;
  },
  
  deletePhoto: async (id) => {
    const response = await api.delete(`/photos/${id}`);
    return response.data;
  },
  
  getPhoto: async (id) => {
    const response = await api.get(`/photos/${id}`);
    return response.data;
  },
};

// Calendar API
export const calendarAPI = {
  getEvents: async (category = null, month = null, year = null) => {
    const params = {};
    if (category) params.category = category;
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await api.get('/calendar', { params });
    return response.data;
  },
  
  addEvent: async (title, description, eventDate, startTime, endTime, location, category, isAllDay = false) => {
    const response = await api.post('/calendar', {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      category,
      isAllDay,
    });
    return response.data;
  },
  
  updateEvent: async (id, title, description, eventDate, startTime, endTime, location, category, isAllDay = false) => {
    const response = await api.put(`/calendar/${id}`, {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      category,
      isAllDay,
    });
    return response.data;
  },
  
  deleteEvent: async (id) => {
    const response = await api.delete(`/calendar/${id}`);
    return response.data;
  },
  
  getEventsInRange: async (startDate, endDate, category = null) => {
    const params = { startDate, endDate };
    if (category) params.category = category;
    
    const response = await api.get('/calendar/range', { params });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },
  
  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },
  
  getLogs: async (limit = 100, offset = 0) => {
    const response = await api.get('/admin/logs', {
      params: { limit, offset },
    });
    return response.data;
  },
  
  createBackup: async () => {
    const response = await api.post('/admin/backup');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
