import styled from "styled-components";

export const StepsContainer = styled.div`
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 95%;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const StepTitle = styled.div`
  font-size: 16px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const StepDescription = styled.div`
  font-size: 14px;
  color: #888;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;
