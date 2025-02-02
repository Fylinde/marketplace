import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHistoricalExchangeRates } from "../../redux/slices/utils/exchangeRateSlice";
import { RootState } from "../../redux/store";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { DashboardContainer, DateRangeContainer, Button, DropdownContainer } from "./Styles/StyledRateDashboard";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const RateDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { historicalRates, loading, error } = useSelector(
    (state: RootState) => state.exchangeRate
  );

  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [endDate, setEndDate] = useState<string>("2024-12-01");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");

  const handleFetchRates = () => {
    dispatch(fetchHistoricalExchangeRates({ startDate, endDate }) as any);
  };

  useEffect(() => {
    handleFetchRates();
  }, []);

  if (loading) return <DashboardContainer>Loading historical rates...</DashboardContainer>;
  if (error) return <DashboardContainer>Error fetching historical rates: {error}</DashboardContainer>;

  const filteredRates = selectedCurrency === "all"
    ? historicalRates
    : historicalRates.map((rate) => ({
      date: rate.date,
      rates: { [selectedCurrency]: rate.rates[selectedCurrency] },
    }));

  const data = {
    labels: filteredRates.map((rate: { date: string }) => rate.date),
    datasets: Object.keys(filteredRates[0]?.rates || {}).map((currency) => ({
      label: currency,
      data: filteredRates.map((rate: { rates: Record<string, number> }) => rate.rates[currency]),
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw.toFixed(2)}`,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const, // Explicitly cast as one of the allowed types
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const, // Explicitly cast as one of the allowed types
        },
      },
    },
  };

  return (
    <DashboardContainer>
      <h4>Exchange Rate Trends</h4>

      <DateRangeContainer>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button onClick={handleFetchRates}>Fetch Rates</Button>
      </DateRangeContainer>

      <DropdownContainer>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="all">All Currencies</option>
          {Object.keys(historicalRates[0]?.rates || {}).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </DropdownContainer>

      <Line data={data} options={options} />
    </DashboardContainer>
  );
};

export default RateDashboard;
