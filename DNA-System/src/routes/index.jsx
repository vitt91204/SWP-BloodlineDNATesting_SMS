import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import App from '../App';
import Home from '../pages/guest/Home';
import Booking from '../pages/guest/Booking';
import Result from '../pages/guest/Result';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/admin/Dashboard';
import ServiceManager from '../pages/admin/ServiceManager';
import FeedbackManager from '../pages/admin/FeedbackManager';
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerProgress from '../pages/customer/Progress';
import CustomerProfile from '../pages/customer/Profile';
import CustomerHistory from '../pages/customer/History';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { ROLES } from '../context/AuthContext';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Home />
          },
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          },
          {
            path: 'booking',
            element: <Booking />
          },
          {
            path: 'results/:testId',
            element: <Result />
          },
          {
            path: 'customer',
            element: <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />,
            children: [
              {
                path: 'dashboard',
                element: <CustomerDashboard />
              },
              {
                path: 'progress',
                element: <CustomerProgress />
              },
              {
                path: 'profile',
                element: <CustomerProfile />
              },
              {
                path: 'history',
                element: <CustomerHistory />
              }
            ]
          },
          {
            path: 'admin',
            element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
            children: [
              {
                path: 'dashboard',
                element: <Dashboard />
              },
              {
                path: 'services',
                element: <ServiceManager />
              },
              {
                path: 'feedback',
                element: <FeedbackManager />
              }
            ]
          }
        ]
      }
    ]
  }
]);
