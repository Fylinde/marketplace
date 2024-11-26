import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Header from "./Header";
import DashboardMainContent from "./DashboardMainContent";
import Overview from "./Overview";
import InventoryManagement from "./InventoryManagement";
import OrderManagement from "./OrderManagement";
import PerformanceMetrics from "./PerformanceMetrics";
import BillingPayments from "./BillingPayments";
import Shipping from "./Shipping";
import SecuritySettings from "./SecuritySettings";
import MarketingPromotions from "./MarketingPromotions";
import Enhancements from "./Enhancements";
import HelpSupport from "./HelpSupport";
import AccountSettings from "components/dashboard/AccountSettings";
import DashboardPageHeader from "components/layout/DashboardPageHeader";

const SellerDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("Overview");

  const renderSection = () => {
    switch (activeSection) {
      case "Overview":
        return <Overview />;
      case "Inventory":
        return <InventoryManagement />;
      case "Orders":
        return <OrderManagement />;
      case "Performance":
        return <PerformanceMetrics />;
      case "Billing":
        return <BillingPayments />;
      case "Shipping":
        return <Shipping />;
      case "Security":
        return <SecuritySettings />;
      case "Advertising":
        return <MarketingPromotions />;
      case "Enhancements":
        return <Enhancements />;
      case "Help":
        return <HelpSupport />;
      case "AccountSettings":
        return (
          <>
            <DashboardPageHeader title="Account Settings" iconName="settings" />
            <AccountSettings />            
          </>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="seller-dashboard">
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="content-area">
        <Header />
        <DashboardMainContent>{renderSection()}</DashboardMainContent>
      </div>
    </div>
  );
};

export default SellerDashboard;
