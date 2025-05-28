import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { test } from '../../services/api/test';

const Progress = () => {
  const { user } = useAuth();
  const [testProgress, setTestProgress] = useState(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTestProgress({
      status: 'in_progress',
      steps: [
        { id: 1, name: 'Kit Received', completed: true, date: '2024-03-10' },
        { id: 2, name: 'Sample Collected', completed: true, date: '2024-03-12' },
        { id: 3, name: 'Lab Processing', completed: false },
        { id: 4, name: 'Results Ready', completed: false }
      ]
    });
  }, []);

  const getStepClass = (completed) => {
    return `progress-step ${completed ? 'completed' : ''}`;
  };

  return (
    <div className="container py-4">
      <h2>Test Progress Tracking</h2>
      
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Current Progress</h5>
          
          {testProgress && (
            <div className="progress-tracker">
              {testProgress.steps.map((step, index) => (
                <div key={step.id} className={getStepClass(step.completed)}>
                  <div className="step-icon">
                    {step.completed ? (
                      <i className="bi bi-check-circle-fill"></i>
                    ) : (
                      <i className="bi bi-circle"></i>
                    )}
                  </div>
                  <div className="step-content">
                    <h6>{step.name}</h6>
                    {step.date && <small className="text-muted">{step.date}</small>}
                  </div>
                  {index < testProgress.steps.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Test Details</h5>
              <div className="mt-3">
                <p><strong>Test Type:</strong> DNA Paternity Test</p>
                <p><strong>Order Date:</strong> March 10, 2024</p>
                <p><strong>Expected Completion:</strong> March 25, 2024</p>
                <p><strong>Status:</strong> <span className="badge bg-primary">In Progress</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Next Steps</h5>
              <div className="mt-3">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Wait for lab processing completion
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Results will be reviewed by our specialists
                  </li>
                  <li>
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    You'll be notified when results are ready
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
