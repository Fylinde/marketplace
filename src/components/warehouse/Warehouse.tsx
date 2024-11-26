import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'redux/slices/reduxHooks';
import {
  fetchWarehouses,
  fetchRecommendations,
  fetchSharedInventory,
} from 'redux/slices/warehouseSlice';
import warehouseService from '../../services/warehouseService';
import { Table, Button, Spin, Modal, Alert } from 'antd';
import { getLocalizedText } from '../utils/localizationUtils';
import WarehouseForm from './WarehouseForm';

const WarehouseContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: ${({ theme }) => theme.colors.tableHeader};
  }
  .ant-table-row {
    &:hover {
      background-color: ${({ theme }) => theme.colors.tableRowHover};
    }
  }
`;

const RecommendationsSection = styled.div`
  margin-top: 40px;
`;

const SharedInventorySection = styled.div`
  margin-top: 40px;
`;

const Warehouse: React.FC = () => {
  const dispatch = useAppDispatch();
  const { warehouses, recommendations, sharedInventory, loading, error } = useAppSelector((state) => state.warehouse);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<{ id?: string; name: string; location: string } | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchWarehouses());
    dispatch(fetchRecommendations());
    dispatch(fetchSharedInventory());
  }, [dispatch]);

  const handleDelete = async (warehouseId: string) => {
    try {
      await warehouseService.deleteWarehouse(warehouseId);
      dispatch(fetchWarehouses());
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: getLocalizedText('Warehouse Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: getLocalizedText('Location'),
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: getLocalizedText('Actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <div>
          <Button
            onClick={() => {
              setEditingWarehouse(record);
              setModalVisible(true);
            }}
          >
            {getLocalizedText('Edit')}
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            {getLocalizedText('Delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <WarehouseContainer>
      <Header>
        <h1>{getLocalizedText('Manage Warehouses')}</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingWarehouse(undefined);
            setModalVisible(true);
          }}
        >
          {getLocalizedText('Add Warehouse')}
        </Button>
      </Header>
      {loading && <Spin size="large" />}
      {error && <Alert message={error} type="error" />}
      <StyledTable
        dataSource={warehouses.map((warehouse) => ({ key: warehouse.id, ...warehouse }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        visible={modalVisible}
        title={editingWarehouse ? getLocalizedText('Edit Warehouse') : getLocalizedText('Add Warehouse')}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <WarehouseForm
          initialValues={editingWarehouse}
          onFinish={() => {
            setModalVisible(false);
            dispatch(fetchWarehouses());
          }}
        />
      </Modal>

      <RecommendationsSection>
        <h2>{getLocalizedText('AI Recommendations')}</h2>
        <StyledTable
          dataSource={recommendations.map((rec) => ({
            key: rec.productId,
            productId: rec.productId,
            warehouseId: rec.warehouseId,
            suggestedStock: rec.suggestedStock,
          }))}
          columns={[
            {
              title: getLocalizedText('Product ID'),
              dataIndex: 'productId',
              key: 'productId',
            },
            {
              title: getLocalizedText('Warehouse ID'),
              dataIndex: 'warehouseId',
              key: 'warehouseId',
            },
            {
              title: getLocalizedText('Suggested Stock'),
              dataIndex: 'suggestedStock',
              key: 'suggestedStock',
            },
          ]}
          pagination={{ pageSize: 5 }}
        />
      </RecommendationsSection>

      <SharedInventorySection>
        <h2>{getLocalizedText('Shared Inventory')}</h2>
        <StyledTable
          dataSource={sharedInventory.map((item) => ({ key: item.id, ...item }))}
          columns={[
            { title: getLocalizedText('Seller Name'), dataIndex: 'sellerName', key: 'sellerName' },
            { title: getLocalizedText('Product Name'), dataIndex: 'productName', key: 'productName' },
            { title: getLocalizedText('Quantity'), dataIndex: 'quantity', key: 'quantity' },
          ]}
          pagination={{ pageSize: 5 }}
        />
      </SharedInventorySection>
    </WarehouseContainer>
  );
};

export default Warehouse;
