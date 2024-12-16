import React from "react";
import { Pie, Line } from "react-chartjs-2";
import styled from "styled-components";
import { Spin, Alert } from "antd";
import { getLocalizedText } from "utils/localizationUtils";
import { Feedback } from "@/services/feedbackService";

const FeedbackContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
`;

interface Metrics {
  dates: string[];
  sales: number[];
  revenue: number[];
}

interface CustomerFeedbackProps {
  feedback: Feedback[];
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
}

const CustomerFeedback: React.FC<CustomerFeedbackProps> = ({ feedback, metrics, loading, error }) => {
  const sentimentCounts = feedback.reduce(
    (acc, feedback) => {
      acc[feedback.sentiment] += 1;
      return acc;
    },
    [0, 0, 0] // Initialize counts for Negative (0), Neutral (1), and Positive (2)
  );

  const sentimentChartData = {
    labels: [
      getLocalizedText("Positive", "feedback"),
      getLocalizedText("Neutral", "feedback"),
      getLocalizedText("Negative", "feedback"),
    ],
    datasets: [
      {
        data: sentimentCounts,
        backgroundColor: ["#4CAF50", "#FFEB3B", "#F44336"],
      },
    ],
  };

  const performanceChartData = metrics
    ? {
        labels: metrics.dates,
        datasets: [
          {
            label: getLocalizedText("Sales", "performance"),
            data: metrics.sales,
            borderColor: "blue",
            fill: false,
          },
          {
            label: getLocalizedText("Revenue", "performance"),
            data: metrics.revenue,
            borderColor: "green",
            fill: false,
          },
        ],
      }
    : null;

  return (
    <FeedbackContainer>
      <h2>{getLocalizedText("Customer Feedback", "feedback")}</h2>
      {loading && <Spin tip={getLocalizedText("Loading feedback...", "feedback")} />}
      {error && <Alert message={error} type="error" />}
      <Pie data={sentimentChartData} />

      <h2>{getLocalizedText("Performance Metrics", "performance")}</h2>
      {loading && <Spin tip={getLocalizedText("Loading performance metrics...", "performance")} />}
      {error && <Alert message={error} type="error" />}
      {performanceChartData && <Line data={performanceChartData} />}
    </FeedbackContainer>
  );
};

export default CustomerFeedback;
