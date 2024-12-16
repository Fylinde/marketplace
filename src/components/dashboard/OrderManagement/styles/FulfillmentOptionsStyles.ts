import styled from "styled-components";

export const OptionsContainer = styled.div`
  padding: 20px;
`;

export const OptionsList = styled.div`
  margin-top: 20px;

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;

      button {
        margin-left: 10px;
        padding: 5px 10px;
        background-color: #5cb85c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #4cae4c;
        }

        &.delete {
          background-color: #d9534f;

          &:hover {
            background-color: #c9302c;
          }
        }
      }
    }
  }
`;

export const OptionsForm = styled.div`
  margin-top: 20px;

  input,
  select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
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
