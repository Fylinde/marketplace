import CustomerDashboardLayout from "../../components/layout/CustomerDashboardLayout";
import CustomerOrderList from "../../components/orders/CustomerOrderList";
import React from "react";

const Orders = () => {
  return <CustomerOrderList />;
};

Orders.layout = CustomerDashboardLayout;

export default Orders;
