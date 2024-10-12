// src/components/Vendor/VendorAnalytics.tsx

import React from 'react';
import './Vendor.css';

const VendorAnalytics: React.FC = () => {
  return (
    <div className="vendor-analytics">
      <h2>Sales Analytics</h2>
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Sales</h3>
          <p>$10,000</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>150</p>
        </div>
        <div className="card">
          <h3>Products Sold</h3>
          <p>500</p>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
