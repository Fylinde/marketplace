import styled from 'styled-components';

export const BusinessDocumentationFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: auto;

  label {
    font-weight: bold;
  }

  input,
  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
`;

export const FileUpload = styled.input`
  border: none;
`;
