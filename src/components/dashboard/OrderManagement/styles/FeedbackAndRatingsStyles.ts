import styled from "styled-components";

export const FeedbackContainer = styled.div`
  display: flex;
  gap: 20px;
`;

export const FeedbackList = styled.div`
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
    }
  }
`;

export const FeedbackDetails = styled.div`
  flex: 1;

  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
  }

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

export const Summary = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    margin: 0;
  }
`;
