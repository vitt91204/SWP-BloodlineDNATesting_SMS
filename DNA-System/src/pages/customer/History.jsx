import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const History = () => {
  const { user } = useAuth();
  const [testHistory, setTestHistory] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    setTestHistory([
      {
        id: 1,
        type: 'DNA Paternity Test',
        date: '2024-03-10',
        status: 'In Progress',
        result: null
      },
      {
        id: 2,
        type: 'DNA Ancestry Test',
        date: '2024-02-15',
        status: 'Completed',
        result: 'Available'
      },
      {
        id: 3,
        type: 'Genetic Health Screen',
        date: '2024-01-20',
        status: 'Completed',
        result: 'Available'
      }
    ]);
  }, []);

  const filteredTests = filter === 'all' 
    ? testHistory 
    : testHistory.filter(test => test.status.toLowerCase() === filter);

  return (
    <div className="container py-4">
      <h2>Test History</h2>
      
      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <select 
                className="form-select" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Tests</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
            </div>
            <Link to="/booking" className="btn btn-primary">
              Book New Test
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Test Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map(test => (
                  <tr key={test.id}>
                    <td>{test.type}</td>
                    <td>{test.date}</td>
                    <td>
                      <span className={`badge ${test.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>
                        {test.status}
                      </span>
                    </td>
                    <td>
                      {test.result ? (
                        <span className="text-success">Available</span>
                      ) : (
                        <span className="text-muted">Pending</span>
                      )}
                    </td>
                    <td>
                      {test.status === 'In Progress' ? (
                        <Link to={`/customer/progress`} className="btn btn-sm btn-outline-primary me-2">
                          View Progress
                        </Link>
                      ) : (
                        <Link to={`/results/${test.id}`} className="btn btn-sm btn-outline-success me-2">
                          View Results
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
