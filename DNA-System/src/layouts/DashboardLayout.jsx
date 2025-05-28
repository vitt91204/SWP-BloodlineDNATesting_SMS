import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="Logo" className="img-fluid mb-3" style={{ maxWidth: '120px' }} />
              <h5 className="text-muted">Welcome, {user.name}</h5>
            </div>

            <ul className="nav flex-column">
              <li className="nav-item">
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/tests" 
                  className={`nav-link ${location.pathname.includes('/tests') ? 'active' : ''}`}
                >
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  Tests
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/appointments" 
                  className={`nav-link ${location.pathname.includes('/appointments') ? 'active' : ''}`}
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Appointments
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/profile" 
                  className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Link>
              </li>
            </ul>

            <hr className="my-3" />

            <button 
              onClick={logout}
              className="btn btn-outline-danger w-100"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 