import styled from "styled-components";

export const ConverterContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  h4 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
`;

export const ConverterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ErrorText = styled.p`
  color: #ff5252;
  font-size: 0.9rem;
  text-align: center;
`;

export const ResultText = styled.p`
  color: #4caf50;
  font-size: 1.1rem;
  text-align: center;
  font-weight: bold;
`;
