import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    district: '',
    farm_size: '',
    millet_types: '',
    business_type: '',
    license_number: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        district: user.district || '',
        farm_size: user.farm_size || '',
        millet_types: user.millet_types || '',
        business_type: user.business_type || '',
        license_number: user.license_number || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeDisplay = (type) => {
    const types = {
      'farmer': 'Farmer',
      'buyer': 'Buyer/Processor',
      'consumer': 'Consumer',
      'admin': 'Administrator',
      'logistics': 'Logistics Provider'
    };
    return types[type] || type;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark">Profile Settings</h2>
              <p className="text-muted">Manage your account information and preferences</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                {getUserTypeDisplay(user?.user_type)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user-edit me-2"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="full_name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                      <div className="form-text">Email cannot be changed</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="state" className="form-label">State</label>
                      <select
                        className="form-control"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="district" className="form-label">District</label>
                      <input
                        type="text"
                        className="form-control"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Conditional fields based on user type */}
                {user?.user_type === 'farmer' && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="farm_size" className="form-label">Farm Size (acres)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            id="farm_size"
                            name="farm_size"
                            value={formData.farm_size}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="millet_types" className="form-label">Millet Types (comma separated)</label>
                          <input
                            type="text"
                            className="form-control"
                            id="millet_types"
                            name="millet_types"
                            value={formData.millet_types}
                            onChange={handleChange}
                            placeholder="e.g., Pearl Millet, Finger Millet"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {user?.user_type === 'buyer' && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="business_type" className="form-label">Business Type</label>
                          <select
                            className="form-control"
                            id="business_type"
                            name="business_type"
                            value={formData.business_type}
                            onChange={handleChange}
                          >
                            <option value="">Select Business Type</option>
                            <option value="Food Processor">Food Processor</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Exporter">Exporter</option>
                            <option value="Wholesaler">Wholesaler</option>
                            <option value="Restaurant">Restaurant</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="license_number" className="form-label">License Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="license_number"
                            name="license_number"
                            value={formData.license_number}
                            onChange={handleChange}
                            placeholder="FSSAI License Number"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Account Information
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-user fa-2x text-white"></i>
                </div>
              </div>
              
              <div className="text-center mb-3">
                <h5>{user?.full_name}</h5>
                <p className="text-muted">{user?.email}</p>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Account Type:</span>
                  <span className="fw-bold">{getUserTypeDisplay(user?.user_type)}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Verification Status:</span>
                  <span className="badge bg-success">Verified</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Member Since:</span>
                  <span className="fw-bold">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              
              <hr />
              
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-key me-2"></i>
                  Change Password
                </button>
                <button className="btn btn-outline-warning">
                  <i className="fas fa-download me-2"></i>
                  Download Data
                </button>
                <button className="btn btn-outline-danger">
                  <i className="fas fa-trash me-2"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
