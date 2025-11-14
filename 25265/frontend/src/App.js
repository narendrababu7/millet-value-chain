import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import ProductDetails from './components/ProductDetails';
import AddProduct from './components/AddProduct';
import Orders from './components/Orders';
import Traceability from './components/Traceability';
import Schemes from './components/Schemes';
import MarketPrices from './components/MarketPrices';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import AIPricePrediction from './components/AIPricePrediction';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Chatbot />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            <Route path="/add-product" element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <AddProduct />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            
            <Route path="/traceability/:productId" element={<Traceability />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/ai-prediction" element={<AIPricePrediction />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
          
          <footer className="footer">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <h5>Millets Value Chain Platform</h5>
                  <p>Connecting farmers, buyers, and consumers for sustainable millet trading.</p>
                </div>
                <div className="col-md-4">
                  <h5>Quick Links</h5>
                  <ul className="list-unstyled">
                    <li><a href="/marketplace">Marketplace</a></li>
                    <li><a href="/schemes">Government Schemes</a></li>
                    <li><a href="/market-prices">Market Prices</a></li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h5>Contact Us</h5>
                  <p>Email: support@milletsplatform.com</p>
                  <p>Phone: +91-9876543210</p>
                </div>
              </div>
              <hr />
              <div className="text-center">
                <p>&copy; 2024 Millets Value Chain Platform. All rights reserved.</p>
              </div>
            </div>
          </footer>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
