import { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';
import { services } from '../../services/api/services';

const ServiceManager = () => {
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await services.getAllServices();
      setServiceList(data);
    } catch (error) {
      addNotification('Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleDelete = async (service) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await services.deleteService(service.id);
        addNotification('Service deleted successfully', 'success');
        fetchServices();
      } catch (error) {
        addNotification('Failed to delete service', 'error');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedService) {
        await services.updateService(selectedService.id, formData);
        addNotification('Service updated successfully', 'success');
      } else {
        await services.createService(formData);
        addNotification('Service created successfully', 'success');
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      addNotification('Failed to save service', 'error');
    }
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Description', field: 'description' },
    { 
      header: 'Price', 
      field: 'price',
      render: (row) => `$${row.price.toFixed(2)}`
    },
    { 
      header: 'Status', 
      field: 'isActive',
      render: (row) => (
        <span className={`badge bg-${row.isActive ? 'success' : 'danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Edit',
      icon: 'bi-pencil',
      variant: 'primary',
      onClick: handleEdit
    },
    {
      label: 'Delete',
      icon: 'bi-trash',
      variant: 'danger',
      onClick: handleDelete
    }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Service Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedService(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New Service
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable 
            columns={columns}
            data={serviceList}
            actions={actions}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={selectedService ? 'Edit Service' : 'Add New Service'}
      >
        <ServiceForm
          initialData={selectedService}
          onSubmit={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

// Service Form Component
const ServiceForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    duration: '',
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label className="form-label">Price ($)</label>
        <input
          type="number"
          className="form-control"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          step="0.01"
          min="0"
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
          min="1"
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

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default ServiceManager; 