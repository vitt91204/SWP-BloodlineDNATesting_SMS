import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const services = {
  getAllServices: async () => {
    try {
      // Mock data for development
      return Promise.resolve([
        {
          id: 1,
          name: 'Paternity DNA Test',
          description: 'Determine biological relationship between alleged father and child',
          price: 299.99,
          duration: '5-7 business days',
          isActive: true
        },
        {
          id: 2,
          name: 'Ancestry DNA Test',
          description: 'Discover your genetic heritage and ancestry composition',
          price: 199.99,
          duration: '14-21 business days',
          isActive: true
        }
      ]);

      // For production
      // const response = await axios.get(`${API_URL}/services`);
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch services');
    }
  },

  getServiceById: async (id) => {
    try {
      // Mock data
      return Promise.resolve({
        id: id,
        name: 'Paternity DNA Test',
        description: 'Determine biological relationship between alleged father and child',
        price: 299.99,
        duration: '5-7 business days',
        isActive: true
      });

      // For production
      // const response = await axios.get(`${API_URL}/services/${id}`);
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service');
    }
  },

  createService: async (serviceData) => {
    try {
      // Mock response
      return Promise.resolve({
        id: Date.now(),
        ...serviceData,
        createdAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.post(`${API_URL}/services`, serviceData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create service');
    }
  },

  updateService: async (id, serviceData) => {
    try {
      // Mock response
      return Promise.resolve({
        id: id,
        ...serviceData,
        updatedAt: new Date().toISOString()
      });

      // For production
      // const response = await axios.put(`${API_URL}/services/${id}`, serviceData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update service');
    }
  },

  deleteService: async (id) => {
    try {
      // Mock response
      return Promise.resolve({ success: true });

      // For production
      // await axios.delete(`${API_URL}/services/${id}`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete service');
    }
  }
}; 