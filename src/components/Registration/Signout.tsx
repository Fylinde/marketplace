import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; // Adjust the import path as needed
import './Signout.css';

const Signout: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="signout-container">
      <div className="signout-logo">
        <img src="Logo/fylind_logo_5.png" alt="Fylinde" />                        
      </div>
      <div className="signout-box">
        <div className="signout-status">
          <div className="signout-success-icon">✔</div>
          <div className="signout-message">
            <h2>Success</h2>
            <p>Account signed out</p>
          </div>
        </div>
        <div className="switch-accounts">
          <h3>Switch accounts</h3>
          <div className="account">
            <div className="account-info">
              <div className="account-icon">✓</div>
              <div>
                <p>{user?.full_name || 'User'}</p>
                <p>{user?.email || 'email@example.com'}</p>
              </div>
            </div>
            <a href="#" className="signout-link">Sign out</a>
          </div>
          <div className="add-account">
            <div className="add-account-icon">+</div>
            <p>Add account</p>
          </div>
        </div>
        <p className="learn-more">
          <a href="#">Learn more about switching accounts.</a>
        </p>
      </div>
    </div>
  );
};

export default Signout;
