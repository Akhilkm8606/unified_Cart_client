import React, { useEffect, useState } from 'react';
import '../Profile/Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Profile() {
  const products = useSelector(state => state.data.products);
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
  
    const fetchOrdersData = async () => {
      try {
        if (isAuthenticated) {
          const response = await axios.get(`http://localhost:5000/orderlist/${user._id}`, {
            withCredentials: true
          });
          setOrders(response.data.orders);
        } else {
          // Handle not authenticated case, e.g., redirect to login page
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching Order data:', error);
      }
    };
    fetchOrdersData();
  }, [isAuthenticated, user, navigate]);

  return (
    <div className='pm'>
      {isAuthenticated ? (
        <div>
          <div className='pp'><img src="https://source.unsplash.com/random/?superbike" alt="" /></div>
          <div className='d'>
            <div>
              <h3>{user.username}</h3>
              <p>{user.phone}</p>
              <h5>{user.email}</h5>
              <span className='edit'>
                <Link to={`/edit-profile/${user._id}`} className="edit-profile-button"> Edit </Link>
              </span>
            </div>
          </div>

          <hr />

          <div className='ps3'><h1>Orders</h1></div>
          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-item">
                  {order.items.map((item) => {
                    const product = products.find(product => product._id === item.product);
                    if (product) {
                      return (
                        <div key={item._id} className="product-item">
                          <Link to={`/product/${product._id}`}>
                            <img src={`http://localhost:5000/uploads/${product.images[0]}`} className="product-image" alt="" />
                          </Link>
                          <p>{product.name}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                  <div>
                    <h2>Order ID: {order._id}</h2>
                    <p>Total Price: {order.totalPrice}</p>
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Payment Status: {order.paymentStatus}</p>
                    <p>Shipment Status: {order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <h1>Your Order History is Empty</h1>
              <p>You haven't placed any orders yet!</p>
            </div>
          )}
        </div>
      ) : (
        // Render login prompt if not authenticated
        <div>
          <h1>Please log in to view your profile and orders.</h1>
          <Link to="/login">Log In</Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
