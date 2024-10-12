// src/components/Vendor/VendorDashboard.tsx

import React from 'react';
import './Vendor.css';

const VendorDashboard: React.FC = () => {
  return (
    <div className="vendor-dashboard">
      <h2>Vendor Dashboard</h2>
      <div className="dashboard-sections">
        <div className="section">
          <h3>Product Management</h3>
          <p>Manage your products, inventory, and images.</p>
          <a href="/vendor/products">Go to Product Management</a>
        </div>
        <div className="section">
          <h3>Order Management</h3>
          <p>View and fulfill customer orders.</p>
          <a href="/vendor/orders">Go to Order Management</a>
        </div>
        <div className="section">
          <h3>Sales Analytics</h3>
          <p>View your sales performance and reports.</p>
          <a href="/vendor/analytics">Go to Sales Analytics</a>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
