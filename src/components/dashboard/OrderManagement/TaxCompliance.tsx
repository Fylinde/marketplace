import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Table, Alert, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'redux/slices/reduxHooks';
import { fetchTaxRates } from 'redux/slices/taxSlice';
import { getLocalizedText } from '../../utils/localizationUtils';

const ComplianceContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TaxCompliance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { taxRates, loading, error } = useAppSelector((state) => state.tax);

  useEffect(() => {
    dispatch(fetchTaxRates({ country: 'US' })); // Replace 'US' with dynamic country selection if needed
  }, [dispatch]);

  const columns = [
    {
      title: getLocalizedText('Region'),
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: getLocalizedText('Category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: getLocalizedText('Tax Rate'),
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: getLocalizedText('Due Date'),
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) => new Date(dueDate).toLocaleDateString(),
    },
    {
      title: getLocalizedText('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'overdue' ? (
          <span style={{ color: 'red' }}>{getLocalizedText('Overdue')}</span>
        ) : (
          <span style={{ color: 'green' }}>{getLocalizedText('Compliant')}</span>
        ),
    },
  ];

  return (
    <ComplianceContainer>
      <Header>
        <h1>{getLocalizedText('Tax Compliance Tracker')}</h1>
      </Header>
      {loading && <Spin size="large" />}
      {error && <Alert message={error} type="error" />}
      <Table
        columns={columns}
        dataSource={taxRates.map((rate) => ({
          key: rate.id,
          region: rate.region || getLocalizedText('National'),
          category: rate.category || getLocalizedText('All Categories'),
          rate: rate.rate,
          dueDate: new Date().toISOString(), // Placeholder for actual due date
          status: Math.random() > 0.5 ? 'compliant' : 'overdue', // Simulate compliance
        }))}
        pagination={{ pageSize: 10 }}
      />
    </ComplianceContainer>
  );
};

export default TaxCompliance;
