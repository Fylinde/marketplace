// src/components/dashboard/AnalyticsReports.tsx
export {};

{/*/ src/components/Dashboard/SellerDashboard.tsx
import React, { useState } from "react";
import DashboardSidebar from "./DashboardLayout/DashboardSidebar";
//import Header from "./DashboardLayout/DashboardHeader";
import DashboardMainContent from "./DashboardLayout/DashboardMainContent";
import Overview from "./Overview";
//import InventoryManagement from "./InventoryManagement";
//import OrderManagement from "./OrderManagement";
//import CustomerEngagement from "./CustomerEngagement";
//import MarketingPromotions from "./MarketingPromotions";
//import AnalyticsReports from "./AnalyticsReports";
//import BillingPayments from "./BillingPayments";
//import SettingsPreferences from "./SettingsPreferences";
//import HelpSupport from "./HelpSupport";

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
      case "Customers":
        return <CustomerEngagement />;
      case "Marketing":
        return <MarketingPromotions />;
      case "Analytics":
        return <AnalyticsReports />;
      case "Billing":
        return <BillingPayments />;
      case "Settings":
        return <SettingsPreferences />;
      case "Help":
        return <HelpSupport />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="seller-dashboard">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="content-area">
        <Header />
        <MainContent>{renderSection()}</MainContent>
      </div>
    </div>
  );
};

export default SellerDashboard;
*/}