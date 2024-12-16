import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHooks';
import { fetchShippingMethods } from '@/redux/slices/logistics/shippingSlice';
import shippingService from 'services/shippingService';
import { getLocalizedText, formatCurrency } from '../../../utils/localizationUtils';
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


interface ShippingSettingsProps {
  onUpdate: (settings: any) => void;
}

const ShippingSettings: React.FC<ShippingSettingsProps> = ({ onUpdate }) => {
  const [settings, setSettings] = useState({
    autoDispatch: false,
    defaultWarehouse: "",
  });
  const dispatch = useAppDispatch();
  const { methods, loading, error } = useAppSelector((state) => state.shipping);
  const [regions, setRegions] = useState<
    Array<{ id: string; name: string; rate: number; currency: string }>
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRegion, setEditingRegion] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<{
    id: string;
    name: string;
    rate: number;
    currency: string;
  } | null>(null);

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

  const handleSubmit = () => {
    onUpdate(settings);
  };

  const module = 'shipping'; // Define the module name once for reuse
  const columns: ColumnsType<any> = [
    {
      title: getLocalizedText('Region Name', module),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: getLocalizedText('Rate', module),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate, record) => formatCurrency(rate, record.currency),
    },
    {
      title: getLocalizedText('Actions', module),
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            onClick={() => {
              setEditingRegion(true);
              setCurrentRegion(record);
              setModalVisible(true);
            }}
          >
            {getLocalizedText('Edit', module)}
          </Button>
          <Button danger onClick={() => handleDeleteRegion(record.id)}>
            {getLocalizedText('Delete', module)}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <VendorDashboardLayout>
      <ShippingSettingContainer>
        <DashboardPageHeader title={getLocalizedText('Shipping Settings', module)} />
        <HeaderContainer>
          <h3>{getLocalizedText('Manage Shipping Regions', module)}</h3>
          <StyledButton
            onClick={() => {
              setEditingRegion(false);
              setCurrentRegion(null);
              setModalVisible(true);
            }}
          >
            {getLocalizedText('Add New Region', module)}
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
          title={editingRegion ? getLocalizedText('Edit Region', module) : getLocalizedText('Add New Region', module)}
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
              label={getLocalizedText('Region Name', module)}
              name="name"
              rules={[{ required: true, message: getLocalizedText('Region name is required', module) }]}
            >
              <DataInput
                label={getLocalizedText('Region Name', module)}
                value={currentRegion?.name || ''}
                onChange={() => { }}
              />
            </Form.Item>
            <Form.Item
              label={getLocalizedText('Rate', module)}
              name="rate"
              rules={[{ required: true, message: getLocalizedText('Rate is required', module) }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={getLocalizedText('Currency', module)}
              name="currency"
              rules={[{ required: true, message: getLocalizedText('Currency is required', module) }]}
            >
              <Select>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                {/* Add more currencies as needed */}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingRegion ? getLocalizedText('Update Region', module) : getLocalizedText('Add Region', module)}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </ShippingSettingContainer>
    </VendorDashboardLayout>
  );
};

export default ShippingSettings;

