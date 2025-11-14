import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/schemes');
      if (response.ok) {
        const data = await response.json();
        setSchemes(data);
      }
    } catch (error) {
      toast.error('Failed to load government schemes');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    if (filter === 'all') return true;
    if (filter === 'active') return new Date(scheme.deadline) > new Date();
    if (filter === 'upcoming') return new Date(scheme.deadline) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return true;
  });

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
              <h2 className="fw-bold text-dark">Government Schemes</h2>
              <p className="text-muted">Explore available government schemes for millet farmers and processors</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                {filteredSchemes.length} Schemes Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All Schemes
                </button>
                <button
                  className={`btn ${filter === 'active' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('active')}
                >
                  Active Schemes
                </button>
                <button
                  className={`btn ${filter === 'upcoming' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming Deadlines
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schemes List */}
      <div className="row">
        {filteredSchemes.length === 0 ? (
          <div className="col-12">
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No schemes found</h5>
                <p className="text-muted">
                  {filter === 'all' 
                    ? 'No government schemes are currently available.' 
                    : `No schemes match the "${filter}" filter.`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{scheme.title}</h5>
                    {scheme.deadline && (
                      <span className={`badge ${new Date(scheme.deadline) > new Date() ? 'bg-success' : 'bg-danger'}`}>
                        {new Date(scheme.deadline) > new Date() ? 'Active' : 'Expired'}
                      </span>
                    )}
                  </div>
                  
                  <p className="card-text text-muted mb-3">
                    {scheme.description}
                  </p>
                  
                  <div className="mb-3">
                    <h6 className="text-primary">Eligibility Criteria:</h6>
                    <p className="small text-muted">{scheme.eligibility_criteria}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-success">Benefits:</h6>
                    <p className="small text-muted">{scheme.benefits}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-info">Application Process:</h6>
                    <p className="small text-muted">{scheme.application_process}</p>
                  </div>
                  
                  {scheme.deadline && (
                    <div className="mb-3">
                      <h6 className="text-warning">Application Deadline:</h6>
                      <p className="small">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(scheme.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <button className="btn btn-primary w-100">
                      <i className="fas fa-download me-2"></i>
                      Download Application Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Information Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-info-circle fa-2x text-primary mb-3"></i>
                    <h6>Need Help?</h6>
                    <p className="small text-muted">
                      Contact your local agriculture department for assistance with scheme applications.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-phone fa-2x text-success mb-3"></i>
                    <h6>Helpline</h6>
                    <p className="small text-muted">
                      Call 1800-180-1551 for scheme-related queries and support.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="fas fa-globe fa-2x text-info mb-3"></i>
                    <h6>Online Portal</h6>
                    <p className="small text-muted">
                      Visit agriculture.gov.in for more information and online applications.
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

export default Schemes;
