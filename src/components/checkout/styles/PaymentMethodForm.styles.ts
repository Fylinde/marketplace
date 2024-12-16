import styled from "styled-components";

export const FormContainer = styled.div`
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const FormTitle = styled.h4`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const CheckboxContainer = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    label {
      font-size: 12px;
    }
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 20px;
  text-align: right;

  button {
    font-size: 16px;
    padding: 10px 20px;

    @media (max-width: 768px) {
      font-size: 14px;
      padding: 8px 16px;
    }
  }

  button:first-child {
    margin-right: 10px;

    @media (max-width: 768px) {
      margin-right: 5px;
    }
  }
`;

export const ErrorAlert = styled.div`
  margin-bottom: 20px;
`;

export const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
