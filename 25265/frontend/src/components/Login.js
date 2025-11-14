import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit}>
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
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Sign up here
                  </Link>
                </p>
              </div>

              <div className="mt-4">
                <div className="text-center">
                  <h6 className="text-muted mb-3">Demo Accounts</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        className="btn btn-outline-success btn-sm w-100"
                        onClick={() => setFormData({ email: 'farmer@example.com', password: 'farmer123' })}
                      >
                        Farmer
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => setFormData({ email: 'buyer@example.com', password: 'buyer123' })}
                      >
                        Buyer
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-warning btn-sm w-100"
                        onClick={() => setFormData({ email: 'admin@milletsplatform.com', password: 'admin123' })}
                      >
                        Admin
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-info btn-sm w-100"
                        onClick={() => setFormData({ email: 'consumer@example.com', password: 'consumer123' })}
                      >
                        Consumer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
