import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/slices/reduxHooks';
import { fetchRecommendations } from 'redux/slices/aiSlice';
import { WebSocketService } from 'services/websocketService';
import priceService from 'services/priceService';
import { Line } from 'react-chartjs-2';
import { Spin, Card, List, Alert, Typography, Button, Tooltip } from 'antd';
import styled from 'styled-components';
import { exportToCSV } from 'components/utils/exportUtils';
import { getLocalizedText } from '../../utils/localizationUtils';
import discountService from '@/services/discountService';



const { Title } = Typography;

const RecommendationsContainer = styled.div`
  padding: 20px;
`;

const webSocketService = new WebSocketService('wss://your-websocket-url');

const Section = styled.div`
  margin-bottom: 20px;
`;

const BusinessRecommendations: React.FC<{
  sellerId: string;
  buyerId: string;
  region: string;
  season: string;
  targetAudience: string;
}> = ({ sellerId, buyerId, region, season, targetAudience }) => {
  const dispatch = useAppDispatch();

  const { recommendations, loading, error } = useAppSelector((state) => state.ai);

  useEffect(() => {
    // Fetch recommendations
    dispatch(fetchRecommendations({ type: 'price', sellerId, region }));
    dispatch(fetchRecommendations({ type: 'discount', sellerId, season }));
    dispatch(fetchRecommendations({ type: 'marketing', sellerId, targetAudience }));
    dispatch(fetchRecommendations({ type: 'buyer-focused', buyerId }));

    // Subscribe to WebSocket for real-time updates
    webSocketService.subscribe('business-recommendations', (data: any) => {
      dispatch(fetchRecommendations({ type: data.type, sellerId, region, season, targetAudience }));
      dispatch(fetchRecommendations({ type: data.type, buyerId }));
    });

    return () => {
      webSocketService.unsubscribe('business-recommendations');
    };
  }, [dispatch, sellerId, buyerId, region, season, targetAudience]);

  const applyPrice = async (productId: string, price: number) => {
    try {
      await priceService.updatePrice({ productId, price });
      alert(getLocalizedText('Price updated successfully!', 'recommendations'));
    } catch (err) {
      alert(getLocalizedText('Failed to update price.', 'recommendations'));
    }
  };

  const applyDiscount = async (productId: string, discount: number) => {
    try {
      await discountService.updateDiscount({ productId, discount });
      alert(getLocalizedText('Discount updated successfully!', 'recommendations'));
    } catch (err) {
      alert(getLocalizedText('Failed to update discount.', 'recommendations'));
    }
  };

  const exportRecommendations = () => {
    exportToCSV(recommendations, 'BusinessRecommendations');
  };

  return (
    <RecommendationsContainer>
      <Button type="default" onClick={exportRecommendations}>
        {getLocalizedText('Export to CSV', 'recommendations')}
      </Button>

      {/* Pricing Recommendations Section */}
      <Section>
        <Title level={3}>{getLocalizedText('Pricing Recommendations', 'recommendations')}</Title>
        {loading && <Spin />}
        {error && <Alert message={error} type="error" />}
        {!loading && !error && (
          <>
            <Line
              data={{
                labels: recommendations
                  .filter((rec) => rec.type === 'price')
                  .map((rec) => rec.productId),
                datasets: [
                  {
                    label: getLocalizedText('Current Price', 'recommendations'),
                    data: recommendations
                      .filter((rec) => rec.type === 'price')
                      .map((rec) => rec.currentPrice),
                    borderColor: 'blue',
                    fill: false,
                  },
                  {
                    label: getLocalizedText('Suggested Price', 'recommendations'),
                    data: recommendations
                      .filter((rec) => rec.type === 'price')
                      .map((rec) => rec.suggestedPrice),
                    borderColor: 'green',
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
            <List
              bordered
              dataSource={recommendations.filter((rec) => rec.type === 'price')}
              renderItem={(recommendation) => (
                <List.Item>
                  <Card title={`${getLocalizedText('Product ID', 'recommendations')}: ${recommendation.productId}`} bordered={false}>
                    <p>{getLocalizedText('Current Price', 'recommendations')}: {recommendation.currentPrice ?? 'N/A'}</p>
                    <p>{getLocalizedText('Suggested Price', 'recommendations')}: {recommendation.suggestedPrice ?? 'N/A'}</p>
                    <Tooltip title={recommendation.reason}>
                      <span>{getLocalizedText('Reason', 'recommendations')}: {recommendation.reason}</span>
                    </Tooltip>
                    <Button type="primary" onClick={() => applyPrice(recommendation.productId, recommendation.suggestedPrice ?? 0)}>
                      {getLocalizedText('Apply Price', 'recommendations')}
                    </Button>
                  </Card>
                </List.Item>
              )}
            />
          </>
        )}
      </Section>

      {/* Discount Recommendations Section */}
      <Section>
        <Title level={3}>{getLocalizedText('Discount Recommendations', 'recommendations')}</Title>
        {loading && <Spin />}
        {error && <Alert message={error} type="error" />}
        {!loading && !error && (
          <List
            bordered
            dataSource={recommendations.filter((rec) => rec.type === 'discount')}
            renderItem={(recommendation) => (
              <List.Item>
                <Card title={`${getLocalizedText('Product ID', 'recommendations')}: ${recommendation.productId}`} bordered={false}>
                  <p>{getLocalizedText('Current Price', 'recommendations')}: {recommendation.currentPrice ?? 'N/A'}</p>
                  <p>{getLocalizedText('Suggested Discount', 'recommendations')}: {recommendation.suggestedDiscount ?? 'N/A'}</p>
                  <Tooltip title={recommendation.reason}>
                    <span>{getLocalizedText('Reason', 'recommendations')}: {recommendation.reason}</span>
                  </Tooltip>
                  <Button type="primary" onClick={() => applyDiscount(recommendation.productId, recommendation.suggestedDiscount ?? 0)}>
                    {getLocalizedText('Apply Discount', 'recommendations')}
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Section>
    </RecommendationsContainer>
  );
};

export default BusinessRecommendations;

