import React from 'react';
import { DocumentUploadContainer, UploadButton } from './DocumentUpload.styled';

interface DocumentUploadType {
  file: File | null;
  fileName: string;
  uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed';
  uploadError: string | null;
}

interface DocumentUploadProps {
  data: DocumentUploadType[];
  status: 'idle' | 'uploading' | 'succeeded' | 'failed';
  error: string | null;
  onAddDocument: (newDocument: DocumentUploadType) => void;
  onRemoveDocument: (fileName: string) => void;
  onReset: () => void;
  onNext: () => void;
}

const DocumentUploadManager: React.FC<DocumentUploadProps> = ({
  data,
  status,
  error,
  onAddDocument,
  onRemoveDocument,
  onReset,
  onNext,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newDocument: DocumentUploadType = {
        file,
        fileName: file.name,
        uploadStatus: 'idle',
        uploadError: null,
      };
      onAddDocument(newDocument);
    }
  };

  return (
    <DocumentUploadContainer>
      <h2>Document Upload</h2>

      <label>Upload Document</label>
      <UploadButton>
        <input type="file" onChange={handleFileChange} />
      </UploadButton>

      {error && <p>Error: {error}</p>}
      <ul>
        {data.map((doc) => (
          <li key={doc.fileName}>
            {doc.fileName} - Status: {doc.uploadStatus}
            <button onClick={() => onRemoveDocument(doc.fileName)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={onReset}>Reset Documents</button>
      <button onClick={onNext}>Next</button>
    </DocumentUploadContainer>
  );
};

export default DocumentUploadManager;
