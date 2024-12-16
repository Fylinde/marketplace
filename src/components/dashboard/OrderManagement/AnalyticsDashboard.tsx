import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderHistory, fetchOrders } from "../../../redux/slices/orders/orderSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  DashboardContainer,
  DashboardHeader,
  KPIContainer,
  KPIBox,
  ChartsContainer,
  LoadingMessage,
  ErrorMessage,
} from "./styles/AnalyticDashboardStyles";


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, history, loading, error } = useSelector((state: RootState) => state.orders);

  // Fetch orders and order history on mount
  useEffect(() => {
    dispatch(fetchOrders({ page: 1, filters: {}, sort: "date" }));
    dispatch(fetchOrderHistory({ page: 1, filters: {} }));
  }, [dispatch]);

  // Normalize order statuses to lowercase for consistency
  const normalizedOrders = orders.map((order) => ({
    ...order,
    status: order.status.toLowerCase(),
  }));

  // Calculate key performance indicators (KPIs)
  const totalSales = normalizedOrders.reduce((sum, order) => sum + order.totalBuyerPrice, 0);
  const totalOrders = normalizedOrders.length;
  const pendingOrders = normalizedOrders.filter((order) => order.status === "pending").length;
  const completedOrders = normalizedOrders.filter((order) => order.status === "delivered").length;

  // Prepare data for order status distribution (Doughnut chart)
  const orderStatusData = {
    labels: [
      getLocalizedText("pending", "analytics"),
      getLocalizedText("processing", "analytics"),
      getLocalizedText("delivered", "analytics"),
      getLocalizedText("cancelled", "analytics"),
    ],
    datasets: [
      {
        data: [
          pendingOrders,
          normalizedOrders.filter((order) => order.status === "processing").length,
          completedOrders,
          normalizedOrders.filter((order) => order.status === "cancelled").length,
        ],
        backgroundColor: ["#FFCE56", "#36A2EB", "#4BC0C0", "#FF6384"],
        hoverBackgroundColor: ["#FFCE56", "#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  // Prepare data for monthly sales trends (Bar chart)
  const monthlySalesData = history.reduce((acc: Record<string, number>, order) => {
    const month = new Date(order.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + order.totalBuyerPrice;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(monthlySalesData),
    datasets: [
      {
        label: getLocalizedText("monthlySales", "analytics"),
        data: Object.values(monthlySalesData),
        backgroundColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  // Loading and error states
  if (loading) return <LoadingMessage>{getLocalizedText("loading", "common")}</LoadingMessage>;
  if (error)
    return (
      <ErrorMessage>
        {getLocalizedText("errorLoadingData", "analytics", { error })}
      </ErrorMessage>
    );

  return (
    <DashboardContainer>
      <DashboardHeader>{getLocalizedText("analyticDashboard", "analytics")}</DashboardHeader>

      {/* Key Performance Indicators */}
      <KPIContainer>
        <KPIBox>
          <h2>{getLocalizedText("totalSales", "analytics")}</h2>
          <p>{totalSales.toLocaleString(undefined, { style: "currency", currency: "USD" })}</p>
        </KPIBox>
        <KPIBox>
          <h2>{getLocalizedText("totalOrders", "analytics")}</h2>
          <p>{totalOrders}</p>
        </KPIBox>
        <KPIBox>
          <h2>{getLocalizedText("pendingOrders", "analytics")}</h2>
          <p>{pendingOrders}</p>
        </KPIBox>
        <KPIBox>
          <h2>{getLocalizedText("completedOrders", "analytics")}</h2>
          <p>{completedOrders}</p>
        </KPIBox>
      </KPIContainer>

      {/* Charts */}
      <ChartsContainer>
        {/* Doughnut Chart */}
        <div className="chart">
          <h2>{getLocalizedText("orderStatusDistribution", "analytics")}</h2>
          <Doughnut data={orderStatusData} />
        </div>

        {/* Bar Chart */}
        <div className="chart">
          <h2>{getLocalizedText("salesTrends", "analytics")}</h2>
          <Bar data={barChartData} />
        </div>
      </ChartsContainer>
    </DashboardContainer>
  );
};

export default AnalyticDashboard;