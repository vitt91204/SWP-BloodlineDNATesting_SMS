// Mock data
const services = [
  {
    id: 1,
    name: 'Paternity DNA Test',
    description: 'Determine biological relationship between alleged father and child',
    price: 299.99,
    duration: '5-7 business days'
  },
  {
    id: 2,
    name: 'Ancestry DNA Test',
    description: 'Discover your genetic heritage and ancestry composition',
    price: 199.99,
    duration: '14-21 business days'
  },
  // Add more services as needed
];

const results = [
  {
    id: 1,
    userId: 'user123',
    testId: 1,
    status: 'completed',
    result: 'Positive match (99.99%)',
    date: '2024-03-15'
  }
];

// Mock API functions
export const getServices = () => {
  return Promise.resolve(services);
};

export const postBooking = (data) => {
  return Promise.resolve({ 
    success: true, 
    bookingId: Math.random().toString(36).substr(2, 9),
    ...data 
  });
};

export const getResultsByUser = (userId) => {
  const userResults = results.filter(r => r.userId === userId);
  return Promise.resolve(userResults);
};

export const postFeedback = (feedback) => {
  return Promise.resolve({ 
    success: true, 
    feedbackId: Math.random().toString(36).substr(2, 9),
    ...feedback 
  });
};
