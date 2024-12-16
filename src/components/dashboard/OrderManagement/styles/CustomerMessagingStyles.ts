import styled from "styled-components";

export const MessagingContainer = styled.div`
  display: flex;
  gap: 20px;
`;

export const ConversationList = styled.div`
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

export const ActiveConversation = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;

  .message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 8px;

    &.incoming {
      background-color: #f9f9f9;
      align-self: flex-start;
    }

    &.outgoing {
      background-color: #d9edf7;
      align-self: flex-end;
    }
  }
`;

export const MessageInput = styled.div`
  display: flex;
  gap: 10px;

  textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
  }

  button {
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
