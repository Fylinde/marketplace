import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import sections
import AccountSettings from "../../components/dashboard/AccountSettings/index";
import Advertising from "../../components/dashboard/Advertising/index";
import OrderManagement from "../../components/dashboard/OrderManagement/index";
import Payment from "../../components/dashboard/Payment/index";
import PerformanceMetrics from "../../components/dashboard/PerformanceMetrics/index";
import ProductManagement from "../../components/dashboard/ProductManagement/index";
import Security from "../../components/dashboard/Security/index";
import Shipping from "../../components/dashboard/Shipping/index";
import Support from "../../components/dashboard/Support/index";

// Import Exchange Components
import ExchangeRateCard from "../../components/exchange/ExchangeRateCard";
import CurrencyConverter from "../../components/exchange/CurrencyConverter";
import RateDashboard from "../../components/exchange/RateDashboard"; // Optional

// Optional: Dashboard Layout components
import DashboardHeader from "../../components/dashboard/DashboardLayout/DashboardHeader";
import DashboardSidebar from "../../components/dashboard/DashboardLayout/DashboardSidebar";
import DashboardFooter from "../../components/dashboard/DashboardLayout/DashboardFooter";

const SellerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Fetch rates and baseCurrency from Redux state
  const { rates, baseCurrency } = useSelector((state: RootState) => state.exchangeRate);

  useEffect(() => {
    // Fetch initial data
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  if (!dashboardData) return <div>Loading dashboard...</div>;

  // Example breadcrumb data
  const breadcrumb = ["Home", "Seller Dashboard"];

  return (
    <div className="seller-dashboard">
      {/* Optional: Header and Sidebar */}
      <DashboardHeader breadcrumb={breadcrumb} />
      <DashboardSidebar />

      <div className="dashboard-content">
        <h1>Welcome to Seller Dashboard</h1>

        {/* Exchange Rate Card */}
        <section>
          <h2>Current Exchange Rates</h2>
          <ExchangeRateCard rates={rates} baseCurrency={baseCurrency} />
        </section>

        {/* Account Settings Section */}
        <section>
          <h2>Account Settings</h2>
          <AccountSettings />
        </section>

        {/* Advertising Section */}
        <section>
          <h2>Advertising</h2>
          <Advertising />
        </section>

        {/* Order Management Section */}
        <section>
          <h2>Order Management</h2>
          <OrderManagement />
        </section>

        {/* Payment Section */}
        <section>
          <h2>Payment</h2>
          <CurrencyConverter rates={rates} baseCurrency={baseCurrency} />
          <Payment />
        </section>

        {/* Performance Metrics Section */}
        <section>
          <h2>Performance Metrics</h2>
          <RateDashboard /> {/* Optional: Add rate trends chart here */}
          <PerformanceMetrics />
        </section>

        {/* Product Management Section */}
        <section>
          <h2>Product Management</h2>
          <ProductManagement />
        </section>

        {/* Security Section */}
        <section>
          <h2>Security</h2>
          <Security />
        </section>

        {/* Shipping Section */}
        <section>
          <h2>Shipping</h2>
          <Shipping />
        </section>

        {/* Support Section */}
        <section>
          <h2>Support</h2>
          <Support />
        </section>
      </div>

      {/* Optional: Footer */}
      <DashboardFooter />
    </div>
  );
};

export default SellerDashboard;
