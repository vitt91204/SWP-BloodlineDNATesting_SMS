import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Simulate API call to validate token and get user data
        const userData = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER'
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Simulate API call
      const response = {
        token: 'fake-token-123',
        user: {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          role: 'CUSTOMER'
        }
      };

      localStorage.setItem('token', response.token);
      setUser(response.user);
      addNotification('Login successful!', 'success');
      navigate('/dashboard');
      return response;
    } catch (error) {
      addNotification(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      const response = {
        token: 'fake-token-123',
        user: {
          id: '1',
          ...userData,
          role: 'CUSTOMER'
        }
      };

      localStorage.setItem('token', response.token);
      setUser(response.user);
      addNotification('Registration successful!', 'success');
      navigate('/dashboard');
      return response;
    } catch (error) {
      addNotification(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    addNotification('Logged out successfully', 'info');
    navigate('/');
  };

  const updateProfile = async (userData) => {
    try {
      // Simulate API call
      const updatedUser = {
        ...user,
        ...userData
      };
      setUser(updatedUser);
      addNotification('Profile updated successfully', 'success');
      return updatedUser;
    } catch (error) {
      addNotification(error.message || 'Profile update failed', 'error');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'STAFF',
    isManager: user?.role === 'MANAGER'
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based route protection
export const ROLES = {
  GUEST: 'GUEST',
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN'
}; 