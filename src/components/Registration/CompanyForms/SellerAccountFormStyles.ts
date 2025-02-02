import styled from "styled-components";

export const FormContainer = styled.div`
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  display: block;
  margin-top: 10px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;

export const BackButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #6c757d;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;
