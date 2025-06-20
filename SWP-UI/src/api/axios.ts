import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '', // Use relative URL, Vite proxy will handle routing
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/User/login', {
      username,
      password,
    });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/api/User/register', userData);
    return response.data;
  },
  
  logout: async () => {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
  },
};

// Other API functions
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/User/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/api/User/profile', userData);
    return response.data;
  },
};

export const bookingAPI = {
  create: async (bookingData: any) => {
    const response = await api.post('/api/Booking', bookingData);
    return response.data;
  },
  
  getBookings: async () => {
    const response = await api.get('/api/Booking');
    return response.data;
  },
  
  getBookingById: async (id: string) => {
    const response = await api.get(`/api/Booking/${id}`);
    return response.data;
  },
};

export default api; 