import styled from "styled-components";

export const CombinedFormContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const StyledButton = styled.button`
  background: #0073e6;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #005bb5;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

export const ProgressIndicator = styled.div`
  /* Progress bar styles */
`;
