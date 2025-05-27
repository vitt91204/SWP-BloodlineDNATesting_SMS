const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder = '',
  helpText = ''
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {helpText && <div className="form-text">{helpText}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput; 