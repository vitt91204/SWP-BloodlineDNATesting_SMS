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
// Interface for TestRequest
export interface TestRequest {
  userId: number;
  serviceId: number;
  collectionType: string; // 'At Clinic' | 'At Home' | 'Self'
  status: string; // 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  appointmentDate: string; // ISO date string (YYYY-MM-DD)
  slotTime: string;
  staffId: number | null;
}

export interface TestRequestResponse extends TestRequest {
  id?: number;
  requestId?: number;
  testRequestId?: number;
  createdAt?: string;
  updatedAt?: string;
  addressId?: number | null;
  feedbacks?: any[];
  payments?: any[];
  samples?: any[];
  user?: any; 
  service?: any;
  staff?: any;
  address?: any;
}

// Thêm API cho TestService
export interface TestServiceUpdatePayload {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

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

  // Tạo dịch vụ mới với kitId (cho admin) - sử dụng endpoint mới
  create: async (serviceData: any, kitId: number) => {
    const response = await api.post(`/api/TestService/kit/${kitId}`, serviceData);
    return response.data;
  },

  // Tạo dịch vụ mới - phương thức cũ (legacy support)
  createLegacy: async (serviceData: any) => {
    const response = await api.post('/api/TestService', serviceData);
    return response.data;
  },

  // Cập nhật dịch vụ (cho admin)
  update: async (serviceId: number, serviceData: Partial<TestServiceUpdatePayload>, kitId: number) => {
    // The API requires kitId as a query parameter
    const response = await api.put(`/api/TestService/${serviceId}?kitId=${kitId}`, serviceData);
    return response.data;
  },

  // Xóa dịch vụ (cho admin)
  delete: async (serviceId: number) => {
    const response = await api.delete(`/api/TestService/${serviceId}`);
    return response.data;
  }
};

// Thêm API cho TestKit
export const testKitAPI = {
  // Lấy tất cả các bộ kit xét nghiệm
  getAll: async () => {
    const response = await api.get('/api/TestKit');
    return response.data;
  },

  // Lấy bộ kit theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/TestKit/${id}`);
    return response.data;
  },

  // Tạo bộ kit mới (cho admin)
  create: async (kitData: any) => {
    const response = await api.post('/api/TestKit', kitData);
    return response.data;
  },

  // Cập nhật bộ kit (cho admin)
  update: async (id: number, kitData: any) => {
    const response = await api.put(`/api/TestKit/${id}`, kitData);
    return response.data;
  },

  // Xóa bộ kit (cho admin)
  delete: async (id: number) => {
    const response = await api.delete(`/api/TestKit/${id}`);
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

// API cho Address
export const addressAPI = {
  // Tạo địa chỉ mới cho user
  create: async (userId: number, addressData: any) => {
    const response = await api.post(`/api/Address/${userId}`, addressData);
    return response.data;
  },

  // Lấy tất cả địa chỉ của user
  getByUserId: async (userId: number) => {
    const response = await api.get(`/api/Address/${userId}`);
    return response.data;
  },

  // Lấy địa chỉ theo ID
  getById: async (addressId: number) => {
    const response = await api.get(`/api/Address/${addressId}`);
    return response.data;
  },

  // Cập nhật địa chỉ
  update: async (addressId: number, addressData: any) => {
    // Get userId from localStorage for the API call
    const userData = localStorage.getItem('userData');
    let userId = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user?.id || user?.userId;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    if (!userId) {
      throw new Error('User ID is required for address update');
    }
    
    const response = await api.put(`/api/Address/${addressId}/${userId}`, addressData);
    return response.data;
  },

  // Xóa địa chỉ
  delete: async (addressId: number) => {
    // Get userId from localStorage for the API call
    const userData = localStorage.getItem('userData');
    let userId = null;
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user?.id || user?.userId;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    if (!userId) {
      throw new Error('User ID is required for address deletion');
    }
    
    const response = await api.delete(`/api/Address/${addressId}/${userId}`);
    return response.data;
  }
};

// API cho Sample Management
export const sampleAPI = {
  // Lấy tất cả mẫu xét nghiệm
  getAll: async () => {
    const response = await api.get('/api/Sample');
    return response.data;
  },

  // Lấy mẫu theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/Sample/${id}`);
    return response.data;
  },

  // Tạo mẫu mới
  create: async (sampleData: {
    requestId: number;
    collectedBy: number;
    collectionTime?: string;
    receivedTime?: string;
    status: 'Waiting' | 'Received' | 'Tested';
  }) => {
    const response = await api.post('/api/Sample', sampleData);
    return response.data;
  },

  // Cập nhật mẫu
  update: async (id: number, sampleData: any) => {
    const response = await api.put(`/api/Sample/${id}`, sampleData);
    return response.data;
  },

  // Xóa mẫu
  delete: async (id: number) => {
    const response = await api.delete(`/api/Sample/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái mẫu
  updateStatus: async (id: number, status: 'Waiting' | 'Received' | 'Tested') => {
    const response = await api.patch(`/api/Sample/${id}/status`, { status });
    return response.data;
  },

  // Lấy mẫu theo request ID
  getByRequestId: async (requestId: number) => {
    const response = await api.get(`/api/Sample/request/${requestId}`);
    return response.data;
  },

  // Lấy thống kê mẫu
  getStats: async () => {
    const response = await api.get('/api/Sample/stats');
    return response.data;
  }
};

// API cho Test Results Management
export const testResultAPI = {
  // Lấy tất cả kết quả xét nghiệm
  getAll: async () => {
    const response = await api.get('/api/TestResult');
    return response.data;
  },

  // Lấy kết quả theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/TestResult/${id}`);
    return response.data;
  },

  // Tạo kết quả mới
  create: async (resultData: {
    sample_id: number;
    uploaded_by: number;
    result_data: string;
    staff_id?: number;
  }) => {
    const response = await api.post('/api/TestResult', resultData);
    return response.data;
  },

  // Cập nhật kết quả
  update: async (id: number, resultData: any) => {
    const response = await api.put(`/api/TestResult/${id}`, resultData);
    return response.data;
  },

  // Xóa kết quả
  delete: async (id: number) => {
    const response = await api.delete(`/api/TestResult/${id}`);
    return response.data;
  },

  // Phê duyệt kết quả
  approve: async (id: number, approvedBy: number) => {
    const response = await api.patch(`/api/TestResult/${id}/approve`, { approved_by: approvedBy });
    return response.data;
  },

  // Lấy kết quả theo sample ID
  getBySampleId: async (sampleId: number) => {
    const response = await api.get(`/api/TestResult/sample/${sampleId}`);
    return response.data;
  },

  // Lấy kết quả cho khách hàng
  getCustomerResult: async (resultId: number) => {
    const response = await api.get(`/api/TestResult/customer/${resultId}`);
    return response.data;
  },

  // Tải xuống báo cáo PDF
  downloadReport: async (resultId: number) => {
    const response = await api.get(`/api/TestResult/${resultId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Gửi kết quả qua email
  sendByEmail: async (resultId: number, emailData: any) => {
    const response = await api.post(`/api/TestResult/${resultId}/send-email`, emailData);
    return response.data;
  },

  // Lấy thống kê kết quả
  getStats: async () => {
    const response = await api.get('/api/TestResult/stats');
    return response.data;
  }
};

// API cho Lab Management
export const labAPI = {
  // Lấy thống kê tổng quan phòng lab
  getDashboardStats: async () => {
    const response = await api.get('/api/Lab/dashboard');
    return response.data;
  },

  // Lấy hoạt động gần đây
  getRecentActivity: async () => {
    const response = await api.get('/api/Lab/recent-activity');
    return response.data;
  },

  // Lấy tiến độ xử lý mẫu
  getSampleProgress: async () => {
    const response = await api.get('/api/Lab/sample-progress');
    return response.data;
  },

  // Lấy tiến độ kết quả
  getResultProgress: async () => {
    const response = await api.get('/api/Lab/result-progress');
    return response.data;
  },

  // Cập nhật trạng thái mẫu hàng loạt
  updateBatchSampleStatus: async (sampleIds: string[], status: string) => {
    const response = await api.patch('/api/Lab/batch-update-samples', {
      sampleIds,
      status
    });
    return response.data;
  },

  // Cập nhật trạng thái kết quả hàng loạt
  updateBatchResultStatus: async (resultIds: string[], status: string) => {
    const response = await api.patch('/api/Lab/batch-update-results', {
      resultIds,
      status
    });
    return response.data;
  }
};

// API cho TestRequest (Yêu cầu xét nghiệm)
export const testRequestAPI = {
  // Lấy tất cả yêu cầu xét nghiệm
  getAll: async () => {
    const response = await api.get('/api/TestRequest');
    return response.data;
  },

  // Lấy yêu cầu theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/TestRequest/${id}`);
    return response.data;
  },

  // Tạo yêu cầu mới
  create: async (requestData: {
    userId: number;
    serviceId: number;
    collectionType: string;
    status: string;
    appointmentDate: string;
    slotTime: string;
    staffId: number | null;
  }) => {
    const response = await api.post('/api/TestRequest/api/testrequest', requestData);
    return response.data;
  },

  // Cập nhật yêu cầu
  update: async (id: number, requestData: any) => {
    const response = await api.put(`/api/TestRequest/${id}`, requestData);
    return response.data;
  },

  // Cập nhật trạng thái yêu cầu
  updateStatus: async (id: number, status: 'Pending' | 'On-going' | 'Arrived' | 'Collected' | 'Testing' | 'Completed') => {
    const response = await api.patch(`/api/TestRequest/${id}/status`, { status });
    return response.data;
  },

  // Lấy yêu cầu theo user ID
  getByUserId: async (userId: number) => {
    const response = await api.get(`/api/TestRequest/user/${userId}`);
    return response.data;
  },

  // Lấy yêu cầu theo staff ID
  getByStaffId: async (staffId: number) => {
    const response = await api.get(`/api/TestRequest/staff/${staffId}`);
    return response.data;
  },

  // Chỉ định staff cho yêu cầu xét nghiệm
  assignStaff: async (requestId: number, staffId: number) => {
    const response = await api.put(`/api/TestRequest/assign/${requestId}?staffId=${staffId}`);
    return response.data;
  }
};

// API cho SubSample
export const subSampleAPI = {
  // Lấy tất cả sub-sample
  getAll: async () => {
    const response = await api.get('/api/SubSample');
    return response.data;
  },

  // Lấy sub-sample theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/SubSample/${id}`);
    return response.data;
  },

  // Tạo sub-sample mới
  create: async (subSampleData: {
    sample_id: number;
    description: string;
  }) => {
    const response = await api.post('/api/SubSample', subSampleData);
    return response.data;
  },

  // Lấy sub-sample theo sample ID
  getBySampleId: async (sampleId: number) => {
    const response = await api.get(`/api/SubSample/sample/${sampleId}`);
    return response.data;
  }
};

// API cho Payment
export const paymentAPI = {
  // Lấy tất cả thanh toán
  getAll: async () => {
    const response = await api.get('/api/Payment');
    return response.data;
  },

  // Lấy thanh toán theo ID
  getById: async (id: number) => {
    const response = await api.get(`/api/Payment/${id}`);
    return response.data;
  },

  // Tạo thanh toán mới
  create: async (paymentData: {
    request_id: number;
    method: string;
    amount: number;
    status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    token?: string;
  }) => {
    const response = await api.post('/api/Payment', paymentData);
    return response.data;
  },

  // Cập nhật trạng thái thanh toán
  updateStatus: async (id: number, status: 'Pending' | 'Paid' | 'Failed' | 'Refunded') => {
    const response = await api.patch(`/api/Payment/${id}/status`, { status });
    return response.data;
  },

  // Lấy thanh toán theo request ID
  getByRequestId: async (requestId: number) => {
    const response = await api.get(`/api/Payment/request/${requestId}`);
    return response.data;
  },

  // Tạo payment URL
  createPaymentUrl: async (requestId: number, amount: number) => {
    const response = await api.post('/api/Payment/create-payment-url', {
      requestId,
      amount,
    });

    /*
      Backend có 2 khả năng phản hồi:
      1. Trả về text/plain chứa trực tiếp URL thanh toán (kiểu string)
      2. Trả về JSON có cấu trúc { result: "<paymentUrl>", ... }
      Để an toàn, ta kiểm tra cả 2 trường hợp và chuẩn hóa thành { paymentUrl: string | null }
    */

    let paymentUrl: string | null = null;

    if (typeof response.data === 'string') {
      paymentUrl = response.data;
    } else if (response.data && typeof response.data.result === 'string') {
      paymentUrl = response.data.result;
    }

    return { paymentUrl };
  }
};

// Bổ sung role 'manager' vào các interface/type liên quan user nếu có
export type UserRole = 'admin' | 'staff' | 'customer' | 'manager';



  

