import styled from 'styled-components';

export const TaxFormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #fff;

    &:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
    }
  }
`;

export const ErrorText = styled.div`
  font-size: 14px;
  color: red;
  margin-top: 5px;
`;

export const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const OptionalText = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 5px;
`;

