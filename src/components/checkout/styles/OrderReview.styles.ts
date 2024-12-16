import styled from "styled-components";

export const OrderReviewCard = styled.div`
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

export const SectionTitle = styled.h4`
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const AddressDetails = styled.div`
  margin-bottom: 20px;

  p {
    margin: 0;
    color: #555;
  }

  a {
    color: #1890ff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
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

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    font-size: 16px;
    padding: 10px 20px;

    @media (max-width: 768px) {
      font-size: 14px;
      padding: 8px 16px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      padding: 6px 12px;
    }
  }
`;
