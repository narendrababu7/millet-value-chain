import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    delivery_address: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products`);
      if (response.ok) {
        const products = await response.json();
        const productData = products.find(p => p.id === parseInt(id));
        setProduct(productData);
      }
    } catch (error) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (parseFloat(orderForm.quantity) > product.quantity) {
      toast.error('Insufficient quantity available');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: parseFloat(orderForm.quantity),
          delivery_address: orderForm.delivery_address
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const getProductImage = (product) => {
    const imageMap = {
      'Pearl Millet': 'https://via.placeholder.com/500x300/4a7c59/ffffff?text=Pearl+Millet',
      'Finger Millet': 'https://via.placeholder.com/500x300/2c5530/ffffff?text=Finger+Millet',
      'Foxtail Millet': 'https://via.placeholder.com/500x300/28a745/ffffff?text=Foxtail+Millet',
      'Little Millet': 'https://via.placeholder.com/500x300/ffc107/ffffff?text=Little+Millet',
      'Proso Millet': 'https://via.placeholder.com/500x300/fd7e14/ffffff?text=Proso+Millet'
    };
    return imageMap[product.type] || 'https://via.placeholder.com/500x300/6c757d/ffffff?text=Millet';
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

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-danger">Product Not Found</h5>
                <p>The product you're looking for doesn't exist.</p>
                <a href="/marketplace" className="btn btn-primary">Back to Marketplace</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <img
              src={getProductImage(product)}
              className="card-img-top"
              alt={product.name}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="card-title">{product.name}</h2>
                {product.organic_certified && (
                  <span className="badge bg-success fs-6">Organic Certified</span>
                )}
              </div>
              
              <div className="mb-3">
                <span className="badge bg-primary me-2">{product.type}</span>
                <span className="badge bg-secondary">{product.variety}</span>
              </div>
              
              <div className="price-tag fs-4 mb-3">
                ₹{product.price_per_unit} per {product.unit}
              </div>
              
              <div className="row mb-3">
                <div className="col-6">
                  <strong>Farmer:</strong><br />
                  <span className="text-muted">{product.farmer_name}</span>
                </div>
                <div className="col-6">
                  <strong>Quality Grade:</strong><br />
                  <span className="badge bg-warning">{product.quality_grade}</span>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-6">
                  <strong>Available Quantity:</strong><br />
                  <span className="text-success fw-bold">{product.quantity} {product.unit}</span>
                </div>
                <div className="col-6">
                  <strong>Harvest Date:</strong><br />
                  <span className="text-muted">{new Date(product.harvest_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              {product.moisture_content && (
                <div className="row mb-3">
                  <div className="col-6">
                    <strong>Moisture Content:</strong><br />
                    <span className="text-muted">{product.moisture_content}%</span>
                  </div>
                  <div className="col-6">
                    <strong>Protein Content:</strong><br />
                    <span className="text-muted">{product.protein_content}%</span>
                  </div>
                </div>
              )}
              
              {product.description && (
                <div className="mb-4">
                  <strong>Description:</strong>
                  <p className="mt-2">{product.description}</p>
                </div>
              )}
              
              <div className="d-flex gap-2 mb-4">
                <a
                  href={`/traceability/${product.id}`}
                  className="btn btn-outline-info"
                >
                  <i className="fas fa-search me-1"></i>
                  View Traceability
                </a>
                <a
                  href="/marketplace"
                  className="btn btn-outline-secondary"
                >
                  <i className="fas fa-arrow-left me-1"></i>
                  Back to Marketplace
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Form */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {isAuthenticated ? 'Place Order' : 'Login to Place Order'}
              </h5>
            </div>
            <div className="card-body">
              {isAuthenticated ? (
                <form onSubmit={handleOrderSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">
                          Quantity ({product.unit})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max={product.quantity}
                          className="form-control"
                          id="quantity"
                          value={orderForm.quantity}
                          onChange={(e) => setOrderForm({
                            ...orderForm,
                            quantity: e.target.value
                          })}
                          required
                        />
                        <div className="form-text">
                          Maximum available: {product.quantity} {product.unit}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Total Amount</label>
                        <div className="form-control-plaintext">
                          ₹{orderForm.quantity ? (parseFloat(orderForm.quantity) * product.price_per_unit).toFixed(2) : '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="delivery_address" className="form-label">
                      Delivery Address
                    </label>
                    <textarea
                      className="form-control"
                      id="delivery_address"
                      rows="3"
                      value={orderForm.delivery_address}
                      onChange={(e) => setOrderForm({
                        ...orderForm,
                        delivery_address: e.target.value
                      })}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Place Order
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="mb-4">Please login to place an order for this product.</p>
                  <a href="/login" className="btn btn-primary btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
