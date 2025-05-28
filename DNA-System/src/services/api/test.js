import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const test = {
  // Get all tests for a user
  getActiveTests: async (userId) => {
    try {
      // Mock data for development
      return Promise.resolve([
        {
          id: 1,
          userId: userId,
          testType: 'Paternity DNA Test',
          status: 'In Progress',
          collectionMethod: 'center',
          currentStage: 'Sample Collected',
          bookedDate: '2024-03-15',
          appointmentDate: '2024-03-20',
          expectedCompletion: '2024-03-25',
          stageDates: {
            'Appointment Scheduled': '2024-03-15',
            'Sample Collected': '2024-03-20'
          }
        },
        {
          id: 2,
          userId: userId,
          testType: 'Ancestry DNA Test',
          status: 'Completed',
          collectionMethod: 'self',
          currentStage: 'Results Ready',
          bookedDate: '2024-02-15',
          expectedCompletion: '2024-03-01',
          stageDates: {
            'Kit Ordered': '2024-02-15',
            'Kit Shipped': '2024-02-16',
            'Sample Received': '2024-02-20',
            'Testing': '2024-02-25',
            'Results Ready': '2024-03-01'
          }
        }
      ]);

      // For production
      // const response = await axios.get(`${API_URL}/tests/active/${userId}`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tests');
    }
  },

  // Book a new test
  bookTest: async (testData) => {
    try {
      // Mock response for development
      return Promise.resolve({
        bookingId: `BOOK-${Date.now()}`,
        ...testData,
        status: 'Booked',
        createdAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.post(`${API_URL}/tests/book`, testData, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book test');
    }
  },

  // Get test results
  getTestResults: async (testId) => {
    try {
      // Mock data for development
      return Promise.resolve({
        id: testId,
        testType: 'Paternity DNA Test',
        status: 'Completed',
        date: '2024-03-15',
        referenceNumber: `REF-${testId}`,
        collectionMethod: 'Center',
        collectionDate: '2024-03-10',
        processedBy: 'Dr. Smith',
        details: [
          {
            parameter: 'DNA Match',
            value: '99.99%',
            referenceRange: '> 99.9%'
          },
          {
            parameter: 'Genetic Markers Tested',
            value: '21/21',
            referenceRange: '21'
          }
        ],
        notes: 'Results indicate a positive paternal relationship.'
      });

      // For production
      // const response = await axios.get(`${API_URL}/tests/${testId}/results`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch test results');
    }
  },

  // Update test status
  updateTestStatus: async (testId, status) => {
    try {
      // Mock response for development
      return Promise.resolve({
        id: testId,
        status: status,
        updatedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.put(
      //   `${API_URL}/tests/${testId}/status`,
      //   { status },
      //   getAuthHeader()
      // );
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update test status');
    }
  },

  // Get test progress
  getTestProgress: async (testId) => {
    try {
      // Mock data for development
      return Promise.resolve({
        id: testId,
        status: 'In Progress',
        currentStage: 'Testing',
        stages: [
          {
            name: 'Sample Collection',
            completed: true,
            date: '2024-03-10'
          },
          {
            name: 'Testing',
            completed: false,
            date: null
          },
          {
            name: 'Results',
            completed: false,
            date: null
          }
        ],
        estimatedCompletion: '2024-03-20'
      });

      // For production
      // const response = await axios.get(`${API_URL}/tests/${testId}/progress`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch test progress');
    }
  },

  // Cancel test booking
  cancelTest: async (testId) => {
    try {
      // Mock response for development
      return Promise.resolve({
        success: true,
        message: 'Test booking cancelled successfully'
      });

      // For production
      // const response = await axios.post(`${API_URL}/tests/${testId}/cancel`, {}, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel test');
    }
  },

  // Reschedule test appointment
  rescheduleTest: async (testId, newDate) => {
    try {
      // Mock response for development
      return Promise.resolve({
        id: testId,
        appointmentDate: newDate,
        updatedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.put(
      //   `${API_URL}/tests/${testId}/reschedule`,
      //   { appointmentDate: newDate },
      //   getAuthHeader()
      // );
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reschedule test');
    }
  }
};
