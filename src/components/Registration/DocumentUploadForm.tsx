import React, { useState } from 'react';

interface DocumentUploadFormProps {
  onNext: (data: { documents: File[] }) => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onNext }) => {
  const [documents, setDocuments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments([...documents, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to next step
    onNext({ documents });
  };

  return (
    <form onSubmit={handleSubmit} className="document-upload-form">
      <h2>Document Upload</h2>
      <div>
        <label htmlFor="documents">Upload Documents</label>
        <input
          id="documents"
          type="file"
          multiple
          onChange={handleFileChange}
          required
        />
      </div>
      <button type="submit">Next</button>
    </form>
  );
};

export default DocumentUploadForm;
