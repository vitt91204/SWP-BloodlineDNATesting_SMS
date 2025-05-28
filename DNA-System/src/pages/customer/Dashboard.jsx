import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentTests, setRecentTests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setRecentTests([
      {
        id: 1,
        type: 'DNA Paternity Test',
        date: '2024-03-10',
        status: 'In Progress'
      },
      {
        id: 2,
        type: 'DNA Ancestry Test',
        date: '2024-02-15',
        status: 'Completed'
      }
    ]);

    setUpcomingAppointments([
      {
        id: 1,
        type: 'Sample Collection',
        date: '2024-03-20',
        time: '10:00 AM',
        location: 'Main Lab'
      }
    ]);
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name}</h2>
        <Link to="/booking" className="btn btn-primary">
          Book New Test
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Recent Tests</h5>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Test Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTests.map(test => (
                      <tr key={test.id}>
                        <td>{test.type}</td>
                        <td>{test.date}</td>
                        <td>
                          <span className={`badge ${test.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>
                            {test.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/customer/progress`} className="btn btn-sm btn-outline-primary">
                            View Progress
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Upcoming Appointments</h5>
              {upcomingAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map(appointment => (
                        <tr key={appointment.id}>
                          <td>{appointment.type}</td>
                          <td>{appointment.date}</td>
                          <td>{appointment.time}</td>
                          <td>{appointment.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/booking" className="btn btn-outline-primary">
                  Book New Test
                </Link>
                <Link to="/customer/history" className="btn btn-outline-secondary">
                  View Test History
                </Link>
                <Link to="/customer/profile" className="btn btn-outline-secondary">
                  Update Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Need Help?</h5>
              <p className="card-text">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="d-grid">
                <a href="tel:1234567890" className="btn btn-outline-info">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
