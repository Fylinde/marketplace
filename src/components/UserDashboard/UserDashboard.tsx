import React from 'react';
import { useNavigate  } from 'react-router-dom'; // Assuming you're using react-router for navigation
import './UserDashboard.css';

const UserDashboard: React.FC = () => {

  const navigate = useNavigate();

  // Redirect to the Address Management page
  const goToAddressList = () => {
    navigate('/addresses');
  };

  return (
    <div className="user-dashboard">
      <h1>Your Account</h1>
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="dashboard-card">
            <h3>Your Orders</h3>
            <p>Track, return, cancel an order, or download invoice to buy again</p>
          </div>
          <div className="dashboard-card">
            <h3>Login & Security</h3>
            <p>Manage password, email and mobile number</p>
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
            <p>View, modify and share your lists, or create new ones</p>
          </div>
          <div className="dashboard-card">
            <h3>Fylinde Mobile App</h3>
            <p>Download the Fylinde App</p>
          </div>
        </div>
      </div>
      <div className="extra-sections">
        <div className="extra-section">
          <h3>Digital content and devices</h3>
          <ul>
            <li>Fylinde Drive</li>
            <li>Content Library</li>
            <li>Devices</li>
            <li>Manage Digital Delivery</li>
          </ul>
        </div>
        <div className="extra-section">
          <h3>Email alerts, messages, ads and cookies</h3>
          <ul>
            <li>Cookies and advertising choices</li>
            <li>Advertising preferences</li>
            <li>Communication preferences</li>
            <li>Message Centre</li>
          </ul>
        </div>
        <div className="extra-section">
          <h3>More ways to pay</h3>
          <ul>
            <li>Your purchase preferences</li>
          </ul>
        </div>
        <div className="extra-section">
          <h3>Ordering and shopping preferences</h3>
          <ul>
            <li>Your Transaction</li>
            <li>Manage Your Fylinde Family</li>
            <li>Language settings</li>
            <li>Archived Orders</li>
            <li>Lists</li>
            <li>Profile</li>
            <li>VAT registration number</li>
            <li>Racism and Product Safety Alerts</li>
          </ul>
        </div>
        <div className="extra-section">
          <h3>Other accounts</h3>
          <ul>
            <li>Sell on Fylinde</li>
            <li>Fylinde Web Services</li>
            <li>Twitch account settings</li>
          </ul>
        </div>
        <div className="extra-section">
          <h3>Memberships and subscriptions</h3>
          <ul>
            <li>Subscribe & Save</li>
            <li>Fylinde Prime</li>
            <li>Memberships & Subscriptions</li>
          </ul>
        </div>
        <div className="extra-section">
          <h3>Manage your data</h3>
          <ul>
            <li>Request your data</li>
            <li>Transfer your data</li>
            <li>Data and besters services</li>
            <li>Recommendation Preferences</li>
            <li>Manage apps and services with data access</li>
            <li>Seller Data Sharing Preferences</li>
            <li>Close Your Fylinde Account</li>
            <li>Privacy Notice</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
