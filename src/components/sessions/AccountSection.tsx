// src/components/AccountSection/AccountSection.tsx

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import StyledAccountSection from "./StyledAccountSection";

const AccountSection: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Remove isSignedIn variable and use user?.full_name directly
  const handleSignOut = () => {
    dispatch(logout());
    navigate("/register/sign-out");
  };

  const handleSignIn = () => {
    navigate("/register/sign-in");
  };

  const handleCreateAccount = () => {
    navigate("/register/create-account");
  };

  const handleCreateSellerAccount = () => {
    navigate("/welcome");
  };

  return (
    <StyledAccountSection>
      {user?.full_name ? (
        <>
          <div className="dropdown-header">
            <p>Who's shopping? Select a profile.</p>
            <a className="manage-profiles" href="#">Manage Profiles</a>
          </div>
          <div className="account-section">
            <div className="account-details">
              <h4>Your Lists</h4>
              <ul>
                <li>Create a List</li>
              </ul>
            </div>
            <div className="account-details">
              <h4>Your Account</h4>
              <ul>
                <li>Your Account</li>
                <li>Your Orders</li>
                <li>Keep Shopping For</li>
                <li>Your Recommendations</li>
                <li>Recalls and Product Safety Alerts</li>
                <li>Your Subscribe & Save Items</li>
                <li>Your Prime Membership</li>
                <li onClick={handleCreateSellerAccount}>Create Seller Account</li>
                <li>Content Library</li>
                <li>Devices</li>
                <li>Memberships & Subscriptions</li>
                <li>Amazon Drive</li>
                <li>Your Prime Video</li>
                <li onClick={handleSignOut}>Sign Out</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="login-prompt">
            <button className="login-button" onClick={handleSignIn}>
              Sign in
            </button>
            <p>New customer? <span className="signup-link" onClick={handleCreateAccount}>Start here.</span></p>
          </div>
          <div className="account-section">
            <div className="account-details">
              <h4>Your Lists</h4>
              <ul>
                <li>Create a List</li>
              </ul>
            </div>
            <div className="account-details">
              <h4>Your Account</h4>
              <ul>
                <li>Your Account</li>
                <li>Your Orders</li>
                <li>Your Recommendations</li>
                <li>Your Subscribe & Save Items</li>
                <li onClick={handleCreateSellerAccount}>Create Seller Account</li>
                <li>Content Library</li>
                <li>Devices</li>
                <li>Memberships & Subscriptions</li>
                <li>Amazon Drive</li>
                <li>Your Prime Video</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </StyledAccountSection>
  );
};

export default AccountSection;
