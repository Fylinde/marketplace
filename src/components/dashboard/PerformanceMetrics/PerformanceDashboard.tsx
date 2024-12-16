import React, { useState, useEffect } from "react";
import { Tabs, Card, Spin, Alert } from "antd";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import { fetchPerformance } from "redux/slices/analytics/performanceSlice";
import { fetchAllFeedback } from "@/redux/slices/support/feedbackSlice";
import CustomerFeedback from "./CustomerFeedback";
import { getLocalizedText } from "utils/localizationUtils";

const DashboardContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  .overview-card {
    margin-bottom: 20px;
  }
`;

const PerformanceDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  // Performance metrics and feedback data
  const { metrics, loading: performanceLoading, error: performanceError } = useAppSelector(
    (state) => state.performance
  );
  const { feedbackList, loading: feedbackLoading, error: feedbackError } = useAppSelector(
    (state) => state.feedback
  );

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Fetch performance metrics and feedback on mount
    dispatch(fetchPerformance());
    dispatch(fetchAllFeedback());
  }, [dispatch]);

  const renderOverview = () => (
    <div>
      <Card className="overview-card" title={getLocalizedText("Sales Performance", "performance")}>
        {performanceLoading ? (
          <Spin tip={getLocalizedText("Loading sales performance...", "performance")} />
        ) : performanceError ? (
          <Alert message={performanceError} type="error" />
        ) : metrics ? (
          <p>{getLocalizedText("Total Sales", "performance")}: {metrics.sales}</p>
        ) : (
          <p>{getLocalizedText("No data available", "performance")}</p>
        )}
      </Card>

      <Card className="overview-card" title={getLocalizedText("Revenue Performance", "performance")}>
        {performanceLoading ? (
          <Spin tip={getLocalizedText("Loading revenue performance...", "performance")} />
        ) : performanceError ? (
          <Alert message={performanceError} type="error" />
        ) : metrics ? (
          <p>{getLocalizedText("Total Revenue", "performance")}: {metrics.revenue}</p>
        ) : (
          <p>{getLocalizedText("No data available", "performance")}</p>
        )}
      </Card>

      <Card className="overview-card" title={getLocalizedText("Coupon Performance", "performance")}>
        {performanceLoading ? (
          <Spin tip={getLocalizedText("Loading coupon performance...", "performance")} />
        ) : performanceError ? (
          <Alert message={performanceError} type="error" />
        ) : metrics ? (
          <div>
            <p>{getLocalizedText("Coupons Used", "performance")}: {metrics.couponsUsed}</p>
            <p>{getLocalizedText("Coupon Revenue", "performance")}: {metrics.couponRevenue}</p>
          </div>
        ) : (
          <p>{getLocalizedText("No data available", "performance")}</p>
        )}
      </Card>
    </div>
  );

  return (
    <DashboardContainer>
      <h2>{getLocalizedText("Performance Dashboard", "performance")}</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab} defaultActiveKey="overview">
        <Tabs.TabPane tab={getLocalizedText("Overview", "performance")} key="overview">
          {renderOverview()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={getLocalizedText("Customer Feedback", "performance")} key="feedback">
          <CustomerFeedback
            feedback={feedbackList}
            metrics={metrics}
            loading={performanceLoading || feedbackLoading}
            error={performanceError || feedbackError}
          />
        </Tabs.TabPane>
        {/* Additional tabs for other performance sectors */}
      </Tabs>
    </DashboardContainer>
  );
};

export default PerformanceDashboard;
