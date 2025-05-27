import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DNA Testing Service
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/booking">Services</Link>
            </li>
            {/* Add more public navigation items here */}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {/* Customer Links */}
                {user.role === 'CUSTOMER' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/customer/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/customer/history">My Tests</Link>
                    </li>
                  </>
                )}

                {/* Admin Links */}
                {user.role === 'ADMIN' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">Admin Panel</Link>
                    </li>
                  </>
                )}

                {/* Staff Links */}
                {user.role === 'STAFF' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/staff/dashboard">Staff Panel</Link>
                    </li>
                  </>
                )}

                {/* User Menu Dropdown */}
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/customer/profile">
                        Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary text-white" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
