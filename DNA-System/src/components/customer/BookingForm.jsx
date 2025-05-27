import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { test } from '../../services/api/test';

const BookingForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    testType: '',
    collectionMethod: '',
    appointmentDate: '',
    appointmentTime: '',
    location: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    additionalInfo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await test.bookTest(formData);
      addNotification('Booking successful!', 'success');
      navigate(`/booking/confirmation/${response.bookingId}`);
    } catch (error) {
      addNotification(error.message || 'Booking failed', 'error');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h5>Select Test Type</h5>
            <div className="mb-3">
              <select
                className="form-select"
                value={formData.testType}
                onChange={(e) => setFormData({...formData, testType: e.target.value})}
                required
              >
                <option value="">Choose a test type</option>
                <option value="paternity">Paternity DNA Test</option>
                <option value="ancestry">Ancestry DNA Test</option>
                <option value="health">Health DNA Test</option>
              </select>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h5>Personal Information</h5>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.personalInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: {...formData.personalInfo, name: e.target.value}
                })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: {...formData.personalInfo, email: e.target.value}
                })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: {...formData.personalInfo, phone: e.target.value}
                })}
                required
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h5>Collection Method & Appointment</h5>
            <div className="mb-3">
              <label className="form-label">Collection Method</label>
              <select
                className="form-select"
                value={formData.collectionMethod}
                onChange={(e) => setFormData({...formData, collectionMethod: e.target.value})}
                required
              >
                <option value="">Choose collection method</option>
                <option value="self">Self Collection Kit</option>
                <option value="center">At Medical Center</option>
                <option value="home">Home Visit</option>
              </select>
            </div>
            {formData.collectionMethod !== 'self' && (
              <>
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
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          <div className="d-flex justify-content-between mt-4">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-success">
                Confirm Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 