import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Marketplace = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    state: '',
    organic: false,
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.organic) queryParams.append('organic', 'true');
      if (filters.sortBy) queryParams.append('sort', filters.sortBy);

      const response = await fetch(`/api/products?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getProductImage = (product) => {
    // Placeholder image based on millet type
    const imageMap = {
      'Pearl Millet': 'https://via.placeholder.com/300x200/4a7c59/ffffff?text=Pearl+Millet',
      'Finger Millet': 'https://via.placeholder.com/300x200/2c5530/ffffff?text=Finger+Millet',
      'Foxtail Millet': 'https://via.placeholder.com/300x200/28a745/ffffff?text=Foxtail+Millet',
      'Little Millet': 'https://via.placeholder.com/300x200/ffc107/ffffff?text=Little+Millet',
      'Proso Millet': 'https://via.placeholder.com/300x200/fd7e14/ffffff?text=Proso+Millet'
    };
    return imageMap[product.type] || 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Millet';
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
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark">Millet Marketplace</h2>
              <p className="text-muted">Discover high-quality millet products from verified farmers</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                {products.length} Products Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Millet Type</label>
                  <select
                    className="form-control"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Pearl Millet">Pearl Millet</option>
                    <option value="Finger Millet">Finger Millet</option>
                    <option value="Foxtail Millet">Foxtail Millet</option>
                    <option value="Little Millet">Little Millet</option>
                    <option value="Proso Millet">Proso Millet</option>
                    <option value="Barnyard Millet">Barnyard Millet</option>
                    <option value="Kodo Millet">Kodo Millet</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">State</label>
                  <select
                    className="form-control"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <option value="">All States</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-control"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="quantity">Quantity Available</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="organic"
                      checked={filters.organic}
                      onChange={(e) => handleFilterChange('organic', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="organic">
                      Organic Certified Only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12">
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No products found</h5>
                <p className="text-muted">Try adjusting your filters or check back later.</p>
              </div>
            </div>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card product-card h-100">
                <img
                  src={getProductImage(product)}
                  className="card-img-top product-image"
                  alt={product.name}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title text-truncate">{product.name}</h6>
                    {product.organic_certified && (
                      <span className="badge bg-success">Organic</span>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">{product.type}</span>
                    <span className="badge bg-secondary">{product.variety}</span>
                  </div>
                  
                  <p className="card-text text-muted small mb-2">
                    <i className="fas fa-user me-1"></i>
                    {product.farmer_name}
                  </p>
                  
                  <div className="mb-2">
                    <span className="price-tag">
                      ₹{product.price_per_unit}/{product.unit}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="fas fa-box me-1"></i>
                      {product.quantity} {product.unit} available
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      Harvested: {new Date(product.harvest_date).toLocaleDateString()}
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="fas fa-star me-1"></i>
                      Quality Grade: <span className="badge bg-warning">{product.quality_grade}</span>
                    </small>
                  </div>
                  
                  {product.description && (
                    <p className="card-text small text-muted mb-3">
                      {product.description.substring(0, 100)}...
                    </p>
                  )}
                  
                  <div className="mt-auto">
                    <div className="d-flex gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-primary flex-grow-1"
                      >
                        <i className="fas fa-eye me-1"></i>
                        View Details
                      </Link>
                      <Link
                        to={`/traceability/${product.id}`}
                        className="btn btn-outline-info"
                        title="View Traceability"
                      >
                        <i className="fas fa-search"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-primary text-white">
              <div className="card-body text-center py-5">
                <h4 className="mb-3">Ready to Start Trading?</h4>
                <p className="mb-4">
                  Join our platform to buy and sell millet products with complete traceability and secure payments.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/register" className="btn btn-light btn-lg">
                    <i className="fas fa-user-plus me-2"></i>
                    Sign Up Now
                  </Link>
                  <Link to strict="/login" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
