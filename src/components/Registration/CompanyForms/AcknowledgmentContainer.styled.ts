import styled from 'styled-components';

export const AcknowledgmentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const TermsContainer = styled.div`
  margin-bottom: 20px;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;

  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 0.5rem;
  }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  input[type='checkbox'] {
    margin-right: 10px;
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border: none;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
