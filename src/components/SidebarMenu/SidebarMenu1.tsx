import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import './SidebarMenu.css';

const SidebarMenu: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSignedIn = !!user;

  const handleSignOut = () => {
    dispatch(logout()); // Clear the user state and tokens
    navigate('/sign-out'); // Redirect to the Signout page
  };

  return (
    <div className="sidebar-menu" onClick={() => setSidebarOpen(!isSidebarOpen)}>
      <span>☰ All</span>
      {isSidebarOpen && (
        <div className="sidebar-dropdown">
          {isSignedIn ? (
            <p><strong>Hello, {user?.full_name || 'User'}</strong></p>
          ) : (
            <p><strong>Hello, Sign in</strong></p>
          )}
          <hr />
          <h4>Digital Content & Devices</h4>
          <p>Fylinde Music</p>
          <p>Kindle E-readers & Books</p>
          <p>Fylinde Appstore</p>
          <hr />
          <h4>Shop by Department</h4>
          <p>Electronics</p>
          <p>Computers</p>
          <p>Smart Home</p>
          <p>Arts & Crafts</p>
          <p>See all</p>
          <hr />
          <h4>Programs & Features</h4>
          <p>Gift Cards</p>
          <p>Shop By Interest</p>
          <p>Fylinde Live</p>
          <p>International Shopping</p>
          <p>See all</p>
          <hr />
          <h4>Help & Settings</h4>
          <p>Your Account</p>
          <p>English</p>
          <p>United States</p>
          <p>Customer Service</p>
          <p onClick={handleSignOut} className="signout-link">Sign Out</p> {/* Updated Sign Out Link */}
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
