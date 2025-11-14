import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Traceability = () => {
  const { productId } = useParams();
  const [records, setRecords] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTraceabilityData();
  }, [productId]);

  const fetchTraceabilityData = async () => {
    try {
      // Fetch product details
      const productResponse = await fetch('/api/products');
      if (productResponse.ok) {
        const products = await productResponse.json();
        const productData = products.find(p => p.id === parseInt(productId));
        setProduct(productData);
      }

      // Fetch traceability records
      const traceabilityResponse = await fetch(`/api/traceability/${productId}`);
      if (traceabilityResponse.ok) {
        const data = await traceabilityResponse.json();
        setRecords(data);
      }
    } catch (error) {
      toast.error('Failed to load traceability data');
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stage) => {
    const iconMap = {
      'planting': 'fas fa-seedling',
      'harvesting': 'fas fa-cut',
      'processing': 'fas fa-cogs',
      'packaging': 'fas fa-box',
      'shipping': 'fas fa-truck',
      'delivery': 'fas fa-home'
    };
    return iconMap[stage] || 'fas fa-circle';
  };

  const getStageColor = (stage) => {
    const colorMap = {
      'planting': 'success',
      'harvesting': 'warning',
      'processing': 'info',
      'packaging': 'primary',
      'shipping': 'secondary',
      'delivery': 'success'
    };
    return colorMap[stage] || 'secondary';
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
              <h2 className="fw-bold text-dark">Product Traceability</h2>
              <p className="text-muted">Track your millet from farm to fork</p>
            </div>
            <div className="text-end">
              <span className="badge bg-success fs-6">
                <i className="fas fa-shield-alt me-1"></i>
                Verified Supply Chain
              </span>
            </div>
          </div>
        </div>
      </div>

      {product && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="text-muted mb-2">
                      <strong>Type:</strong> {product.type} - {product.variety}
                    </p>
                    <p className="text-muted mb-2">
                      <strong>Farmer:</strong> {product.farmer_name}
                    </p>
                    <p className="text-muted mb-0">
                      <strong>Harvest Date:</strong> {new Date(product.harvest_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-md-4 text-end">
                    {product.organic_certified && (
                      <span className="badge bg-success fs-6 mb-2">
                        <i className="fas fa-leaf me-1"></i>
                        Organic Certified
                      </span>
                    )}
                    <div>
                      <span className="badge bg-warning fs-6">
                        Quality Grade: {product.quality_grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-route me-2"></i>
                Supply Chain Timeline
              </h5>
            </div>
            <div className="card-body">
              {records.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-info-circle fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No traceability records found</h5>
                  <p className="text-muted">
                    Traceability records are being updated. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="traceability-timeline">
                  {records.map((record, index) => (
                    <div key={index} className="traceability-step">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0 me-3">
                          <div className={`bg-${getStageColor(record.stage)} rounded-circle p-3 text-white`}>
                            <i className={`${getStageIcon(record.stage)} fa-lg`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-1 text-capitalize">
                              {record.stage.replace('_', ' ')}
                            </h6>
                            <small className="text-muted">
                              {new Date(record.timestamp).toLocaleString()}
                            </small>
                          </div>
                          <p className="mb-2">
                            <strong>Location:</strong> {record.location}
                          </p>
                          <p className="mb-2">
                            <strong>Operator:</strong> {record.operator}
                          </p>
                          {record.notes && (
                            <p className="mb-2">
                              <strong>Notes:</strong> {record.notes}
                            </p>
                          )}
                          {record.certificate_url && (
                            <a
                              href={record.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="fas fa-certificate me-1"></i>
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center">
              <i className="fas fa-link fa-2x text-primary mb-3"></i>
              <h5>Blockchain Verified</h5>
              <p className="text-muted mb-3">
                This product's journey has been recorded on the blockchain, 
                ensuring complete transparency and authenticity.
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-lock fa-lg text-success mb-2"></i>
                    <p className="small mb-0">Immutable Records</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-eye fa-lg text-info mb-2"></i>
                    <p className="small mb-0">Full Transparency</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-check-circle fa-lg text-warning mb-2"></i>
                    <p className="small mb-0">Quality Assured</p>
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

export default Traceability;
