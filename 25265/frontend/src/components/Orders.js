import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'confirmed': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'paid': 'success',
      'refunded': 'danger'
    };
    return statusMap[status] || 'secondary';
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
              <h2 className="fw-bold text-dark">My Orders</h2>
              <p className="text-muted">
                {user?.user_type === 'farmer' ? 'Orders received from buyers' : 'Your purchase orders'}
              </p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                {orders.length} Orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No orders found</h5>
                <p className="text-muted">
                  {user?.user_type === 'farmer' 
                    ? 'You haven\'t received any orders yet. Add products to start selling!' 
                    : 'You haven\'t placed any orders yet. Start shopping now!'}
                </p>
                <a 
                  href={user?.user_type === 'farmer' ? '/add-product' : '/marketplace'} 
                  className="btn btn-primary"
                >
                  {user?.user_type === 'farmer' ? 'Add Product' : 'Browse Marketplace'}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.order_number}</strong>
                          </td>
                          <td>
                            <div>
                              <strong>{order.product_name}</strong>
                              <br />
                              <small className="text-muted">
                                {user?.user_type === 'farmer' ? `Buyer: ${order.buyer_name}` : `Seller: ${order.seller_name}`}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {order.quantity} kg
                            </span>
                          </td>
                          <td>
                            <strong>₹{order.total_amount.toFixed(2)}</strong>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusBadge(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${getPaymentStatusBadge(order.payment_status)}`}>
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {new Date(order.order_date).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              {user?.user_type === 'farmer' && order.status === 'pending' && (
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  title="Confirm Order"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              {order.status === 'pending' && (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  title="Cancel Order"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
