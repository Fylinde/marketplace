import styled from "styled-components";

export const OrderCard = styled.div`
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

export const OrderHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 20px;
    }

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }
`;

export const OrderDetails = styled.div`
  margin-bottom: 20px;

  strong {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  span {
    display: block;
    margin-bottom: 10px;
    color: #555;
  }
`;

export const SummaryList = styled.div`
  margin-bottom: 20px;

  .ant-list-item {
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

export const PriceDetails = styled.div`
  margin-top: 20px;
  font-size: 16px;

  strong {
    font-weight: bold;
  }

  span {
    display: block;
    margin-bottom: 5px;
    color: #444;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
