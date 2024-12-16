import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from "../../../redux/slices/dashboard/dashboardSlice"; // Redux slice for dashboard
import { getLocalizedText } from "../../../utils/localizationUtils";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AppDispatch, RootState } from "../../../redux/store";

// Types for Dashboard Data
interface SalesData {
  sales: number;
  date: string;
}

interface InventoryData {
  value: number;
  status: string;
  color: string;
}

interface TrafficData {
  totalVisitors: number;
  conversionRate: number;
}

interface DashboardState {
  salesData: SalesData[];
  inventoryData: InventoryData[];
  trafficData: TrafficData;
  achievements: string[];
  loading: boolean;
}

// Styled Components for Layout
const DashboardContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;

const WidgetContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ChartContainer = styled.div`
  height: 200px;
  width: 100%;
`;

const Metric = styled.p`
  font-size: 1.25rem;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;


// Dashboard Component
const PersonalizedDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select data from Redux store
  const { salesData, inventoryData, trafficData, achievements, loading } = useSelector(
    (state: RootState): DashboardState => state.dashboard
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <p>{getLocalizedText("loading", "dashboard")}</p>;
  }

  return (
    <DashboardContainer>
      {/* Sales Trends Widget */}
      <WidgetContainer>
        <Title>{getLocalizedText("salesTrends", "dashboard")}</Title>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Metric>
          {getLocalizedText("totalSales", "dashboard")}: $
          {salesData.reduce((sum: number, item: SalesData) => sum + item.sales, 0)}
        </Metric>
      </WidgetContainer>

      {/* Inventory Health Widget */}
      <WidgetContainer>
        <Title>{getLocalizedText("inventoryHealth", "dashboard")}</Title>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={inventoryData} dataKey="value" nameKey="status" outerRadius={80}>
                {inventoryData.map((entry: InventoryData, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Metric>
          {getLocalizedText("lowStock", "dashboard")}:{" "}
          {inventoryData.find((item: InventoryData) => item.status === "Low")?.value || 0}
        </Metric>
      </WidgetContainer>

      {/* Traffic Insights Widget */}
      <WidgetContainer>
        <Title>{getLocalizedText("trafficInsights", "dashboard")}</Title>
        <Metric>
          {getLocalizedText("totalVisitors", "dashboard")}: {trafficData.totalVisitors}
        </Metric>
        <Metric>
          {getLocalizedText("conversionRate", "dashboard")}: {trafficData.conversionRate}%
        </Metric>
      </WidgetContainer>

      {/* Achievements Widget */}
      <WidgetContainer>
        <Title>{getLocalizedText("achievements", "dashboard")}</Title>
        <ul>
          {achievements.map((achievement: string, index: number) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </WidgetContainer>
    </DashboardContainer>
  );
};

export default PersonalizedDashboard;