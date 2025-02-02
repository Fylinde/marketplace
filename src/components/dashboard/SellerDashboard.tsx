import React from "react";
import StyledVendorDashboard from "./StyledSellerDashboard";
import VendorDashboardLayout from "../layout/SellerDashboardLayout";

// Define a custom type for components with a layout property
interface LayoutComponent extends React.FC {
  layout?: React.FC<{ children: React.ReactNode }>;
}

const VendorDashboard: LayoutComponent = () => {
  return (
    <StyledVendorDashboard>
      <div className="top-section">
        <div className="dashboard-card">
          <div className="card-title">Today's Sales</div>
          <div className="card-content">$8,351</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Balance</div>
          <div className="card-content">$95,883</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Match Featured Offer Price</div>
          <div className="card-content">Price: $11.95, Shipping: $0.00</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Buyer Messages</div>
          <div className="card-content">3 messages require attention</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">News</div>
          <div className="card-content">Latest updates on VAT compliance</div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="dashboard-card">
          <div className="card-title">Sponsored Display</div>
          <div className="card-content">Active campaigns: 2</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Tutorials and Training</div>
          <div className="card-content">Learn how to sell on Amazon</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">List Globally</div>
          <div className="card-content">Reach millions by listing internationally</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">A-to-Z Claims</div>
          <div className="card-content">1 claim requires attention</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Payments Summary</div>
          <div className="card-content">Most recent payment: $2,689.58</div>
        </div>
      </div>
    </StyledVendorDashboard>
  );
};

// Assign the layout to VendorDashboard
VendorDashboard.layout = VendorDashboardLayout;

export default VendorDashboard;
