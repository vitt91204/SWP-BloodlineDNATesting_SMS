const Alert = ({ type = 'info', message, onClose }) => {
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          data-bs-dismiss="alert" 
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default Alert; 