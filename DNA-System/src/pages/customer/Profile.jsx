import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      addNotification('Profile updated successfully', 'success');
    } catch (error) {
      addNotification('Failed to update profile', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      addNotification('New passwords do not match', 'error');
      return;
    }
    try {
      // Implement password change logic
      addNotification('Password changed successfully', 'success');
      setChangePassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      addNotification('Failed to change password', 'error');
    }
  };

  return (
    <div className="container py-4">
      <h2>Profile Settings</h2>
      
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Personal Information</h5>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Change Password</h5>
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={changePassword.currentPassword}
                    onChange={(e) => setChangePassword({...changePassword, currentPassword: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={changePassword.newPassword}
                    onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={changePassword.confirmPassword}
                    onChange={(e) => setChangePassword({...changePassword, confirmPassword: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Account Information</h5>
              <div className="mb-3">
                <strong>Account Type:</strong>
                <p className="text-muted">Customer</p>
              </div>
              <div className="mb-3">
                <strong>Member Since:</strong>
                <p className="text-muted">March 2024</p>
              </div>
              <div className="mb-3">
                <strong>Last Login:</strong>
                <p className="text-muted">Today at 9:30 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
