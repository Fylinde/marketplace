import styled from "styled-components";

// Container for the verification form
export const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

// Title styling
export const Title = styled.h2`
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
`;

// Styled input field
export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
`;

// Button styling
export const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

// Message styling
export const Message = styled.p<{ isError?: boolean }>`
  font-size: 14px;
  color: ${({ isError }) => (isError ? "red" : "green")};
  margin-top: 10px;
`;

