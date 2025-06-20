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
  // Get user basic info (email, phone) from /api/User
  getUserInfo: async (userId?: string) => {
    console.log('Calling /api/User endpoint...');
    const currentUserId = userId || getUserIdFromLocalStorage();
    
    try {
      // Try without userId first
      const response = await api.get('/api/User');
      console.log('User API Response (no params):', response);
      console.log('User API Response Data (no params):', response.data);
      
      // Handle array response - get first user or find current user
      if (Array.isArray(response.data)) {
        console.log('User API returned array, taking first element:', response.data[0]);
        return response.data[0];
      }
      
      return response.data;
    } catch (error) {
      console.log('User API failed without userId, trying with userId:', currentUserId);
      try {
        // If that fails, try with userId
        const response = await api.get(`/api/User/${currentUserId}`);
        console.log('User API Response (with userId):', response);
        console.log('User API Response Data (with userId):', response.data);
        
        // Handle array response for userId endpoint too
        if (Array.isArray(response.data)) {
          console.log('User API with userId returned array, taking first element:', response.data[0]);
          return response.data[0];
        }
        
        return response.data;
      } catch (error2) {
        console.log('Both User API calls failed:', error, error2);
        throw error2;
      }
    }
  },

  getProfile: async (userId?: string) => {
    // Get userId from localStorage if not provided
    const currentUserId = userId || getUserIdFromLocalStorage();
    console.log('Calling /api/Profile with userId:', currentUserId);
    const response = await api.get(`/api/Profile/${currentUserId}`);
    console.log('Profile API Response:', response);
    console.log('Profile API Response Data:', response.data);
    return response.data;
  },
  
  updateProfile: async (userData: any, userId?: string) => {
    console.log('Updating profile with data:', userData);
    
    // Get user info from localStorage
    const localUserData = localStorage.getItem('userData');
    const localUser = localUserData ? JSON.parse(localUserData) : null;
    const currentUserId = userId || localUser?.id || getUserIdFromLocalStorage();
    
    // Format request body according to API requirements
    const requestBody = {
      User: {
        id: currentUserId,
        username: localUser?.username || '',
        email: userData.email || localUser?.email || '',
        phone: userData.phone || localUser?.phone || ''
      },
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      notes: userData.notes
    };
    
    console.log('Formatted request body:', requestBody);
    
    // Use POST /api/Profile for creating/updating profile
    const response = await api.post('/api/Profile', requestBody);
    console.log('Update Profile Response:', response);
    console.log('Update Profile Response Data:', response.data);
    return response.data;
  },
};

// Helper function to get userId from localStorage
const getUserIdFromLocalStorage = () => {
  const userData = localStorage.getItem('userData');
  console.log('Raw userData from localStorage:', userData);
  if (userData) {
    const parsedData = JSON.parse(userData);
    console.log('Parsed userData:', parsedData);
    const userId = parsedData.id || parsedData.userId || parsedData.user_id || '';
    console.log('Extracted userId:', userId);
    return userId;
  }
  console.log('No userData in localStorage');
  return '';
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