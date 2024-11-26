import React from 'react';
import { DocumentUploadContainer, UploadButton } from './DocumentUpload.styled';

interface DocumentUploadProps {
  label: string;
  onFileChange: (file: File) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ label, onFileChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <DocumentUploadContainer>
      <label>{label}</label>
      <UploadButton>
        <input type="file" onChange={handleFileChange} />
      </UploadButton>
    </DocumentUploadContainer>
  );
};

export default DocumentUpload;
