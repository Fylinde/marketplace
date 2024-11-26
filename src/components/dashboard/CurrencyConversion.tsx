import React, { useState, useEffect } from "react";
import Box from "components/Box";
import Chart from "components/chart/Chart";
import { useAppDispatch, useAppSelector } from "../../redux/slices/reduxHooks";
import { fetchCurrencyAnalytics } from "../../redux/slices/analyticsSlice";

const CurrencyConversion: React.FC = () => {
  const dispatch = useAppDispatch();
  const { analyticsData } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCurrencyAnalytics());
  }, [dispatch]);

  return (
    <Box>
      <h1>Currency Conversion Insights</h1>

      {/* Conversion Analytics Chart */}
      <Box>
        <h3>Currency Usage</h3>
        <Chart
          data={analyticsData.currencyBreakdown.map((entry) => ({
            name: entry.currency,
            value: entry.percentage,
          }))}
          type="pie"
        />
      </Box>

      {/* Conversion Fee Overview */}
      <Box mt="20px">
        <h3>Conversion Fees</h3>
        <p>Total Fees Paid: {analyticsData.totalFees.toFixed(2)} {analyticsData.sellerCurrency}</p>
      </Box>
    </Box>
  );
};

export default CurrencyConversion;
