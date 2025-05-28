import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const getServices = () => {
  return api.get('/services');
};

export const postBooking = (data) => {
  return api.post('/bookings', data);
};

export const getResultsByUser = (userId) => {
  return api.get(`/results/${userId}`);
};

export const postFeedback = (feedback) => {
  return api.post('/feedback', feedback);
};
