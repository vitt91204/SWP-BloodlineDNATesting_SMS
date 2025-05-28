import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { test } from '../../services/api/test';

const TestBookingForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    testType: '',
    collectionMethod: '',
    appointmentDate: '',
    appointmentTime: '',
    address: '',
    specialRequirements: ''
  });

  const collectionMethods = [
    { id: 'self', label: 'Self Collection Kit' },
    { id: 'center', label: 'At Medical Center' },
    { id: 'home', label: 'Home Visit' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await test.bookTest(formData);
      addNotification('Test booked successfully!', 'success');
      navigate('/customer/progress');
    } catch (error) {
      addNotification(error.message || 'Booking failed', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="mb-3">
        <label className="form-label">Test Type</label>
        <select 
          className="form-select"
          value={formData.testType}
          onChange={(e) => setFormData({...formData, testType: e.target.value})}
          required
        >
          <option value="">Select Test Type</option>
          <option value="paternity">Paternity DNA Test</option>
          <option value="ancestry">Ancestry DNA Test</option>
          <option value="health">Health DNA Test</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Collection Method</label>
        {collectionMethods.map(method => (
          <div key={method.id} className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="collectionMethod"
              id={method.id}
              value={method.id}
              checked={formData.collectionMethod === method.id}
              onChange={(e) => setFormData({...formData, collectionMethod: e.target.value})}
              required
            />
            <label className="form-check-label" htmlFor={method.id}>
              {method.label}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Appointment Date</label>
        <input
          type="date"
          className="form-control"
          value={formData.appointmentDate}
          onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Preferred Time</label>
        <input
          type="time"
          className="form-control"
          value={formData.appointmentTime}
          onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
          required
        />
      </div>

      {formData.collectionMethod === 'home' && (
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows="3"
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Special Requirements</label>
        <textarea
          className="form-control"
          value={formData.specialRequirements}
          onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Book Test
      </button>
    </form>
  );
};

export default TestBookingForm;
