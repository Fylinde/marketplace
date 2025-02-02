import React, { useState } from "react";
import {
  BusinessDocumentationFormContainer,
  StyledInput,
  StyledButton,
  FileUploadArea,
  UploadIcon,
  DragDropText,
  ErrorMessage,
 } from "./BusinessDocumentationFormContainer.styles";
import { BusinessDocumentation as BusinessDocumentationType } from "../../../types/sharedTypes";

interface BusinessDocumentationFormProps {
  data: BusinessDocumentationType;
  onUpdate: (updatedData: Partial<BusinessDocumentationType>) => void;
  onNext: () => void;
}

const BusinessDocumentationForm: React.FC<BusinessDocumentationFormProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [businessRegistrationFile, setBusinessRegistrationFile] = useState<File | null>(null);
  const [taxDocumentFile, setTaxDocumentFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({
    documentNumber: "",
    issuingAuthority: "",
    taxIdNumber: "",
    taxCountryOfResidence: "",
    businessRegistrationDocument: "",
    taxDocument: "",
  });

  const validateInput = (field: string, value: string) => {
    let errorMessage = "";

    if (value.trim() === "") {
      errorMessage = `${field} is required.`;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
    return errorMessage === "";
  };

  const handleInputChange = (field: keyof BusinessDocumentationType, value: string) => {
    onUpdate({ [field]: value });
    validateInput(field, value);
  };

  const handleFileUpload = (field: keyof BusinessDocumentationType, file: File | null) => {
    if (file) {
      if (field === "businessRegistrationDocument") {
        setBusinessRegistrationFile(file);
      } else if (field === "taxDocument") {
        setTaxDocumentFile(file);
      }

      onUpdate({
        [field]: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      });
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    } else {
      if (field === "businessRegistrationDocument") {
        setBusinessRegistrationFile(null);
      } else if (field === "taxDocument") {
        setTaxDocumentFile(null);
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${field} is required.`,
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (field: keyof BusinessDocumentationType, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(field, file);
    }
  };

  return (
    <BusinessDocumentationFormContainer>
      <h2>Business Documentation</h2>
      <p>Provide the required documentation for your business registration.</p>

      {/* Business Registration Document */}
      <label>Business Registration Document</label>
      <FileUploadArea
        dragOver={dragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop("businessRegistrationDocument", e)}
      >
        <UploadIcon>📁</UploadIcon>
        <DragDropText>
          Drag and drop your file here or{" "}
          <span
            onClick={() => document.getElementById("businessRegistrationFile")?.click()}
            style={{ color: "#0073e6", cursor: "pointer", textDecoration: "underline" }}
          >
            browse
          </span>
        </DragDropText>
        <input
          type="file"
          id="businessRegistrationFile"
          style={{ display: "none" }}
          onChange={(e) =>
            handleFileUpload("businessRegistrationDocument", e.target.files?.[0] || null)
          }
        />
      </FileUploadArea>
      {businessRegistrationFile && <p>Selected File: {businessRegistrationFile.name}</p>}
      {errors.businessRegistrationDocument && (
        <ErrorMessage>{errors.businessRegistrationDocument}</ErrorMessage>
      )}

      {/* Document Number */}
      <label>Document Number</label>
      <StyledInput
        type="text"
        value={data.documentNumber}
        onChange={(e) => handleInputChange("documentNumber", e.target.value)}
        placeholder="Enter your document number"
      />
      {errors.documentNumber && <ErrorMessage>{errors.documentNumber}</ErrorMessage>}

      {/* Issuing Authority */}
      <label>Issuing Authority</label>
      <StyledInput
        type="text"
        value={data.issuingAuthority}
        onChange={(e) => handleInputChange("issuingAuthority", e.target.value)}
        placeholder="Enter issuing authority"
      />
      {errors.issuingAuthority && <ErrorMessage>{errors.issuingAuthority}</ErrorMessage>}

      {/* Tax ID Number */}
      <label>Tax ID Number</label>
      <StyledInput
        type="text"
        value={data.taxIdNumber}
        onChange={(e) => handleInputChange("taxIdNumber", e.target.value)}
        placeholder="Enter your tax ID number"
      />
      {errors.taxIdNumber && <ErrorMessage>{errors.taxIdNumber}</ErrorMessage>}

      {/* Tax Document */}
      <label>Tax Document</label>
      <FileUploadArea
        dragOver={dragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop("taxDocument", e)}
      >
        <UploadIcon>📁</UploadIcon>
        <DragDropText>
          Drag and drop your file here or{" "}
          <span
            onClick={() => document.getElementById("taxDocumentFile")?.click()}
            style={{ color: "#0073e6", cursor: "pointer", textDecoration: "underline" }}
          >
            browse
          </span>
        </DragDropText>
        <input
          type="file"
          id="taxDocumentFile"
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload("taxDocument", e.target.files?.[0] || null)}
        />
      </FileUploadArea>
      {taxDocumentFile && <p>Selected File: {taxDocumentFile.name}</p>}
      {errors.taxDocument && <ErrorMessage>{errors.taxDocument}</ErrorMessage>}

      {/* Country of Tax Residence */}
      <label>Country of Tax Residence</label>
      <StyledInput
        type="text"
        value={data.taxCountryOfResidence}
        onChange={(e) => handleInputChange("taxCountryOfResidence", e.target.value)}
        placeholder="Enter your country of tax residence"
      />
      {errors.taxCountryOfResidence && (
        <ErrorMessage>{errors.taxCountryOfResidence}</ErrorMessage>
      )}

      <StyledButton onClick={onNext}>Next</StyledButton>
    </BusinessDocumentationFormContainer>
  );
};

export default BusinessDocumentationForm;
