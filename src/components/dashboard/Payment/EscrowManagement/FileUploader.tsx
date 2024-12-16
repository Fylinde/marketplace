import React, { useState } from "react";

const FileUploader = ({ onUpload }: { onUpload: (files: File[]) => void }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...event.target.files]);
    }
  };

  const handleUpload = () => {
    onUpload(files);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUploader;
