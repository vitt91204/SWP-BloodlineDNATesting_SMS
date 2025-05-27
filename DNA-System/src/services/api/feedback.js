import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const feedback = {
  // Get all feedback
  getAllFeedback: async () => {
    try {
      // For development, return mock data
      return Promise.resolve([
        {
          id: 1,
          userId: 'user123',
          userName: 'John Doe',
          serviceName: 'Paternity DNA Test',
          rating: 5,
          comment: 'Excellent service and fast results!',
          createdAt: '2024-03-15',
          responded: false
        },
        {
          id: 2,
          userId: 'user456',
          userName: 'Jane Smith',
          serviceName: 'Ancestry DNA Test',
          rating: 4,
          comment: 'Good experience overall.',
          createdAt: '2024-03-14',
          responded: true,
          response: 'Thank you for your feedback!'
        }
      ]);

      // For production
      // const response = await axios.get(`${API_URL}/feedback`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
    }
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    try {
      // For development
      return Promise.resolve({
        id: id,
        userId: 'user123',
        userName: 'John Doe',
        serviceName: 'Paternity DNA Test',
        rating: 5,
        comment: 'Excellent service and fast results!',
        createdAt: '2024-03-15',
        responded: false
      });

      // For production
      // const response = await axios.get(`${API_URL}/feedback/${id}`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
    }
  },

  // Create new feedback
  createFeedback: async (data) => {
    try {
      // For development
      return Promise.resolve({
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        responded: false
      });

      // For production
      // const response = await axios.post(`${API_URL}/feedback`, data, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create feedback');
    }
  },

  // Respond to feedback
  respondToFeedback: async (id, response) => {
    try {
      // For development
      return Promise.resolve({
        id: id,
        response: response,
        responded: true,
        respondedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.post(
      //   `${API_URL}/feedback/${id}/respond`,
      //   { response },
      //   getAuthHeader()
      // );
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to respond to feedback');
    }
  },

  // Get feedback statistics
  getFeedbackStats: async () => {
    try {
      // For development
      return Promise.resolve({
        totalCount: 150,
        averageRating: 4.5,
        ratingDistribution: {
          5: 80,
          4: 40,
          3: 20,
          2: 7,
          1: 3
        },
        pendingResponses: 25
      });

      // For production
      // const response = await axios.get(`${API_URL}/feedback/stats`, getAuthHeader());
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback statistics');
    }
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    try {
      // For development
      return Promise.resolve({ success: true });

      // For production
      // await axios.delete(`${API_URL}/feedback/${id}`, getAuthHeader());
      // return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete feedback');
    }
  },

  // Update feedback status
  updateFeedbackStatus: async (id, status) => {
    try {
      // For development
      return Promise.resolve({
        id: id,
        status: status,
        updatedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.patch(
      //   `${API_URL}/feedback/${id}/status`,
      //   { status },
      //   getAuthHeader()
      // );
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update feedback status');
    }
  }
}; 