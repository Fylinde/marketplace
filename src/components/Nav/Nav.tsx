import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import './Nav.css';  // Make sure styles are handled here

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSignedIn = !!user?.full_name;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/sign-out');
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  const handleCreateSellerAccount = () => {
    navigate('/create-seller-account');
  };
  if (status === 'loading') {
    return <div>Loading...</div>;  // Handle loading state here
  }
  // Debugging to ensure user and full_name are correctly populated
  console.log('User in Redux:', user);
  console.log('User in LocalStorage:', localStorage.getItem('user'));

  return (
    <div className="nav">
      <div className="nav-logo" onClick={() => navigate('/')}>
        {/* Your logo goes here */}
      </div>
      <div className="nav-option">
        {isSignedIn ? (
          <div
            className="account-section"
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <span>Hello, {user?.full_name || 'User'}</span>
            <span>Account & Lists ▾</span>
            {isOpen && (
              <div className="dropdown-content">
                <div className="dropdown-header">
                  <p>Who's shopping? Select a profile.</p>
                  <a href="#">Manage Profiles</a>
                </div>
                <div className="dropdown-columns">
                  <div className="dropdown-column">
                    <h4>Your Lists</h4>
                    <p><a href="#">Create a List</a></p>
                  </div>
                  <div className="dropdown-column">
                    <h4>Your Account</h4>
                    <ul>
                      <li><a href="#">Your Account</a></li>
                      <li><a href="#">Your Orders</a></li>
                      <li><a href="#">Your Recommendations</a></li>
                      <li><a href="#">Recalls and Product Safety Alerts</a></li>
                      <li><a href="#">Your Subscribe & Save Items</a></li>
                      <li><a href="#">Your Prime Membership</a></li>
                      <li><a onClick={handleCreateSellerAccount}>Create Seller Account</a></li>
                      <li><a href="#">Content Library</a></li>
                      <li><a href="#">Devices</a></li>
                      <li><a href="#">Memberships & Subscriptions</a></li>
                      <li><a href="#">Fylinde Drive</a></li>
                      <li><a href="#">Your Prime Video</a></li>
                      <li><a onClick={handleSignOut}>Sign Out</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="account-section"
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <span>Hello, Sign in</span>
            <span>Account & Lists ▾</span>
            {isOpen && (
              <div className="dropdown-content">
                <button
                  onClick={handleSignIn}
                  style={{
                    backgroundColor: "#ffd814",
                    padding: "8px",
                    border: "none",
                    borderRadius: "3px",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  Sign in
                </button>
                <p style={{ textAlign: "center" }}>
                  New customer? <a onClick={handleCreateAccount}>Start here.</a>
                </p>
                <hr />
                <div className="dropdown-columns">
                  <div className="dropdown-column">
                    <h4>Your Lists</h4>
                    <p><a href="#">Create a List</a></p>
                  </div>
                  <div className="dropdown-column">
                    <h4>Your Account</h4>
                    <ul>
                      <li><a href="#">Your Account</a></li>
                      <li><a href="#">Your Orders</a></li>
                      <li><a href="#">Your Recommendations</a></li>
                      <li><a href="#">Your Subscribe & Save Items</a></li>
                      <li><a onClick={handleCreateSellerAccount}>Create Seller Account</a></li>
                      <li><a href="#">Content Library</a></li>
                      <li><a href="#">Devices</a></li>
                      <li><a href="#">Memberships & Subscriptions</a></li>
                      <li><a href="#">Fylinde Drive</a></li>
                      <li><a href="#">Your Prime Video</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="nav-option">
        <span>Returns</span>
        <span>& Orders</span>
      </div>
      <div className="nav-option">
        <span>Your</span>
        <span>Prime</span>
      </div>
    </div>
  );
};

export default Nav;




