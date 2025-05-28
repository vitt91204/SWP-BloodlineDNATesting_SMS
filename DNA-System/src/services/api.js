import * as mockApi from './mockApi';
import * as realApi from './realApi';

const api = import.meta.env.VITE_USE_MOCK === 'true' ? mockApi : realApi;

export const {
  getServices,
  postBooking,
  getResultsByUser,
  postFeedback
} = api;
