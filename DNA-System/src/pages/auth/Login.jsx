import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to '/'
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await login(formData);
      addNotification('Login successful!', 'success');
      
      // Navigate to the page user tried to access, or home
      navigate(from, { replace: true });
    } catch (error) {
      addNotification(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : 'Login'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">Don't have an account? <Link to="/register">Register</Link></p>
                <Link to="/forgot-password" className="text-muted">Forgot Password?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 