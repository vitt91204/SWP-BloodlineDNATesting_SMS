import { useState, useEffect } from 'react';
import { test } from '../../services/api/test';

const TestProgressTracker = ({ test }) => {
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  const stages = {
    self: ['Kit Ordered', 'Kit Shipped', 'Sample Received', 'Testing', 'Results Ready'],
    center: ['Appointment Scheduled', 'Sample Collected', 'Testing', 'Results Ready'],
    home: ['Appointment Scheduled', 'Visit Scheduled', 'Sample Collected', 'Testing', 'Results Ready']
  };

  useEffect(() => {
    fetchTestProgress();
  }, [test.id]);

  const fetchTestProgress = async () => {
    try {
      const data = await test.getTestProgress(test.id);
      setTestData(data);
    } catch (error) {
      console.error('Failed to fetch test progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentStages = stages[test.collectionMethod];
  const currentStageIndex = currentStages.indexOf(test.currentStage);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title d-flex justify-content-between align-items-center">
          <span>Test Progress</span>
          <span className="badge bg-primary">{test.testType}</span>
        </h5>

        <div className="progress-tracker mt-4">
          {currentStages.map((stage, index) => (
            <div key={stage} className="d-flex align-items-center mb-3">
              <div 
                className={`progress-circle rounded-circle d-flex align-items-center justify-content-center ${
                  index <= currentStageIndex ? 'bg-success' : 'bg-secondary'
                }`}
                style={{ width: '2rem', height: '2rem' }}
              >
                <span className="text-white">{index + 1}</span>
              </div>
              <div className="progress-line flex-grow-1 mx-2">
                {index < currentStages.length - 1 && (
                  <div className="progress" style={{ height: '2px' }}>
                    <div 
                      className={`progress-bar ${index < currentStageIndex ? 'bg-success' : 'bg-secondary'}`}
                      style={{ width: index < currentStageIndex ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
              <div className="progress-label flex-grow-1">
                <p className="mb-0">{stage}</p>
                {test.stageDates?.[stage] && (
                  <small className="text-muted">
                    {new Date(test.stageDates[stage]).toLocaleDateString()}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h6>Additional Information</h6>
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1"><strong>Test ID:</strong> {test.id}</p>
              <p className="mb-1"><strong>Booked Date:</strong> {new Date(test.bookedDate).toLocaleDateString()}</p>
              {test.appointmentDate && (
                <p className="mb-1">
                  <strong>Appointment:</strong> {new Date(test.appointmentDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Collection Method:</strong> {test.collectionMethod}
              </p>
              <p className="mb-1">
                <strong>Expected Completion:</strong> {new Date(test.expectedCompletion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {test.notes && (
          <div className="mt-3">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              {test.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestProgressTracker;
