import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestBookingForm from '../../components/customer/TestBookingForm';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleBookingComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Book a DNA Test</h2>
              
              {/* Progress Steps */}
              <div className="mb-4">
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(step / 3) * 100}%` }}
                    aria-valuenow={step} 
                    aria-valuemin="0" 
                    aria-valuemax="3"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className={step >= 1 ? 'text-primary' : ''}>Select Test</span>
                  <span className={step >= 2 ? 'text-primary' : ''}>Personal Info</span>
                  <span className={step >= 3 ? 'text-primary' : ''}>Confirmation</span>
                </div>
              </div>

              <TestBookingForm onComplete={handleBookingComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 