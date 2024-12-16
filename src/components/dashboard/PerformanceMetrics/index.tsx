import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CustomerFeedback from "./CustomerFeedback";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchPerformance } from "../../../redux/slices/analytics/performanceSlice";
import { fetchAllFeedback } from "../../../redux/slices/support/feedbackSlice";

const PerformanceMetricsContainer = styled.div`
  padding: 20px;
`;

const PerformanceMetrics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redux selectors
  const metrics = useSelector((state: RootState) => state.performance.metrics);
  const feedback = useSelector((state: RootState) => state.feedback.feedbackList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchPerformance());
        await dispatch(fetchAllFeedback());
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PerformanceMetricsContainer>
      <h1>Performance Metrics</h1>
      <CustomerFeedback feedback={feedback} metrics={metrics} loading={loading} error={error} />
    </PerformanceMetricsContainer>
  );
};

export default PerformanceMetrics;
