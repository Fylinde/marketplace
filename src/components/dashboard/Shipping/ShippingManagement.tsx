import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'redux/slices/reduxHooks';
import { fetchShippingMethods, setSelectedMethod } from 'redux/slices/shippingSlice';
import shippingService from 'services/shippingService';
import { getLocalizedText } from '../../utils/localizationUtils';
import DashboardPageHeader from 'components/layout/DashboardPageHeader';
import VendorDashboardLayout from 'components/layout/VendorDashboardLayout';
import DataInput from 'components/dataInput/DataInput';
import Button from '@/components/buttons/Button';
import { Spin, Alert, Table, Modal } from 'antd';
import { ColumnsType } from 'antd/lib/table';




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

const ShippingManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { methods, selectedMethod, loading, error } = useAppSelector((state) => state.shipping);
  const [modalVisible, setModalVisible] = useState(false);
  const [newShippingMethod, setNewShippingMethod] = useState({
    name: '',
    rate: 0,
    currency: '',
    estimatedDelivery: '',
  });

  useEffect(() => {
    dispatch(fetchShippingMethods({ country: 'US', currency: 'USD' })); // Example params
  }, [dispatch]);

  const handleAddShippingMethod = async () => {
    try {
      await shippingService.addShippingMethod(newShippingMethod);
      setModalVisible(false);
      dispatch(fetchShippingMethods({ country: 'US', currency: 'USD' })); // Refresh methods
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteShippingMethod = async (methodId: string) => {
    try {
      await shippingService.deleteShippingMethod(methodId);
      dispatch(fetchShippingMethods({ country: 'US', currency: 'USD' })); // Refresh methods
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: getLocalizedText('Shipping Method'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: getLocalizedText('Rate'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate, record) => `${rate} ${record.currency}`,
    },
    {
      title: getLocalizedText('Estimated Delivery'),
      dataIndex: 'estimatedDelivery',
      key: 'estimatedDelivery',
    },
    {
      title: getLocalizedText('Actions'),
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => handleDeleteShippingMethod(record.id)}>
            {getLocalizedText('Delete')}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <VendorDashboardLayout>
      <ShippingManagementContainer>
        <DashboardPageHeader title={getLocalizedText('Shipping Management')} />
        <HeaderContainer>
          <h3>{getLocalizedText('Manage Shipping Methods')}</h3>
          <StyledButton onClick={() => setModalVisible(true)}>
            {getLocalizedText('Add New Shipping Method')}
          </StyledButton>
        </HeaderContainer>
        {loading && <Spin size="large" />}
        {error && <Alert message={error} type="error" />}
        <StyledTable
          dataSource={methods.map((method) => ({
            key: method.id,
            ...method,
          }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={getLocalizedText('Add Shipping Method')}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleAddShippingMethod}
        >
          <DataInput
            label={getLocalizedText('Shipping Name')}
            value={newShippingMethod.name}
            onChange={(e) => setNewShippingMethod({ ...newShippingMethod, name: e.target.value })}
          />
          <DataInput
            label={getLocalizedText('Rate')}
            type="number"
            value={newShippingMethod.rate}
            onChange={(e) => setNewShippingMethod({ ...newShippingMethod, rate: parseFloat(e.target.value) })}
          />
          <DataInput
            label={getLocalizedText('Currency')}
            value={newShippingMethod.currency}
            onChange={(e) => setNewShippingMethod({ ...newShippingMethod, currency: e.target.value })}
          />
          <DataInput
            label={getLocalizedText('Estimated Delivery')}
            value={newShippingMethod.estimatedDelivery}
            onChange={(e) =>
              setNewShippingMethod({ ...newShippingMethod, estimatedDelivery: e.target.value })
            }
          />
        </Modal>
      </ShippingManagementContainer>
    </VendorDashboardLayout>
  );
};

export default ShippingManagement;
