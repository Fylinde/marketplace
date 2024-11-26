import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spin, Table, DatePicker, Select, Alert, Button, Modal, Form, Input } from 'antd';
import { Line } from 'react-chartjs-2';
import { getLocalizedText } from '../../utils/localizationUtils';
import slaService from 'services/slaService'; // Hypothetical SLA-related API service
import { WebSocketService } from 'services/websocketService';
import { exportToCSV } from '@/components/utils/exportUtils';

const { RangePicker } = DatePicker;
const { Option } = Select;

const webSocketService = new WebSocketService('wss://your-websocket-url');


const TrackerContainer = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

const SLAComplianceTracker: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slaData, setSlaData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [slaGoalModalVisible, setSlaGoalModalVisible] = useState(false);

  useEffect(() => {
    fetchSlaData();
    setupWebSocketNotifications();
  }, [dateRange, category]);

  const fetchSlaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaService.getSLACompliance({
        dateRange,
        category,
      });
      setSlaData(response.tableData);
      setChartData(response.chartData);
    } catch (err: any) {
      setError(getLocalizedText('Error fetching SLA data.'));
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocketNotifications = () => {
    webSocketService.subscribe('sla-violations', (violation: { message: string }) => {
      alert(getLocalizedText('SLA Violation Alert: ') + violation.message);

    });
  };


  const handleExport = () => {
    exportToCSV(slaData, 'SLA_Report');
  };


  const handleSaveSlaGoal = async (values: { goal: string }) => {
    try {
      await slaService.saveSlaGoal(values.goal);
      alert(getLocalizedText('SLA Goal Saved Successfully!'));
      setSlaGoalModalVisible(false);
    } catch (err) {
      alert(getLocalizedText('Error saving SLA goal.'));
    }
  };


  const columns = [
    {
      title: getLocalizedText('Metric'),
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: getLocalizedText('Compliance Rate'),
      dataIndex: 'complianceRate',
      key: 'complianceRate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: getLocalizedText('Violations'),
      dataIndex: 'violations',
      key: 'violations',
    },
    {
      title: getLocalizedText('Recommendations'),
      dataIndex: 'recommendations',
      key: 'recommendations',
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <TrackerContainer>
      <Header>
        <h1>{getLocalizedText('SLA Compliance Tracker')}</h1>
        <div>
          <Button type="primary" onClick={() => setSlaGoalModalVisible(true)}>
            {getLocalizedText('Set SLA Goal')}
          </Button>
          <Button type="default" onClick={handleExport}>
            {getLocalizedText('Export as CSV')}
          </Button>
        </div>
      </Header>
      <FilterContainer>
        <RangePicker
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0].toISOString(), dates[1].toISOString()]);
            } else {
              setDateRange(null);
            }
          }}
        />
        <Select
          style={{ width: 200 }}
          placeholder={getLocalizedText('Select Category')}
          onChange={(value) => setCategory(value)}
          allowClear
        >
          <Option value="last7Days">{getLocalizedText('Last 7 Days')}</Option>
          <Option value="lastMonth">{getLocalizedText('Last Month')}</Option>
          <Option value="electronics">{getLocalizedText('Electronics')}</Option>
          <Option value="fashion">{getLocalizedText('Fashion')}</Option>
          <Option value="home">{getLocalizedText('Home')}</Option>
        </Select>
      </FilterContainer>
      {loading && <Spin size="large" />}
      {error && <Alert message={error} type="error" />}
      {chartData && (
        <Line
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: getLocalizedText('Compliance Rate'),
                data: chartData.data,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
              },
            ],
          }}
          options={chartOptions}
        />
      )}
      <StyledTable
        dataSource={slaData.map((item) => ({ key: item.metric, ...item }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        visible={slaGoalModalVisible}
        title={getLocalizedText('Set SLA Goal')}
        onCancel={() => setSlaGoalModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSaveSlaGoal}>
          <Form.Item
            label={getLocalizedText('SLA Goal')}
            name="goal"
            rules={[{ required: true, message: getLocalizedText('SLA goal is required') }]}
          >
            <Input placeholder={getLocalizedText('Enter SLA goal (e.g., 95% compliance)')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {getLocalizedText('Save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </TrackerContainer>
  );
};

export default SLAComplianceTracker;
