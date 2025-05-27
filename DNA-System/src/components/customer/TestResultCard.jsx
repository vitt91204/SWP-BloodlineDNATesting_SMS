import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const TestResultCard = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addNotification } = useNotification();

  const handleDownload = () => {
    // Implement download logic here
    addNotification('Downloading result...', 'info');
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      completed: 'success',
      pending: 'warning',
      processing: 'info',
      failed: 'danger'
    };
    return colors[status.toLowerCase()] || 'secondary';
  };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Test Result #{result.id}</h5>
        <span className={`badge bg-${getStatusBadgeColor(result.status)}`}>
          {result.status}
        </span>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <p className="mb-1"><strong>Test Type:</strong> {result.testType}</p>
            <p className="mb-1"><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
            <p className="mb-1"><strong>Reference:</strong> {result.referenceNumber}</p>
          </div>
          <div className="col-md-6">
            <p className="mb-1"><strong>Collection Method:</strong> {result.collectionMethod}</p>
            <p className="mb-1"><strong>Collected On:</strong> {new Date(result.collectionDate).toLocaleDateString()}</p>
            <p className="mb-1"><strong>Processed By:</strong> {result.processedBy}</p>
          </div>
        </div>

        {showDetails && (
          <div className="result-details border-top pt-3">
            <h6>Detailed Results</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {result.details?.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.parameter}</td>
                      <td>{detail.value}</td>
                      <td>{detail.referenceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.notes && (
              <div className="mt-3">
                <h6>Notes</h6>
                <p className="text-muted">{result.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <div className="btn-group">
            <button
              className="btn btn-primary"
              onClick={handleDownload}
            >
              <i className="bi bi-download me-2"></i>
              Download PDF
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-2"></i>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultCard; 