import React from "react";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import Warehouse from "../../../components/warehouse/Warehouse";
import { getLocalizedText } from "../../../utils/localizationUtils";

const WarehouseManager: React.FC = () => {
  return (
    <VendorDashboardLayout>
      <DashboardPageHeader title={getLocalizedText("Warehouse Management", "warehouse")} />
      <Warehouse />
    </VendorDashboardLayout>
  );
};

export default WarehouseManager;
