import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Millets Value Chain Platform
              </h1>
              <p className="lead mb-4">
                Connecting farmers, buyers, and consumers for sustainable millet trading. 
                Promoting "Shree Anna" - the super grain of India.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/marketplace" className="btn btn-primary btn-lg">
                  <i className="fas fa-store me-2"></i>
                  Explore Marketplace
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-user-plus me-2"></i>
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-dark mb-3">Platform Features</h2>
              <p className="lead text-muted">
                Empowering the millet ecosystem with digital solutions
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-users fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Connect Stakeholders</h5>
                  <p className="card-text">
                    Connect farmers, FPOs, SHGs, processors, startups, and consumers 
                    in one unified ecosystem.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-search fa-3x text-success"></i>
                  </div>
                  <h5 className="card-title">End-to-End Traceability</h5>
                  <p className="card-text">
                    Track millet products from farm to fork with blockchain-based 
                    traceability ensuring transparency and quality.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-line fa-3x text-warning"></i>
                  </div>
                  <h5 className="card-title">AI Market Insights</h5>
                  <p className="card-text">
                    Get AI-powered market insights, dynamic pricing, and demand 
                    predictions for better decision making.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-shield-alt fa-3x text-info"></i>
                  </div>
                  <h5 className="card-title">Quality Certification</h5>
                  <p className="card-text">
                    Ensure quality with certification support, government schemes 
                    integration, and verified farmer profiles.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-mobile-alt fa-3x text-danger"></i>
                  </div>
                  <h5 className="card-title">Regional Language Support</h5>
                  <p className="card-text">
                    Access the platform in regional languages with multilingual 
                    support for rural accessibility.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-credit-card fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Digital Payments</h5>
                  <p className="card-text">
                    Secure digital wallet integration with UPI support and 
                    government-backed subsidies for seamless transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-dark mb-3">For Everyone</h2>
              <p className="lead text-muted">
                Tailored solutions for all stakeholders in the millet value chain
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-2 col-md-4 col-6">
              <div className="text-center">
                <div className="user-type-icon mb-3">
                  <i className="fas fa-tractor fa-3x text-success"></i>
                </div>
                <h6 className="fw-bold">Farmers</h6>
                <p className="small text-muted">Direct\-to\-market access</p>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-4 col-6">
              <div className="text-center">
                <div className="user-type-icon mb-3">
                  <i className="fas fa-industry fa-3x text-primary"></i>
                </div>
                <h6 className="fw-bold">Processors</h6>
                <p className="small text-muted">Quality sourcing</p>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-4 col-6">
              <div className="text-center">
                <div className="user-type-icon mb-3">
                  <i className="fas fa-shopping-cart fa-3x text-warning"></i>
                </div>
                <h6 className="fw-bold">Consumers</h6>
                <p className="small text-muted">Fresh & authentic products</p>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-4 col-6">
              <div className="text-center">
                <div className="user-type-icon mb-3">
                  <i className="fas fa-users-cog fa-3x text-info"></i>
                </div>
                <h6 className="fw-bold">FPOs/SHGs</h6>
                <p className="small text-muted">Collective trading</p>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-4 col-6">
              <div className="text-center">
                <div className="user-type-icon mb-3">
                  <i className="fas fa-rocket fa-3x text-danger"></i>
                </div>
                <h6 className="fw-bold">Startups</h6>
                <p className="small text-muted">Innovation support</p>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-4 col-6">
              <div className="text-center">
                <div className="user-type-icon mb-3">
                  <i className="fas fa-truck fa-3x text-secondary"></i>
                </div>
                <h6 className="fw-bold">Logistics</h6>
                <p className="small text-muted">Supply chain management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-6 fw-bold mb-4">Ready to Transform the Millet Industry?</h2>
              <p className="lead mb-4">
                Join thousands of farmers, buyers, and consumers who are already 
                benefiting from our platform.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <i className="fas fa-rocket me-2"></i>
                  Get Started Today
                </Link>
                <Link to="/marketplace" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-eye me-2"></i>
                  View Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
