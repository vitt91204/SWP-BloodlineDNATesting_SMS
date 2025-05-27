const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {steps.map((step, index) => (
        <div key={index} className="d-flex align-items-center">
          <div className={`rounded-circle p-3 ${
            index < currentStep ? 'bg-success' : 
            index === currentStep ? 'bg-primary' : 'bg-secondary'
          }`}>
            <span className="text-white">{index + 1}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-grow-1 mx-2 border-top border-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
