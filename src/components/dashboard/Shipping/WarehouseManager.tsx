import React from "react";
import SellerDashboardLayout from "../../../components/layout/SellerDashboardLayout";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import Warehouse from "../../../components/warehouse/Warehouse";
import { getLocalizedText } from "../../../utils/localizationUtils";

const WarehouseManager: React.FC = () => {
  return (
    <SellerDashboardLayout>
      <DashboardPageHeader title={getLocalizedText("Warehouse Management", "warehouse")} />
      <Warehouse />
    </SellerDashboardLayout>
  );
};

export default WarehouseManager;
