import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { services } from '../../services/api/services';

const ServiceEditor = ({ serviceId = null, onSave }) => {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    isActive: true
  });

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const data = await services.getServiceById(serviceId);
      setFormData(data);
    } catch (error) {
      addNotification('Failed to fetch service details', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (serviceId) {
        await services.updateService(serviceId, formData);
        addNotification('Service updated successfully', 'success');
      } else {
        await services.createService(formData);
        addNotification('Service created successfully', 'success');
      }
      onSave();
    } catch (error) {
      addNotification(error.message || 'Failed to save service', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h5 className="card-title mb-4">
        {serviceId ? 'Edit Service' : 'Create New Service'}
      </h5>

      <div className="mb-3">
        <label className="form-label">Service Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Duration (days)</label>
        <input
          type="number"
          className="form-control"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: e.target.value})}
          required
        />
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
        />
        <label className="form-check-label" htmlFor="isActive">Active</label>
      </div>

      <button type="submit" className="btn btn-primary">
        {serviceId ? 'Update Service' : 'Create Service'}
      </button>
    </form>
  );
};

export default ServiceEditor; 