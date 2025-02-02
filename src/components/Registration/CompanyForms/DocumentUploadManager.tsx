import React from 'react';
import { DocumentUploadContainer } from './DocumentUpload.styled';
import DocumentUpload from './DocumentUpload'; // Import the simple DocumentUpload component

// Define the interface for managing individual documents
interface DocumentUploadType {
  file: File | null; // The file itself
  fileName: string; // Name of the file
  uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed'; // Current upload status
  uploadError: string | null; // Any error associated with the upload
}

// Define the interface for the document manager props
interface DocumentUploadProps {
  data: DocumentUploadType[]; // Array of uploaded documents
  status: 'idle' | 'uploading' | 'succeeded' | 'failed'; // Overall upload status
  error: string | null; // Any global error for the upload process
  onAddDocument: (newDocument: DocumentUploadType) => void; // Callback to add a new document
  onRemoveDocument: (fileName: string) => void; // Callback to remove a document
  onReset: () => void; // Callback to reset all uploads
  onNext: () => void; // Callback to proceed to the next step
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
  // This function handles single file selection
  const handleFileChange = (file: File) => {
    const newDocument: DocumentUploadType = {
      file, // Store the selected file
      fileName: file.name, // Use the file's name as its identifier
      uploadStatus: 'idle', // Initial status
      uploadError: null, // No error initially
    };
    onAddDocument(newDocument); // Add the new document to the manager
  };

  return (
    <DocumentUploadContainer>
      <h2>Document Upload</h2>
  
      {/* Show status feedback to the user */}
      {status === 'uploading' && <p style={{ color: 'blue' }}>Uploading documents...</p>}
      {status === 'succeeded' && <p style={{ color: 'green' }}>All documents uploaded successfully!</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>Some documents failed to upload. Please try again.</p>}
  
      {/* Use DocumentUpload for single file selection */}
      {/* This allows the user to select and upload one file at a time */}
      <DocumentUpload
      label="Upload Document"
      onFileChange={handleFileChange}
    />

      {/* Display any global error for the upload process */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Render a list of all uploaded documents */}
      <ul>
      {data.map((doc) => (
        <li key={doc.fileName}>
          {doc.fileName} - Status: {doc.uploadStatus}
          <button onClick={() => onRemoveDocument(doc.fileName)}>Remove</button>
        </li>
      ))}
    </ul>

      {/* Reset all uploaded documents */}
      <button onClick={onReset}>Reset Documents</button>

      {/* Proceed to the next step */}
      <button onClick={onNext}>Next</button>
    </DocumentUploadContainer>
  );
};

export default DocumentUploadManager;
