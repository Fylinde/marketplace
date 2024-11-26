import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'redux/slices/reduxHooks';
import { fetchShippingMethods, setSelectedMethod } from 'redux/slices/shippingSlice';
import shippingService from 'services/shippingService';
import { getLocalizedText } from '../../utils/localizationUtils';
import DashboardPageHeader from 'components/layout/DashboardPageHeader';
import VendorDashboardLayout from 'components/layout/VendorDashboardLayout';
import DataInput from 'components/dataInput/DataInput';
import { Button, Table, Modal, Switch, InputNumber, Form, Select, Spin, Alert } from 'antd';
import { ColumnsType } from 'antd/es/table';

const ShippingSettingContainer = styled.div`
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

const ShippingSetting: React.FC = () => {
  const dispatch = useAppDispatch();
  const { methods, loading, error } = useAppSelector((state) => state.shipping);
  const [regions, setRegions] = useState<Array<{ id: string; name: string; rate: number; currency: string }>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRegion, setEditingRegion] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<{ id: string; name: string; rate: number; currency: string } | null>(null);

  useEffect(() => {
    dispatch(fetchShippingMethods({ country: 'US', currency: 'USD' }));
    fetchRegions();
  }, [dispatch]);

  const fetchRegions = async () => {
    try {
      const response = await shippingService.getRegions();
      setRegions(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrUpdateRegion = async (values: { name: string; rate: number; currency: string }) => {
    try {
      if (editingRegion && currentRegion) {
        await shippingService.updateRegion({ ...currentRegion, ...values });
      } else {
        await shippingService.addRegion(values);
      }
      setModalVisible(false);
      fetchRegions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRegion = async (regionId: string) => {
    try {
      await shippingService.deleteRegion(regionId);
      fetchRegions();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: getLocalizedText('Region Name'),
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
      title: getLocalizedText('Actions'),
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => {
            setEditingRegion(true);
            setCurrentRegion(record);
            setModalVisible(true);
          }}>
            {getLocalizedText('Edit')}
          </Button>
          <Button danger onClick={() => handleDeleteRegion(record.id)}>
            {getLocalizedText('Delete')}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <VendorDashboardLayout>
      <ShippingSettingContainer>
        <DashboardPageHeader title={getLocalizedText('Shipping Settings')} />
        <HeaderContainer>
          <h3>{getLocalizedText('Manage Shipping Regions')}</h3>
          <StyledButton onClick={() => {
            setEditingRegion(false);
            setCurrentRegion(null);
            setModalVisible(true);
          }}>
            {getLocalizedText('Add New Region')}
          </StyledButton>
        </HeaderContainer>
        {loading && <Spin size="large" />}
        {error && <Alert message={error} type="error" />}
        <StyledTable
          dataSource={regions.map((region) => ({ key: region.id, ...region }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editingRegion ? getLocalizedText('Edit Region') : getLocalizedText('Add New Region')}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            onFinish={handleAddOrUpdateRegion}
            initialValues={currentRegion || { name: '', rate: 0, currency: 'USD' }}
          >
            <Form.Item
              label={getLocalizedText('Region Name')}
              name="name"
              rules={[{ required: true, message: getLocalizedText('Region name is required') }]}
            >
              <DataInput label={getLocalizedText('Region Name')} value="" onChange={() => { }} />
            </Form.Item>
            <Form.Item
              label={getLocalizedText('Rate')}
              name="rate"
              rules={[{ required: true, message: getLocalizedText('Rate is required') }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={getLocalizedText('Currency')}
              name="currency"
              rules={[{ required: true, message: getLocalizedText('Currency is required') }]}
            >
              <Select>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                {/* Add more currencies as needed */}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingRegion ? getLocalizedText('Update Region') : getLocalizedText('Add Region')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </ShippingSettingContainer>
    </VendorDashboardLayout>
  );
};

export default ShippingSetting;
