import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    price_per_unit: '',
    harvest_date: '',
    quality_grade: 'A',
    organic_certified: false,
    moisture_content: '',
    protein_content: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          price_per_unit: parseFloat(formData.price_per_unit),
          moisture_content: formData.moisture_content ? parseFloat(formData.moisture_content) : null,
          protein_content: formData.protein_content ? parseFloat(formData.protein_content) : null
        })
      });

      if (response.ok) {
        toast.success('Product added successfully!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="fas fa-plus me-2"></i>
                Add New Product
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Premium Pearl Millet"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">Millet Type</label>
                      <select
                        className="form-control"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Millet Type</option>
                        <option value="Pearl Millet">Pearl Millet</option>
                        <option value="Finger Millet">Finger Millet</option>
                        <option value="Foxtail Millet">Foxtail Millet</option>
                        <option value="Little Millet">Little Millet</option>
                        <option value="Proso Millet">Proso Millet</option>
                        <option value="Barnyard Millet">Barnyard Millet</option>
                        <option value="Kodo Millet">Kodo Millet</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="variety" className="form-label">Variety</label>
                      <input
                        type="text"
                        className="form-control"
                        id="variety"
                        name="variety"
                        value={formData.variety}
                        onChange={handleChange}
                        required
                        placeholder="e.g., HHB 67, ICTP 8203"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="quality_grade" className="form-label">Quality Grade</label>
                      <select
                        className="form-control"
                        id="quality_grade"
                        name="quality_grade"
                        value={formData.quality_grade}
                        onChange={handleChange}
                        required
                      >
                        <option value="A">Grade A (Premium)</option>
                        <option value="B">Grade B (Good)</option>
                        <option value="C">Grade C (Standard)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label">Quantity</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="unit" className="form-label">Unit</label>
                      <select
                        className="form-control"
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="quintal">Quintal</option>
                        <option value="ton">Ton</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="price_per_unit" className="form-label">Price per Unit (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="price_per_unit"
                        name="price_per_unit"
                        value={formData.price_per_unit}
                        onChange={handleChange}
                        required
                        placeholder="45.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="harvest_date" className="form-label">Harvest Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="harvest_date"
                        name="harvest_date"
                        value={formData.harvest_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="form-check mt-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="organic_certified"
                          name="organic_certified"
                          checked={formData.organic_certified}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="organic_certified">
                          Organic Certified
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="moisture_content" className="form-label">Moisture Content (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        id="moisture_content"
                        name="moisture_content"
                        value={formData.moisture_content}
                        onChange={handleChange}
                        placeholder="12.5"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="protein_content" className="form-label">Protein Content (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        id="protein_content"
                        name="protein_content"
                        value={formData.protein_content}
                        onChange={handleChange}
                        placeholder="11.2"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product, cultivation methods, quality features, etc."
                  ></textarea>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i Incorporate Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate('/dashboard')}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
