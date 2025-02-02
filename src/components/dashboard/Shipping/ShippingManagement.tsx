import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import { fetchShippingMethods } from "../../../redux/slices/logistics/shippingSlice";
import shippingService from "../../../services/shippingService";
import { getLocalizedText, formatCurrency } from "../../../utils/localizationUtils";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import SellerDashboardLayout from "../../../components/layout/SellerDashboardLayout";
import DataInput from "../../../components/dataInput/DataInput";
import Button from "../../../components/buttons/Button";
import { Spin, Alert, Table, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ShippingData } from "../../../redux/slices/logistics/shippingSlice";


const ShippingManagementContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.colors.tableHeader};
    color: ${({ theme }) => theme.colors.text};
  }
  .ant-table-row {
    &:hover {
      background-color: ${({ theme }) => theme.colors.tableRowHover};
    }
  }
`;

interface ShippingManagementProps {
  shippingData: ShippingData[];
  loading: boolean;
  error: string | null;
}

const ShippingManagement: React.FC<ShippingManagementProps> = ({
  shippingData,
  loading,
  error,
}) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [newShippingMethod, setNewShippingMethod] = useState({
    name: "",
    rate: 0,
    currency: "USD",
    estimatedDelivery: "",
  });

  // Fetch data only if `shippingData` is not passed as a prop
  useEffect(() => {
    if (!shippingData) {
      dispatch(fetchShippingMethods({ country: "US", currency: "USD" })); // Pass arguments
    }
  }, [dispatch, shippingData]);

  const handleAddShippingMethod = async () => {
    try {
      await shippingService.addShippingMethod(newShippingMethod);
      setModalVisible(false);
      dispatch(fetchShippingMethods({ country: "US", currency: "USD" })); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteShippingMethod = async (methodId: string) => {
    try {
      await shippingService.deleteShippingMethod(methodId);
      dispatch(fetchShippingMethods({ country: "US", currency: "USD" })); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: getLocalizedText("Shipping Method", "shipping"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: getLocalizedText("Rate", "shipping"),
      dataIndex: "rate",
      key: "rate",
      render: (rate, record) => formatCurrency(rate, record.currency),
    },
    {
      title: getLocalizedText("Estimated Delivery", "shipping"),
      dataIndex: "estimatedDelivery",
      key: "estimatedDelivery",
    },
    {
      title: getLocalizedText("Actions", "shipping"),
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteShippingMethod(record.id)}>
          {getLocalizedText("Delete", "shipping")}
        </Button>
      ),
    },
  ];

  return (
    <SellerDashboardLayout>
      <ShippingManagementContainer>
        <DashboardPageHeader title={getLocalizedText("Shipping Management", "shipping")} />
        <HeaderContainer>
          <h3>{getLocalizedText("Manage Shipping Methods", "shipping")}</h3>
          <StyledButton onClick={() => setModalVisible(true)}>
            {getLocalizedText("Add New Shipping Method", "shipping")}
          </StyledButton>
        </HeaderContainer>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <StyledTable
            dataSource={
              shippingData?.length
                ? shippingData.map((data) => ({ key: data.id, ...data }))
                : [] // Fallback to an empty array if shippingData is unavailable
            }
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
        )}
        <Modal
          title={getLocalizedText("Add Shipping Method", "shipping")}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleAddShippingMethod}
        >
          <DataInput
            label={getLocalizedText("Shipping Name", "shipping")}
            value={newShippingMethod.name}
            onChange={(e) =>
              setNewShippingMethod({ ...newShippingMethod, name: e.target.value })
            }
          />
          <DataInput
            label={getLocalizedText("Rate", "shipping")}
            type="number"
            value={newShippingMethod.rate}
            onChange={(e) =>
              setNewShippingMethod({
                ...newShippingMethod,
                rate: parseFloat(e.target.value),
              })
            }
          />
          <DataInput
            label={getLocalizedText("Currency", "shipping")}
            value={newShippingMethod.currency}
            onChange={(e) =>
              setNewShippingMethod({ ...newShippingMethod, currency: e.target.value })
            }
          />
          <DataInput
            label={getLocalizedText("Estimated Delivery", "shipping")}
            value={newShippingMethod.estimatedDelivery}
            onChange={(e) =>
              setNewShippingMethod({
                ...newShippingMethod,
                estimatedDelivery: e.target.value,
              })
            }
          />
        </Modal>
      </ShippingManagementContainer>
    </SellerDashboardLayout>
  );
};

export default ShippingManagement;
