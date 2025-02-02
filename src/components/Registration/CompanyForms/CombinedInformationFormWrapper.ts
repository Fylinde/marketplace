import styled from "styled-components";

export const CombinedFormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
  text-align: center;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: #555;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    color: #333;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 3px #007bff;
    }
  }

  .name-group {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
    }
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
