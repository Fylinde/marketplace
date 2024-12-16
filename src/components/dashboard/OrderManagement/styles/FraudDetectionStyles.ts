import styled from "styled-components";

export const FraudContainer = styled.div`
  display: flex;
  gap: 20px;
`;

export const FraudList = styled.div`
  width: 40%;
  border-right: 1px solid #ddd;

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #ddd;

      &.active {
        background-color: #f0f0f0;
      }

      button {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #d9534f;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #c9302c;
        }
      }
    }
  }
`;

export const FraudDetails = styled.div`
  flex: 1;

  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #4cae4c;
    }
  }
`;

export const FraudInsights = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 5px;
    }
  }
`;
