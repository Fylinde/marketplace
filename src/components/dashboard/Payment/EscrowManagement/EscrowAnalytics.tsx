import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEscrowAnalytics } from "../../../../redux/slices/orders/escrowSlice";
import { Chart } from "react-chartjs-2";
import { getLocalizedText } from "../../../../utils/localizationUtils";
import type { AppDispatch } from "../../../../redux/store";

const EscrowAnalytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, loading, error } = useSelector((state: any) => state.escrow);

  useEffect(() => {
    dispatch(fetchEscrowAnalytics());
  }, [dispatch]);

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) return <p>{getLocalizedText("error", "common", { error })}</p>;

  const data = {
    labels: analytics.trends.map((t: any) => t.date),
    datasets: [
      {
        label: "Disputes",
        data: analytics.trends.map((t: any) => t.disputes),
        borderColor: "red",
      },
      {
        label: "Resolutions",
        data: analytics.trends.map((t: any) => t.resolutions),
        borderColor: "green",
      },
    ],
  };

  return (
    <div>
      <h2>Escrow Analytics</h2>
      <Chart type="line" data={data} />
      <h3>{getLocalizedText("escrowAnalytics", "escrow")}</h3>
      <ul>
        <li>
          {getLocalizedText("totalDisputes", "escrow")}: {analytics.disputeCount}
        </li>
        <li>
          {getLocalizedText("averageReleaseTime", "escrow")}: {analytics.averageReleaseTime.toFixed(2)} seconds
        </li>
        <li>
          <strong>{getLocalizedText("statusCounts", "escrow")}</strong>
          <ul>
            {Object.entries(analytics.statusCounts as Record<string, number>).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default EscrowAnalytics;
