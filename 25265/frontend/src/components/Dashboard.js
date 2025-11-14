import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h2 className="card-title mb-1">
                    Welcome back, {user?.full_name}!
                  </h2>
                  <p className="text-muted mb-0">
                    {getUserTypeDisplay(user?.user_type)} Dashboard
                  </p>
                </div>
                <div className="text-end">
                  <div className="badge bg-success fs-6">
                    <i className="fas fa-check-circle me-1"></i>
                    Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        {user?.user_type === 'farmer' && (
          <>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>{stats.total_products || 0}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>{stats.active_listings || 0}</h3>
                <p>Active Listings</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>{stats.total_orders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>₹{stats.total_revenue || 0}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </>
        )}

        {user?.user_type === 'buyer' && (
          <>
            <div className="col-md-4">
              <div className="stats-card">
                <h3>{stats.total_orders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card">
                <h3>{stats.pending_orders || 0}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card">
                <h3>₹{stats.total_spent || 0}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </>
        )}

        {user?.user_type === 'consumer' && (
          <>
            <div className="col-md-4">
              <div className="stats-card">
                <h3>{stats.total_orders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card">
                <h3>{stats.pending_orders || 0}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card">
                <h3>₹{stats.total_spent || 0}</h3>
                <p>Total Spent</p>
              </div>
            </div>
          </>
        )}

        {user?.user_type === 'admin' && (
          <>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>{stats.total_users || 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>{stats.total_products || 0}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>{stats.total_orders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-card">
                <h3>₹{stats.total_revenue || 0}</h3>
                <p>Platform Revenue</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {user?.user_type === 'farmer' && (
                  <>
                    <div className="col-md-3">
                      <a href="/add-product" className="btn btn-success w-100">
                        <i className="fas fa-plus me-2"></i>
                        Add New Product
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/marketplace" className="btn btn-primary w-100">
                        <i className="fas fa-store me-2"></i>
                        View Marketplace
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/orders" className="btn btn-warning w-100">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Manage Orders
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/schemes" className="btn btn-info w-100">
                        <i className="fas fa-file-alt me-2"></i>
                        Government Schemes
                      </a>
                    </div>
                  </>
                )}

                {user?.user_type === 'buyer' && (
                  <>
                    <div className="col-md-3">
                      <a href="/marketplace" className="btn btn-primary w-100">
                        <i className="fas fa-store me-2"></i>
                        Browse Products
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/orders" className="btn btn-warning w-100">
                        <i className="fas fa-shopping-cart me-2"></i>
                        View Orders
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/market-prices" className="btn btn-success w-100">
                        <i className="fas fa-chart-line me-2"></i>
                        Market Prices
                      </a>
                    </div>
                    <div className="col-md-3">
                      <a href="/profile" className="btn btn-info w-100">
                        <i className="fas fa-user me-2"></i>
                        Update Profile
                      </a>
                    </div>
                  </>
                )}

                {user?.user_type === 'consumer' && (
                  <>
                    <div className="col-md-4">
                      <a href="/marketplace" className="btn btn-primary w-100">
                        <i className="fas fa-store me-2"></i>
                        Shop Millet Products
                      </a>
                    </div>
                    <div className="col-md-4">
                      <a href="/orders" className="btn btn-warning w-100">
                        <i className="fas fa-shopping-cart me-2"></i>
                        My Orders
                      </a>
                    </div>
                    <div className="col-md-4">
                      <a href="/schemes" className="btn btn-info w-100">
                        <i className="fas fa-info-circle me-2"></i>
                        Learn About Millets
                      </a>
                    </div>
                  </>
                )}

                {user?.user_type === 'admin' && (
                  <>
                    <div className="col-md-2">
                      <a href="/marketplace" className="btn btn-primary w-100">
                        <i className="fas fa-store me-2"></i>
                        View Marketplace
                      </a>
                    </div>
                    <div className="col-md-2">
                      <a href="/orders" className="btn btn-warning w-100">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Manage Orders
                      </a>
                    </div>
                    <div className="col-md-2">
                      <a href="/schemes" className="btn btn-info w-100">
                        <i className="fas fa-file-alt me-2"></i>
                        Manage Schemes
                      </a>
                    </div>
                    <div className="col-md-2">
                      <a href="/market-prices" className="btn btn-success w-100">
                        <i className="fas fa-chart-line me-2"></i>
                        Market Data
                      </a>
                    </div>
                    <div className="col-md-2">
                      <a href="/profile" className="btn btn-secondary w-100">
                        <i className="fas fa-users me-2"></i>
                        User Management
                      </a>
                    </div>
                    <div className="col-md-2">
                      <a href="/profile" className="btn btn-dark w-100">
                        <i className="fas fa-cog me-2"></i>
                        Settings
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Welcome to Millets Platform!</h6>
                    <p className="mb-1 text-muted">Your account has been successfully created.</p>
                    <small className="text-muted">Today</small>
                  </div>
                  <span className="badge bg-primary">Account Created</span>
                </div>
                
                {user?.user_type === 'farmer' && (
                  <>
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Add Your First Product</h6>
                        <p className="mb-1 text-muted">Start listing your millet products to connect with buyers.</p>
                        <small className="text-muted">Get Started</small>
                      </div>
                      <a href="/add-product" className="btn btn-sm btn-success">Add Product</a>
                    </div>
                  </>
                )}
                
                {user?.user_type === 'buyer' && (
                  <>
                    <div className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Explore Marketplace</h6>
                        <p className="mb-1 text-muted">Browse available millet products from verified farmers.</p>
                        <small className="text-muted">Start Shopping</small>
                      </div>
                      <a href="/marketplace" className="btn btn-sm btn-primary">Browse</a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
