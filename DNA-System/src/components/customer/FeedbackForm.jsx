import { useState } from 'react';
import { postFeedback } from '../../services/api';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postFeedback(feedback);
      alert('Thank you for your feedback!');
      setFeedback({ rating: 5, comment: '' });
    } catch (error) {
      alert('Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h3>Your Feedback</h3>
      <div className="mb-3">
        <label className="form-label">Rating</label>
        <select 
          className="form-select"
          value={feedback.rating}
          onChange={(e) => setFeedback({...feedback, rating: e.target.value})}
        >
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Comments</label>
        <textarea
          className="form-control"
          value={feedback.comment}
          onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
          rows="3"
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;
