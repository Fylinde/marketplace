import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks';
import { fetchRecommendations } from '../../redux/slices/support/aiSlice';
import { Spin, Card, Alert } from 'antd';
import styled from 'styled-components';
import { getLocalizedText } from '../../utils/localizationUtils'; // Use getLocalizedText for translations

const RecommendationContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ProductRecommendations: React.FC<{ buyerId: string; language: string; currency: string }> = ({
  buyerId,
  language,
  currency,
}) => {
  const dispatch = useAppDispatch();
  const { recommendations, loading, error } = useAppSelector((state) => state.ai);

  useEffect(() => {
    dispatch(fetchRecommendations({ type: 'buyer-focused', buyerId, language, currency }));
  }, [buyerId, language, currency, dispatch]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={getLocalizedText(error, 'ai')} type="error" />; // Localized error message

  return (
    <RecommendationContainer>
      {recommendations.map((recommendation) => (
        <Card
          key={recommendation.productId}
          cover={<img alt={recommendation.name} src={recommendation.imageUrl || 'placeholder.jpg'} />}
        >
          <Card.Meta
            title={recommendation.name}
            description={`${recommendation.price} ${recommendation.currency}`}
          />
        </Card>
      ))}
    </RecommendationContainer>
  );
};

export default ProductRecommendations;
