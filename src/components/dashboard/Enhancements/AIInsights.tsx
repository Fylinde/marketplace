import React from 'react';
import styled from 'styled-components';
import { getLocalizedText } from '../../../utils/localizationUtils';

// Styled-components for responsiveness
const Container = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.25rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.8rem;
    }
  }
`;

// Placeholder data for AI insights
interface Insight {
  title: string;
  detail: string;
}

interface AIInsightsProps {
  insights?: Insight[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights = [] }) => {
  return (
    <Container>
      <Title>{getLocalizedText('aiInsightsTitle', 'chatbot')}</Title>
      <InsightsGrid>
        {insights.map((insight, index) => (
          <InsightCard key={index}>
            <h3>{getLocalizedText(insight.title, 'chatbot')}</h3>
            <p>{getLocalizedText(insight.detail, 'chatbot')}</p>
          </InsightCard>
        ))}
      </InsightsGrid>
    </Container>
  );
};

export default AIInsights;

