import styled from "styled-components";

export const SummaryCard = styled.div`
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
  }
`;

export const SummaryTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

export const DetailSection = styled.div`
  margin-bottom: 20px;

  h5 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }
`;

export const TotalsSection = styled.div`
  margin-top: 20px;

  p {
    margin: 5px 0;
    font-size: 16px;

    strong {
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    p {
      font-size: 14px;
    }
  }
`;
