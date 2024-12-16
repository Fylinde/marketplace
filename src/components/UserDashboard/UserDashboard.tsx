// src/components/UserDashboard/UserDashboard.tsx

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAuthData, logout } from '../../redux/slices/auth/authSlice';
import './UserDashboard.css';
import RecommendedItems from '../search/RecommendedItems';
import PreferenceManager from '../PreferenceManager';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // Access tokens and user from Redux store
  const { access_token, user, status } = useSelector((state: RootState) => state.auth);

  // Set auth data on initial load if tokens exist in URL or localStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const access_token_param = queryParams.get('access_token');
    const refresh_token_param = queryParams.get('refresh_token');

    if (access_token_param && refresh_token_param) {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      dispatch(setAuthData({ access_token: access_token_param, refresh_token: refresh_token_param, user: storedUser }));

      // Store tokens in localStorage
      localStorage.setItem('access_token', access_token_param);
      localStorage.setItem('refresh_token', refresh_token_param);

      // Remove query parameters from URL after processing
      window.history.replaceState({}, document.title, "/user-dashboard");
    } else {
      // Retrieve tokens from localStorage if already authenticated
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

      if (!storedAccessToken || !storedRefreshToken) {
        navigate('/register/sign-in');
      } else if (!access_token) {
        dispatch(setAuthData({
          access_token: storedAccessToken,
          refresh_token: storedRefreshToken,
          user: storedUser
        }));
      }
    }
  }, [dispatch, navigate, location, access_token]);

  // Redirect to sign-in if not authenticated after loading
  useEffect(() => {
    if (status === 'succeeded' && !access_token) {
      navigate('/register/sign-in');
    }
  }, [status, access_token, navigate]);

  // Logout function to clear auth data
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/register/sign-in');
  };

  // Redirect while loading auth status
  if (status === 'loading') {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>Welcome, {user?.full_name ? `Hello, ${user.full_name}` : 'Hello, Guest'}</h1>
      {/* <PreferenceManager userId={userId} /> */}
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
          <div className="dashboard-card" onClick={() => navigate('/addresses')}>
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
        {/* Placeholder for other sections */}
      </div>
      {/*<RecommendedItems context="personalized" userId={user.id} /> */}

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
