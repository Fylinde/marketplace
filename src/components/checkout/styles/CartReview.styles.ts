import styled from "styled-components";

interface SummaryTextProps {
    strong?: boolean;
}
  

export const CartContainer = styled.div`
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 95%;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const RecommendationsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 480px) {
    gap: 10px;
    justify-content: center;
  }
`;

export const RecommendationCard = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;

  @media (max-width: 768px) {
    width: 100px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    width: 80px;
    padding: 6px;
  }
`;

export const RecommendationImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
`;

export const CartSummaryContainer = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

export const SummaryText = styled.p<SummaryTextProps>`
  margin: 5px 0;
  font-size: 16px;
  font-weight: ${({ strong }) => (strong ? "bold" : "normal")};

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const ProceedButton = styled.div`
  margin-top: 30px;
  text-align: right;

  button {
    font-size: 16px;
    padding: 10px 20px;
  }

  @media (max-width: 480px) {
    text-align: center;

    button {
      width: 100%;
      font-size: 14px;
      padding: 8px 15px;
    }
  }
`;
