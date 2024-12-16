import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import { fetchRecommendations } from "@/redux/slices/support/aiSlice";
import { WebSocketService } from "services/websocketService";
import priceService from "services/priceService";
import discountService from "@/services/discountService";
import { exportToCSV } from "@/utils/exportUtils";
import { Spin, Card, List, Alert, Typography, Button, Tooltip } from "antd";
import styled from "styled-components";
import { getLocalizedText } from "../../../utils/localizationUtils";
import { Recommendation as BaseRecommendation } from "../../../types/Recommendation";
import { AppDispatch, RootState } from "redux/store";
import { useSelector, useDispatch } from "react-redux";

const { Title } = Typography;

export interface RecommendationWithSuggestedValue extends BaseRecommendation {
  suggestedValue: number;
}

interface RecommendationListProps {
  title: string;
  recommendations: RecommendationWithSuggestedValue[];
  loading: boolean;
  error?: string | null;
  applyAction: (productId: string, value: number) => void;
  actionLabel: string;
}

// Props type for the BusinessRecommendations component
interface BusinessRecommendationsProps {
  sellerId: string;
  buyerId: string;
  region: string;
  season: string;
  targetAudience: string;
}

const RecommendationsContainer = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const webSocketService = new WebSocketService("wss://your-websocket-url");

const RecommendationList: React.FC<RecommendationListProps> = ({
  title,
  recommendations,
  loading,
  error,
  applyAction,
  actionLabel,
}) => (
  <Section>
    <Title level={3}>{title}</Title>
    {loading && <Spin />}
    {error && <Alert message={error} type="error" />}
    {!loading && !error && (
      <List
        bordered
        dataSource={recommendations}
        renderItem={(recommendation) => (
          <List.Item>
            <Card
              title={`${getLocalizedText("Product ID", "recommendations")}: ${recommendation.productId
                }`}
              bordered={false}
            >
              <p>
                {getLocalizedText("Current Price", "recommendations")}:{" "}
                {recommendation.currentPrice ?? "N/A"}
              </p>
              <p>
                {getLocalizedText("Suggested Value", "recommendations")}:{" "}
                {recommendation.suggestedValue}
              </p>
              <Tooltip title={recommendation.reason}>
                <span>
                  {getLocalizedText("Reason", "recommendations")}:{" "}
                  {recommendation.reason ?? "N/A"}
                </span>
              </Tooltip>
              <Button
                type="primary"
                onClick={() =>
                  applyAction(
                    recommendation.productId,
                    recommendation.suggestedValue
                  )
                }
              >
                {actionLabel}
              </Button>
            </Card>
          </List.Item>
        )}
      />
    )}
  </Section>
);

const BusinessRecommendations: React.FC<BusinessRecommendationsProps> = ({
  sellerId,
  buyerId,
  region,
  season,
  targetAudience,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recommendations, loading, error } = useSelector(
    (state: RootState) => state.ai
  );

  useEffect(() => {
    dispatch(fetchRecommendations({ type: "price", sellerId, region }));
    dispatch(fetchRecommendations({ type: "discount", sellerId, season }));
    dispatch(fetchRecommendations({ type: "marketing", sellerId, targetAudience }));
    dispatch(fetchRecommendations({ type: "buyer-focused", buyerId }));

    webSocketService.subscribe("business-recommendations", (data: any) => {
      dispatch(
        fetchRecommendations({
          type: data.type,
          sellerId,
          region,
          season,
          targetAudience,
        })
      );
    });

    return () => {
      webSocketService.unsubscribe("business-recommendations");
    };
  }, [dispatch, sellerId, buyerId, region, season, targetAudience]);

  const applyPrice = async (productId: string, price: number) => {
    try {
      await priceService.updatePrice({ productId, price });
      alert(getLocalizedText("Price updated successfully!", "recommendations"));
    } catch {
      alert(getLocalizedText("Failed to update price.", "recommendations"));
    }
  };

  const applyDiscount = async (productId: string, discount: number) => {
    try {
      await discountService.updateDiscount({ productId, discount });
      alert(getLocalizedText("Discount updated successfully!", "recommendations"));
    } catch {
      alert(getLocalizedText("Failed to update discount.", "recommendations"));
    }
  };

  const exportRecommendations = () => {
    exportToCSV(recommendations, "BusinessRecommendations");
  };

  const priceRecommendations = recommendations
    .filter((rec): rec is BaseRecommendation => rec.type === "price")
    .map((rec) => ({
      ...rec,
      suggestedValue: rec.suggestedPrice ?? rec.suggestedDiscount ?? 0,
    }));

  const discountRecommendations = recommendations
    .filter((rec): rec is BaseRecommendation => rec.type === "discount")
    .map((rec) => ({
      ...rec,
      suggestedValue: rec.suggestedDiscount ?? rec.suggestedPrice ?? 0,
    }));

  return (
    <RecommendationsContainer>
      <Button type="default" onClick={exportRecommendations}>
        {getLocalizedText("Export to CSV", "recommendations")}
      </Button>

      <RecommendationList
        title={getLocalizedText("Pricing Recommendations", "recommendations")}
        recommendations={priceRecommendations}
        loading={loading}
        error={error}
        applyAction={applyPrice}
        actionLabel={getLocalizedText("Apply Price", "recommendations")}
      />

      <RecommendationList
        title={getLocalizedText("Discount Recommendations", "recommendations")}
        recommendations={discountRecommendations}
        loading={loading}
        error={error}
        applyAction={applyDiscount}
        actionLabel={getLocalizedText("Apply Discount", "recommendations")}
      />
    </RecommendationsContainer>
  );
};

export default BusinessRecommendations;
