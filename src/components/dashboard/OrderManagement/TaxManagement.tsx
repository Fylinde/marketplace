import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/slices/reduxHooks';
import { fetchSellerTaxConfigurations, fetchSupportedCountries } from 'redux/slices/taxSlice';
import { Button, Table, Modal, Form, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import { getLocalizedText } from '../../utils/localizationUtils';

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
      title: getLocalizedText('Region'),
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: getLocalizedText('Tax Rate'),
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
        <h1>{getLocalizedText('Manage Taxes')}</h1>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          {getLocalizedText('Add Tax')}
        </Button>
      </Header>
      <Table columns={columns} dataSource={sellerTaxConfigs} loading={loading} />
      {error && <p>{getLocalizedText(error)}</p>}

      <Modal
        title={getLocalizedText('Add Tax Rate')}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddTax}>
          <Form.Item label={getLocalizedText('Region')} name="region" rules={[{ required: true }]}>
            <Select>
              {supportedCountries.map((country) => (
                <Select.Option value={country} key={country}>
                  {country}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={getLocalizedText('Tax Rate (%)')} name="rate" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {getLocalizedText('Save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </TaxManagementContainer>
  );
};

export default TaxManagement;

