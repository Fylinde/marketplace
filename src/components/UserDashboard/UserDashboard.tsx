import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAuthData, logout } from '../../redux/slices/authSlice';
import { selectUserFullName } from '../../redux/slices/authSlice';

import './UserDashboard.css';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Access tokens and user from Redux store
  const accessToken = useSelector((state: RootState) => state.auth.access_token );
  const user = useSelector((state: RootState) => state.auth.user);
  const userFullName = useSelector(selectUserFullName);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const access_token = queryParams.get('access_token');
    const refresh_token = queryParams.get('refresh_token');
  
    if (access_token && refresh_token) {
      // Check if user data is present in the URL or fetch it if necessary
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      dispatch(setAuthData({ access_token, refresh_token, user: storedUser }));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      window.history.replaceState({}, document.title, "/user-dashboard");
    } else {
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  
      if (!storedAccessToken || !storedRefreshToken) {
        navigate('/registration/sign-in');
      } else {
        if (!accessToken) {
          dispatch(setAuthData({ 
            access_token: storedAccessToken, 
            refresh_token: storedRefreshToken, 
            user: storedUser
          }));
        }
      }
    }
  }, [dispatch, navigate, location, accessToken]);
  

  // Logout and clear all tokens from Redux and localStorage
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/registration/sign-in');
  };

  const goToAddressList = () => {
    navigate('/addresses');
  };


  return (
    <div className="user-dashboard">
       <h1>Welcome, {userFullName ? `Hello, ${userFullName}` : 'Hello, Guest'}</h1>
      {/*} <h1>Welcome, {user?.full_name || 'User'}</h1> */}
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="dashboard-card">
            <h3>Your Orders</h3>
            <p>Track, return, cancel an order, or download invoice to buy again</p>
          </div>
          <div className="dashboard-card">
            <h3>Login & Security</h3>
            <p>Manage password, email, and mobile number</p>
          </div>
          <div className="dashboard-card">
            <h3>Prime</h3>
            <p>Manage your membership, view benefits, and payment settings</p>
          </div>
          <div className="dashboard-card" onClick={goToAddressList}>
            <h3>Your Addresses</h3>
            <p>Edit, remove or set default address</p>
          </div>
          <div className="dashboard-card">
            <h3>Your Payments</h3>
            <p>Manage payment methods and settings, view all transactions</p>
          </div>
          <div className="dashboard-card">
            <h3>Gift Cards</h3>
            <p>View balance or redeem a card and purchase a new Gift Card</p>
          </div>
          <div className="dashboard-card">
            <h3>Message Centre</h3>
            <p>View or respond to messages from Fylinde, Sellers, and Buyers</p>
          </div>
          <div className="dashboard-card">
            <h3>Digital Services & Device Support</h3>
            <p>Troubleshoot device issues, manage or cancel digital subscriptions</p>
          </div>
          <div className="dashboard-card">
            <h3>Contact Us</h3>
            <p>Browse self-service options, help articles, or contact us</p>
          </div>
          <div className="dashboard-card">
            <h3>Your Lists</h3>
            <p>View, modify, and share your lists, or create new ones</p>
          </div>
          <div className="dashboard-card">
            <h3>Fylinde Mobile App</h3>
            <p>Download the Fylinde App</p>
          </div>
        </div>
      </div>
      <div className="extra-sections">
        {/* Other sections */}
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
