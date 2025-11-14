import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    address: '',
    state: '',
    district: '',
    user_type: 'farmer',
    farm_size: '',
    millet_types: '',
    business_type: '',
    license_number: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    // Prepare data for submission
    const submitData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone,
      address: formData.address,
      state: formData.state,
      district: formData.district,
      user_type: formData.user_type,
      farm_size: formData.farm_size ? parseFloat(formData.farm_size) : null,
      millet_types: formData.millet_types,
      business_type: formData.business_type,
      license_number: formData.license_number
    };

    const result = await register(submitData);
    
    if (result.success) {
      toast.success(result.message);
      navigate('/login');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark">Join Our Platform</h2>
                <p className="text-muted">Create your account to get started</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
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
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

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
                      <label htmlFor="user_type" className="form-label">User Type</label>
                      <select
                        className="form-control"
                        id="user_type"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="farmer">Farmer</option>
                        <option value="buyer">Buyer/Processor</option>
                        <option value="consumer">Consumer</option>
                        <option value="logistics">Logistics Provider</option>
                      </select>
                    </div>
                  </div>
                </div>

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

                <div className="row">
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
                </div>

                {/* Conditional fields based on user type */}
                {formData.user_type === 'farmer' && (
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

                {formData.user_type === 'buyer' && (
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
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
