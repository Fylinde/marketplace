import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
`;

export const DisputeList = styled.div`
  width: 30%;
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
    }
  }
`;

export const DisputeDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  textarea {
    margin-top: 15px;
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #4cae4c;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
