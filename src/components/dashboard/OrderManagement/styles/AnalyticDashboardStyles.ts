import styled from "styled-components";

export const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const DashboardHeader = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

export const KPIContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

export const KPIBox = styled.div`
  flex: 1 1 calc(25% - 20px);
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.25rem;
    margin-bottom: 10px;
    color: #666;
  }

  p {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 20px);
  }

  @media (max-width: 480px) {
    flex: 1 1 100%;
  }
`;

export const ChartsContainer = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;

  .chart {
    flex: 1 1 calc(50% - 15px);
    background: white;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 1.25rem;
      margin-bottom: 20px;
      color: #333;
    }

    canvas {
      width: 100%;
      height: auto;
    }

    @media (max-width: 768px) {
      flex: 1 1 100%;
    }
  }
`;

export const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

export const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #d9534f;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c2c7;
  border-radius: 4px;
`;

