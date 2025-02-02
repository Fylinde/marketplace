import styled from "styled-components";

export const BusinessDocumentationFormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

export const StyledButton = styled.button`
  background: #0073e6;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #005bb5;
  }
`;

export const FileUploadArea = styled.div<{ dragOver: boolean }>`
  border: 2px dashed ${({ dragOver }) => (dragOver ? "#0073e6" : "#ccc")};
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
  transition: border-color 0.3s ease;
`;

export const UploadIcon = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const DragDropText = styled.p`
  font-size: 14px;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;
