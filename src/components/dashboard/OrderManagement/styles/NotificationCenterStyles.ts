import styled from "styled-components";

export const NotificationCenterContainer = styled.div`
  padding: 20px;
`;

export const NotificationList = styled.div`
  margin-top: 20px;

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;

      &.unread {
        background-color: #f9f9f9;
      }

      button {
        margin-left: 10px;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #0056b3;
        }

        &.mark-as-read {
          background-color: #28a745;

          &:hover {
            background-color: #218838;
          }
        }
      }
    }
  }
`;

export const NotificationDetails = styled.div`
  margin-top: 20px;

  p {
    margin: 10px 0;
  }
`;
