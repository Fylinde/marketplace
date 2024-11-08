// src/components/Dashboard/Overview.tsx
import React from "react";

const Overview: React.FC = () => {
  return (
    <div className="overview">
      <h2>Dashboard Overview</h2>
      <div className="metrics">
        <div className="metric-card">Total Sales: $1200</div>
        <div className="metric-card">Orders: 50</div>
        <div className="metric-card">Customer Satisfaction: 98%</div>
      </div>
      <div className="notifications">
        <h3>Recent Notifications</h3>
        <ul>
          <li>Order #1023 has been shipped.</li>
          <li>Low stock alert for Product XYZ.</li>
          <li>New customer message from Jane Doe.</li>
        </ul>
      </div>
    </div>
  );
};

export default Overview;
