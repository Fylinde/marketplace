import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import VendorOrderList from "components/orders/VendorOrderList";
import React from "react";

const Orders = () => {
  return (
    <div>
      <DashboardPageHeader title="Orders" iconName="bag_filled" />
      <VendorOrderList />
    </div>
  );
};

Orders.layout = VendorDashboardLayout;

export default Orders;
