import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    millet_type: ''
  });

  useEffect(() => {
    fetchMarketPrices();
  }, [filters]);

  const fetchMarketPrices = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.millet_type) queryParams.append('millet_type', filters.millet_type);

      const response = await fetch(`/api/market-prices?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setPrices(data);
      }
    } catch (error) {
      toast.error('Failed to load market prices');
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

  const getAveragePrice = (milletType) => {
    const typePrices = prices.filter(p => p.millet_type === milletType);
    if (typePrices.length === 0) return 0;
    const total = typePrices.reduce((sum, p) => sum + p.price_per_kg, 0);
    return (total / typePrices.length).toFixed(2);
  };

  const getPriceTrend = (milletType) => {
    const typePrices = prices.filter(p => p.millet_type === milletType);
    if (typePrices.length < 2) return 'stable';
    
    const sortedPrices = typePrices.sort((a, b) => new Date(a.date) - new Date(b.date));
    const latest = sortedPrices[sortedPrices.length - 1].price_per_kg;
    const previous = sortedPrices[sortedPrices.length - 2].price_per_kg;
    
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'fas fa-arrow-up text-success';
      case 'down': return 'fas fa-arrow-down text-danger';
      default: return 'fas fa-minus text-muted';
    }
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

  // Get unique millet types for summary
  const milletTypes = [...new Set(prices.map(p => p.millet_type))];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark">Market Prices</h2>
              <p className="text-muted">Real-time millet prices across different markets</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                <i className="fas fa-chart-line me-1"></i>
                Live Prices
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary Cards */}
      <div className="row mb-4">
        {milletTypes.map((type) => (
          <div key={type} className="col-md-3 mb-3">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{type}</h6>
                  <h4>₹{getAveragePrice(type)}</h4>
                  <small>Avg. per kg</small>
                </div>
                <div className="text-end">
                  <i className={`${getTrendIcon(getPriceTrend(type))} fa-lg`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
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
                
                <div className="col-md-4">
                  <label className="form-label">Millet Type</label>
                  <select
                    className="form-control"
                    value={filters.millet_type}
                    onChange={(e) => handleFilterChange('millet_type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Pearl Millet">Pearl Millet</option>
                    <option value="Finger Millet">Finger Millet</option>
                    <option value="Foxtail Millet">Foxtail Millet</option>
                    <option value="Little Millet">Little Millet</option>
                    <option value="Proso Millet">Proso Millet</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">Actions</label>
                  <div>
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setFilters({ state: '', millet_type: '' })}
                    >
                      Clear Filters
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={fetchMarketPrices}
                    >
                      <i className="fas fa-sync me-1"></i>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Prices Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-table me-2"></i>
                Market Price Details
              </h5>
            </div>
            <div className="card-body">
              {prices.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No price data found</h5>
                  <p className="text-muted">Try adjusting your filters or check back later.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Millet Type</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Price (₹/kg)</th>
                        <th>Date</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((price, index) => (
                        <tr key={index}>
                          <td>
                            <span className="badge bg-primary">{price.millet_type}</span>
                          </td>
                          <td>{price.state}</td>
                          <td>{price.district}</td>
                          <td>
                            <strong className="text-success">₹{price.price_per_kg}</strong>
                          </td>
                          <td>{new Date(price.date).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-secondary">{price.source}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Insights */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-lightbulb me-2"></i>
                Price Insights
              </h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-chart-bar fa-2x text-primary mb-2"></i>
                    <h6>Market Trends</h6>
                    <p className="small text-muted">
                      Track price movements and identify the best selling opportunities.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-map-marker-alt fa-2x text-success mb-2"></i>
                    <h6>Regional Variations</h6>
                    <p className="small text-muted">
                      Compare prices across different states and districts.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                    <h6>Real-time Updates</h6>
                    <p className="small text-muted">
                      Get the latest market prices updated daily from various sources.
                    </p>
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

export default MarketPrices;
