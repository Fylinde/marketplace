import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { executeSearch } from "../../redux/slices/utils/searchSlice";
import ImageProcessor from "../../utils/imageProcessor";
import styled from "styled-components";
import Box from "../Box";
import Button from "../buttons/Button";
import type { AppDispatch } from '../../redux/store';


interface SearchUploaderProps {
  onUpload: (image: File) => void;
}

const StyledUploader = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  position: relative;
  cursor: pointer;
  background-color: #f9f9f9;

  .preview {
    margin-top: 10px;
    max-width: 100%;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .remove-button {
    margin-top: 10px;
  }

  input {
    display: none;
  }
`;

const SearchUploader: React.FC<SearchUploaderProps> = ({ onUpload }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const processedBlob = await ImageProcessor.processImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
          outputFormat: "image/jpeg",
        });
        const processedFile = ImageProcessor.blobToFile(processedBlob, file.name);
        setSelectedImage(processedFile);
        setPreviewUrl(URL.createObjectURL(processedFile));
        setError(null);
      } catch {
        setError("Failed to process the image. Please try again.");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      try {
        const processedBlob = await ImageProcessor.processImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
          outputFormat: "image/jpeg",
        });
        const processedFile = ImageProcessor.blobToFile(processedBlob, file.name);
        setSelectedImage(processedFile);
        setPreviewUrl(URL.createObjectURL(processedFile));
        setError(null);
      } catch {
        setError("Failed to process the image. Please try again.");
      }
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      onUpload(selectedImage);
      dispatch(
        executeSearch({
          query: '',
          image: selectedImage,
          filters: {},
        })
      );
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <Box>
      <StyledUploader onDragOver={handleDragOver} onDrop={handleDrop}>
        {!selectedImage ? (
          <>
            <p>Drag and drop an image here, or click to upload.</p>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </>
        ) : (
          <>
            <img
              src={previewUrl || ""}
              alt="Selected preview"
              className="preview"
            />
            <Button className="remove-button" onClick={handleRemoveImage}>
              Remove Image
            </Button>
          </>
        )}
      </StyledUploader>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button
        onClick={handleUpload}
        disabled={!selectedImage}
        style={{ marginTop: "10px" }}
      >
        Search with Image
      </Button>
    </Box>
  );
};

export default SearchUploader;
