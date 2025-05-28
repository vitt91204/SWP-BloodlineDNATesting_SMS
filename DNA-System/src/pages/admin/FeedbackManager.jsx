import { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import { useNotification } from '../../context/NotificationContext';
import { feedback } from '../../services/api/feedback';

const FeedbackManager = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await feedback.getAllFeedback();
      setFeedbackList(data);
    } catch (error) {
      addNotification('Failed to fetch feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (feedbackItem) => {
    try {
      const response = prompt('Enter your response:');
      if (response) {
        await feedback.respondToFeedback(feedbackItem.id, response);
        addNotification('Response sent successfully', 'success');
        fetchFeedback();
      }
    } catch (error) {
      addNotification('Failed to send response', 'error');
    }
  };

  const columns = [
    { 
      header: 'Date', 
      field: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    { header: 'User', field: 'userName' },
    { header: 'Service', field: 'serviceName' },
    { 
      header: 'Rating', 
      field: 'rating',
      render: (row) => (
        <div className="d-flex align-items-center">
          <span className="me-2">{row.rating}</span>
          {'★'.repeat(row.rating)}{'☆'.repeat(5-row.rating)}
        </div>
      )
    },
    { header: 'Comment', field: 'comment' },
    {
      header: 'Status',
      field: 'status',
      render: (row) => (
        <span className={`badge bg-${row.responded ? 'success' : 'warning'}`}>
          {row.responded ? 'Responded' : 'Pending'}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Respond',
      icon: 'bi-reply',
      variant: 'primary',
      onClick: handleRespond
    }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Feedback Management</h1>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Average Rating</h5>
              <p className="display-4">
                {feedbackList.length > 0 
                  ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Feedback</h5>
              <p className="display-4">{feedbackList.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pending Responses</h5>
              <p className="display-4">
                {feedbackList.filter(f => !f.responded).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={feedbackList}
            actions={actions}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackManager; 