import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const AIPricePrediction = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    millet_type: 'Pearl Millet',
    days_ahead: 7,
    state: 'Bihar',
    district: 'Muzaffarpur'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ai/predict-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data);
        toast.success('Price prediction generated successfully!');
      } else {
        toast.error('Failed to generate price prediction');
      }
    } catch (error) {
      toast.error('Error generating price prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark">AI Price Prediction</h2>
              <p className="text-muted">Get AI-powered price predictions for your millet products</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                <i className="fas fa-brain me-1"></i>
                AI Powered
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Price Prediction Form
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="millet_type" className="form-label">Millet Type</label>
                  <select
                    className="form-control"
                    id="millet_type"
                    name="millet_type"
                    value={formData.millet_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pearl Millet">Pearl Millet</option>
                    <option value="Finger Millet">Finger Millet</option>
                    <option value="Foxtail Millet">Foxtail Millet</option>
                    <option value="Little Millet">Little Millet</option>
                    <option value="Proso Millet">Proso Millet</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="days_ahead" className="form-label">Days Ahead</label>
                  <input
                    type="number"
                    className="form-control"
                    id="days_ahead"
                    name="days_ahead"
                    value={formData.days_ahead}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    required
                  />
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
                        <option value="Bihar">Bihar</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
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

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Predicting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic me-2"></i>
                      Generate Prediction
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Prediction Results
              </h5>
            </div>
            <div className="card-body">
              {prediction ? (
                <div>
                  <div className="text-center mb-4">
                    <h3 className="text-success">₹{prediction.predicted_price}</h3>
                    <p className="text-muted">Predicted Price per kg</p>
                  </div>

                  <div className="row mb-4">
                    <div className="col-6">
                      <div className="text-center">
                        <h6 className="text-info">Confidence Range</h6>
                        <p className="mb-1">₹{prediction.confidence_lower} - ₹{prediction.confidence_upper}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <h6 className="text-warning">Prediction Date</h6>
                        <p className="mb-1">{new Date(prediction.prediction_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6>Market Factors:</h6>
                    <ul className="list-unstyled">
                      <li><strong>Seasonal Factor:</strong> {prediction.factors?.seasonal_factor}</li>
                      <li><strong>Demand Factor:</strong> {prediction.factors?.demand_factor}</li>
                      <li><strong>Supply Factor:</strong> {prediction.factors?.supply_factor}</li>
                      <li><strong>Weather Factor:</strong> {prediction.factors?.weather_factor}</li>
                      <li><strong>Market Trend:</strong> {prediction.factors?.market_trend}</li>
                      <li><strong>Government Subsidy:</strong> {prediction.factors?.government_subsidy ? 'Yes' : 'No'}</li>
                    </ul>
                  </div>

                  {prediction.fallback_prediction && (
                    <div className="alert alert-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      This is a fallback prediction. AI service is currently unavailable.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No Prediction Yet</h5>
                  <p className="text-muted">Fill out the form and click "Generate Prediction" to get AI-powered price forecasts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2"></i>
                AI Market Insights
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-robot fa-2x text-primary mb-3"></i>
                    <h6>Machine Learning</h6>
                    <p className="small text-muted">Advanced algorithms analyze market trends and predict prices.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-database fa-2x text-success mb-3"></i>
                    <h6>Real-time Data</h6>
                    <p className="small text-muted">Uses live market data for accurate predictions.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-chart-line fa-2x text-warning mb-3"></i>
                    <h6>Trend Analysis</h6>
                    <p className="small text-muted">Identifies patterns and seasonal variations.</p>
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

export default AIPricePrediction;
