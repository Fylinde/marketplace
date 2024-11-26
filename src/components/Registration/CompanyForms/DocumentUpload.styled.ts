import styled from 'styled-components';

export const DocumentUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const UploadButton = styled.div`
  margin-top: 10px;
  border: 1px dashed #007bff;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  color: #007bff;
  border-radius: 5px;

  input {
    display: none;
  }
`;
