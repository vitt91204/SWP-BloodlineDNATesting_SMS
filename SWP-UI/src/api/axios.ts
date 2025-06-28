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
    try {
      // Since there's no login endpoint, we'll validate against the user list
      console.log('Attempting login with username:', username);
      
      const response = await api.get('/api/User');
      console.log('Got users from API:', response.data);
      
      if (Array.isArray(response.data)) {
        // Find user with matching username
        const user = response.data.find(u => u.username === username);
        
        if (user) {
          console.log('Found user:', user);
          
          // Simple password validation (you should implement proper password checking in backend)
          if (user.password === password) {
            console.log('Password matches');
            
            // Return successful login response
            return {
              token: 'dummy-token-' + user.userId,
              user: user,
              success: true,
              message: 'Login successful'
            };
          } else {
            console.log('Password does not match');
            throw new Error('Mật khẩu không chính xác');
          }
        } else {
          console.log('User not found');
          throw new Error('Tên đăng nhập không tồn tại');
        }
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message && (error.message.includes('không chính xác') || error.message.includes('không tồn tại'))) {
        throw error;
      }
      throw new Error('Lỗi kết nối API: ' + error.message);
    }
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
  // Get all users (for admin)
  getAllUsers: async () => {
    console.log('Calling /api/User to get all users...');
    const response = await api.get('/api/User');
    console.log('All Users API Response:', response.data);
    return response.data;
  },

  // Update user (for admin)
  updateUser: async (userId: number, userData: any) => {
    console.log(`Updating user ${userId} with data:`, userData);
    const response = await api.put(`/api/User/${userId}`, userData);
    console.log('Update User Response:', response.data);
    return response.data;
  },

  // Delete user (for admin)
  deleteUser: async (userId: number) => {
    console.log(`Deleting user ${userId}...`);
    const response = await api.delete(`/api/User/${userId}`);
    console.log('Delete User Response:', response.data);
    return response.data;
  },

  // Get user basic info (email, phone) from /api/User
  getUserInfo: async (userId?: string) => {
    console.log('Calling /api/User endpoint...');
    const currentUserId = userId || getUserIdFromLocalStorage();
    
    try {
      // Call /api/User to get all users (API doesn't support /api/User/{id})
      const response = await api.get('/api/User');
      console.log('User API Response:', response);
      console.log('User API Response Data:', response.data);
      console.log('Array check:', Array.isArray(response.data));
      if (Array.isArray(response.data)) {
        console.log('Users found:', response.data.map(u => ({ id: u.id || u.userId, username: u.username, email: u.email })));
      }
      
      // Handle array response - find current user or get first user
      if (Array.isArray(response.data)) {
        if (currentUserId) {
          const foundUser = response.data.find(user => user.userId?.toString() === currentUserId.toString() || user.id?.toString() === currentUserId.toString());
          if (foundUser) {
            console.log('Found specific user in array:', foundUser);
            return foundUser;
          }
        }
        
        // Get user data from localStorage to match
        const localUserData = localStorage.getItem('userData');
        const localUser = localUserData ? JSON.parse(localUserData) : null;
        
        console.log('Looking for user with localStorage data:', localUser);
        
        if (localUser?.username) {
          const foundUser = response.data.find(user => user.username === localUser.username);
          if (foundUser) {
            console.log('Found user by username:', foundUser);
            return foundUser;
          }
        }
        
        // Try to find by ID if available
        if (localUser?.id) {
          const foundUser = response.data.find(user => user.userId?.toString() === localUser.id?.toString() || user.id?.toString() === localUser.id?.toString());
          if (foundUser) {
            console.log('Found user by ID from localStorage:', foundUser);
            return foundUser;
          }
        }
        
        console.log('User API returned array, taking first element as fallback:', response.data[0]);
        return response.data[0];
      }
      
      return response.data;
    } catch (error) {
      console.log('User API call failed:', error);
      throw error;
    }
  },

  getProfile: async (userId?: string) => {
    // Get userId from localStorage if not provided
    const currentUserId = userId || getUserIdFromLocalStorage();
    console.log('Fetching all users to find profile for userId:', currentUserId);
    
    if (!currentUserId) {
      console.error('No userId available for profile request');
      throw new Error('User ID is required to fetch profile');
    }
    
    try {
      // API returns 405 for GET /api/User/{id}, so fetch all and find the one we need.
      const response = await api.get('/api/User');
      
      if (Array.isArray(response.data)) {
        const user = response.data.find(u => u.id?.toString() === currentUserId.toString() || u.userId?.toString() === currentUserId.toString());
        
        if (user) {
          console.log('Found user profile:', user);
          return user;
        }
        
        console.log('User with specified ID not found in the list.');
        return null; // User not found
      }

      console.error('Expected an array of users, but received:', response.data);
      throw new Error('Invalid data format from user API.');

    } catch (error) {
      console.error('Profile API Error:', error);
      // If the main /api/User endpoint itself fails
      if (error.response?.status === 404) {
        console.log('User endpoint not found, returning null.');
        return null;
      }
      throw error;
    }
  },

  // Update password using User API endpoint
  updatePassword: async (userId: string, oldPassword: string, newPassword: string) => {
    console.log(`Updating password for user ${userId}...`);
    
    try {
      // First get the current user data
      const currentUser = await userAPI.getUserInfo(userId);
      
      // Prepare the update payload with the new password
      const updateData = {
        id: parseInt(userId),
        username: currentUser.username,
        email: currentUser.email,
        phone: currentUser.phone,
        password: newPassword,
        role: currentUser.role
      };
      
      const response = await api.put(`/api/User/${userId}`, updateData);
      console.log('Update Password Response:', response);
      console.log('Update Password Response Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  // Create new profile using POST
  createProfile: async (userData: any, userId?: string) => {
    console.log('Creating new profile by updating user with data:', userData);
    
    const currentUserId = userId || getUserIdFromLocalStorage();
    
    if (!currentUserId) {
      console.error('No userId available for profile creation');
      throw new Error('User ID is required to create profile');
    }
    
    try {
      // "Creating a profile" for an existing user is just updating their data.
      const response = await api.put(`/api/User/${currentUserId}`, userData);
      console.log('Create Profile Response:', response);
      console.log('Create Profile Response Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  },
  
  updateProfile: async (userData: any, userId?: string) => {
    console.log('Updating profile with data:', userData);
    
    const currentUserId = userId || getUserIdFromLocalStorage();
    
    if (!currentUserId) {
      console.error('No userId available for profile update');
      throw new Error('User ID is required to update profile');
    }
    
    try {
      const response = await api.put(`/api/User/${currentUserId}`, userData);
      console.log('Update Profile Response:', response);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
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
export const testRequestAPI = {
  create: async (requestData: any) => {
    const response = await api.post('/api/TestRequest/api/testrequest', requestData);
    return response.data;
  },
};

// Thêm API cho TestService
export const testServiceAPI = {
  // Lấy tất cả các loại dịch vụ xét nghiệm
  getAll: async () => {
    const response = await api.get('/api/TestService');
    return response.data;
  },

  // Lấy dịch vụ theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/TestService/${id}`);
    return response.data;
  },

  // Tạo dịch vụ mới (cho admin)
  create: async (serviceData: any) => {
    const response = await api.post('/api/TestService', serviceData);
    return response.data;
  },

  // Cập nhật dịch vụ (cho admin)
  update: async (id: number, serviceData: any) => {
    const response = await api.put(`/api/TestService/${id}`, serviceData);
    return response.data;
  },

  // Xóa dịch vụ (cho admin)
  delete: async (id: number) => {
    const response = await api.delete(`/api/TestService/${id}`);
    return response.data;
  }
};

// Cuối file axios.ts
export const blogAPI = {
  // GET all bài viết
  getAll: async () => {
    const response = await api.get('/api/BlogPost');
    return response.data;
  },

  // ✅ GET chi tiết 1 bài viết theo id
  getById: async (id: string | number) => {
    const response = await api.get(`/api/BlogPost/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/api/BlogPost', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/api/BlogPost/${id}`, data);
    return response.data;
  },
};
export const feedbackAPI = {
  create: async (data: any) => {
    const response = await api.post('/api/Feedback', data);
    return response.data;
  },

  getByUserId: async (userId: number) => {
    const response = await api.get(`/api/Feedback/user/${userId}`);
    return response.data;
  },

  getById: async (feedbackId: number) => {
    const response = await api.get(`/api/Feedback/${feedbackId}`);
    return response.data;
  },

  update: async (feedbackId: number, data: any) => {
    const response = await api.put(`/api/Feedback/${feedbackId}`, data);
    return response.data;
  },

  delete: async (feedbackId: number) => {
    const response = await api.delete(`/api/Feedback/${feedbackId}`);
    return response.data;
  },
};



  

