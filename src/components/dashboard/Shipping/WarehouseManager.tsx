import React from 'react';
import VendorDashboardLayout from 'components/layout/VendorDashboardLayout';
import DashboardPageHeader from 'components/layout/DashboardPageHeader';
import Warehouse from 'components/warehouse/Warehouse';

const WarehouseManagement: React.FC = () => {
  return (
    <VendorDashboardLayout>
      <DashboardPageHeader title="Warehouse Management" />
      <Warehouse />
    </VendorDashboardLayout>
  );
};

export default WarehouseManagement;
