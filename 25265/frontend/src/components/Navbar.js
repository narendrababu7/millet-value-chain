import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-seedling me-2"></i>
          Millets Platform
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t('nav.home')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/marketplace">{t('nav.marketplace')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schemes">{t('nav.schemes')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/market-prices">{t('nav.prices')}</Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <LanguageSwitcher />
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="fas fa-tachometer-alt me-1"></i>
                    {t('nav.dashboard')}
                  </Link>
                </li>
                {user?.user_type === 'farmer' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/add-product">
                      <i className="fas fa-plus me-1"></i>
                      {t('nav.addProduct')}
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    <i className="fas fa-shopping-cart me-1"></i>
                    {t('nav.orders')}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user me-1"></i>
                    {user?.full_name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fas fa-user-circle me-2"></i>
                        {t('nav.profile')}
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        {t('nav.logout')}
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">{t('nav.login')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">{t('nav.register')}</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
