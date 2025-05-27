const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const spinnerSize = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  return (
    <div className="text-center">
      <div 
        className={`spinner-border text-${color} ${spinnerSize[size]}`} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
