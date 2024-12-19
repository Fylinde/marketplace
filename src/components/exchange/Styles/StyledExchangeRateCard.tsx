import styled from "styled-components";

export const Card = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;

  h4 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-align: center;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #555;

    span {
      font-weight: bold;
      color: #007bff;
    }
  }
`;

export const RateList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RateItem = styled.div`
  font-size: 1rem;
  color: #333;

  strong {
    margin-right: 5px;
    color: #007bff;
  }
`;
