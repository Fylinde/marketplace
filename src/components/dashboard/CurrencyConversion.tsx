import React, { useEffect } from "react";
import Box from "components/Box";
import Chart from "components/chart/Chart";
import { useAppDispatch, useAppSelector } from "../../redux/reduxHooks";
import { fetchCurrencyAnalytics } from "../../redux/slices/analytics/analyticsSlice";

const CurrencyConversion: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select analytics data from the Redux store
  const analyticsData = useAppSelector((state) => state.analytics.analyticsData);

  useEffect(() => {
    // Dispatch the thunk to fetch analytics data
    dispatch(fetchCurrencyAnalytics());
  }, [dispatch]);

  // Transform analytics data into chart data format
  const chartData = analyticsData.currencyBreakdown.map((entry) => ({
    name: entry.currency,
    value: entry.percentage,
  }));

  return (
    <Box>
      <h1>Currency Conversion Insights</h1>

      {/* Conversion Analytics Chart */}
      <Box>
        <h3>Currency Usage</h3>
        <Chart
          data={chartData}
          chartType="pie"
          dataKeys={{ name: "name", value: "value" }}
        />
      </Box>

      {/* Conversion Fee Overview */}
      <Box mt="20px">
        <h3>Conversion Fees</h3>
        <p>
          Total Fees Paid: {analyticsData.totalFees.toFixed(2)}{" "}
          {analyticsData.sellerCurrency}
        </p>
      </Box>
    </Box>
  );
};

export default CurrencyConversion;
