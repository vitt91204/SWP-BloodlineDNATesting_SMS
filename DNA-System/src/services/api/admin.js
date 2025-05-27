import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const admin = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Mock data for development
      return Promise.resolve({
        totalTests: 150,
        pendingResults: 25,
        activeUsers: 89,
        revenue: 45250,
        recentActivity: [
          {
            id: 1,
            date: '2024-03-15',
            user: 'John Doe',
            action: 'Booked Test',
            status: 'Completed'
          },
          {
            id: 2,
            date: '2024-03-14',
            user: 'Jane Smith',
            action: 'Submitted Sample',
            status: 'Processing'
          }
        ],
        monthlyStats: {
          tests: [45, 52, 38, 65, 48, 55, 42, 50, 48, 58, 62, 45],
          revenue: [15000, 18000, 12000, 22000, 16000, 19000, 14000, 17000, 16000, 20000, 21000, 15000]
        }
      });

      // For production
      // const response = await axios.get(`${API_URL}/admin/dashboard`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  },

  // Manage users
  getUsers: async () => {
    try {
      // Mock data
      return Promise.resolve([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'STAFF',
          status: 'active',
          createdAt: '2024-02-01'
        }
      ]);

      // For production
      // const response = await axios.get(`${API_URL}/admin/users`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      // Mock response
      return Promise.resolve({
        id: userId,
        ...userData,
        updatedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Get reports
  getReports: async (params) => {
    try {
      // Mock data
      return Promise.resolve({
        testsByType: {
          'Paternity DNA Test': 45,
          'Ancestry DNA Test': 35,
          'Health DNA Test': 20
        },
        revenueByMonth: {
          'Jan 2024': 15000,
          'Feb 2024': 18000,
          'Mar 2024': 22000
        },
        customerSatisfaction: {
          average: 4.5,
          total: 150,
          distribution: {
            5: 80,
            4: 45,
            3: 15,
            2: 7,
            1: 3
          }
        }
      });

      // For production
      // const response = await axios.get(`${API_URL}/admin/reports`, {
      //   ...getAuthHeader(),
      //   params
      // });
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reports');
    }
  },

  // Manage staff
  getStaffMembers: async () => {
    try {
      // Mock data
      return Promise.resolve([
        {
          id: 1,
          name: 'Dr. Smith',
          role: 'Lab Technician',
          specialization: 'DNA Analysis',
          status: 'active',
          testsCompleted: 125
        },
        {
          id: 2,
          name: 'Dr. Johnson',
          role: 'Sample Collector',
          specialization: 'Blood Collection',
          status: 'active',
          testsCompleted: 89
        }
      ]);

      // For production
      // const response = await axios.get(`${API_URL}/admin/staff`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff members');
    }
  },

  // Manage appointments
  getAppointments: async (params) => {
    try {
      // Mock data
      return Promise.resolve([
        {
          id: 1,
          patientName: 'John Doe',
          testType: 'Paternity DNA Test',
          date: '2024-03-20',
          time: '10:00',
          status: 'scheduled',
          location: 'Main Lab'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          testType: 'Ancestry DNA Test',
          date: '2024-03-21',
          time: '14:30',
          status: 'completed',
          location: 'Branch Office'
        }
      ]);

      // For production
      // const response = await axios.get(`${API_URL}/admin/appointments`, {
      //   ...getAuthHeader(),
      //   params
      // });
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  // System settings
  getSystemSettings: async () => {
    try {
      // Mock data
      return Promise.resolve({
        emailNotifications: true,
        smsNotifications: true,
        maintenanceMode: false,
        allowSelfRegistration: true,
        requireEmailVerification: true,
        appointmentTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      });

      // For production
      // const response = await axios.get(`${API_URL}/admin/settings`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system settings');
    }
  },

  // Update system settings
  updateSystemSettings: async (settings) => {
    try {
      // Mock response
      return Promise.resolve({
        ...settings,
        updatedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.put(`${API_URL}/admin/settings`, settings, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update system settings');
    }
  }
};
