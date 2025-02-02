import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks';
import { fetchSellerTaxConfigurations, fetchSupportedCountries } from '../../../redux/slices/logistics/taxSlice';
import { Button, Table, Modal, Form, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import { getLocalizedText } from '../../../utils/localizationUtils';

const TaxManagementContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TaxManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sellerTaxConfigs, supportedCountries, loading, error } = useAppSelector((state) => state.tax);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  useEffect(() => {
    dispatch(fetchSellerTaxConfigurations('seller-id'));
    dispatch(fetchSupportedCountries());
  }, [dispatch]);

  const columns = [
    {
      title: getLocalizedText('Region', 'TaxManagement'),
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: getLocalizedText('Tax Rate', 'TaxManagement'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `${rate}%`,
    },
  ];

  const handleAddTax = (values: { region: string; rate: number }) => {
    console.log('Add tax', values);
    setIsModalVisible(false);
  };

  return (
    <TaxManagementContainer>
      <Header>
        <h1>{getLocalizedText('Manage Taxes', 'TaxManagement')}</h1>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          {getLocalizedText('Add Tax', 'TaxManagement')}
        </Button>
      </Header>
      <Table columns={columns} dataSource={sellerTaxConfigs} loading={loading} />
      {error && <p>{getLocalizedText(error, 'TaxManagement')}</p>}

      <Modal
        title={getLocalizedText('Add Tax Rate', 'TaxManagement')}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddTax}>
          <Form.Item
            label={getLocalizedText('Region', 'TaxManagement')}
            name="region"
            rules={[{ required: true }]}
          >
            <Select>
              {supportedCountries.map((country) => (
                <Select.Option value={country} key={country}>
                  {country}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={getLocalizedText('Tax Rate (%)', 'TaxManagement')}
            name="rate"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {getLocalizedText('Save', 'TaxManagement')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </TaxManagementContainer>
  );
};

export default TaxManagement;
