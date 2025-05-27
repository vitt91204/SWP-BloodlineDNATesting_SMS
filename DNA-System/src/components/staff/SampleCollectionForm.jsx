import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { test } from '../../services/api/test';

const SampleCollectionForm = ({ appointment, onComplete }) => {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    sampleId: '',
    collectionNotes: '',
    collectorName: '',
    collectionTime: new Date().toISOString(),
    sampleCondition: 'good'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await test.recordSampleCollection({
        appointmentId: appointment.id,
        ...formData
      });
      addNotification('Sample collection recorded successfully', 'success');
      onComplete();
    } catch (error) {
      addNotification(error.message || 'Failed to record sample collection', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h5 className="card-title mb-4">Record Sample Collection</h5>
      
      <div className="mb-3">
        <label className="form-label">Sample ID</label>
        <input
          type="text"
          className="form-control"
          value={formData.sampleId}
          onChange={(e) => setFormData({...formData, sampleId: e.target.value})}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Sample Condition</label>
        <select
          className="form-select"
          value={formData.sampleCondition}
          onChange={(e) => setFormData({...formData, sampleCondition: e.target.value})}
          required
        >
          <option value="good">Good</option>
          <option value="damaged">Damaged</option>
          <option value="insufficient">Insufficient</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Collector Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.collectorName}
          onChange={(e) => setFormData({...formData, collectorName: e.target.value})}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Collection Notes</label>
        <textarea
          className="form-control"
          value={formData.collectionNotes}
          onChange={(e) => setFormData({...formData, collectionNotes: e.target.value})}
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Record Collection
      </button>
    </form>
  );
};

export default SampleCollectionForm; 