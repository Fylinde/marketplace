// src/components/Seller/SellerDashboard.tsx

import React from 'react';
import './Seller.css';

const SellerDashboard: React.FC = () => {
  return (
    <div className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      <div className="dashboard-sections">
        <div className="section">
          <h3>Product Management</h3>
          <p>Manage your products, inventory, and images.</p>
          <a href="/seller/products">Go to Product Management</a>
        </div>
        <div className="section">
          <h3>Order Management</h3>
          <p>View and fulfill customer orders.</p>
          <a href="/seller/orders">Go to Order Management</a>
        </div>
        <div className="section">
          <h3>Sales Analytics</h3>
          <p>View your sales performance and reports.</p>
          <a href="/seller/analytics">Go to Sales Analytics</a>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
