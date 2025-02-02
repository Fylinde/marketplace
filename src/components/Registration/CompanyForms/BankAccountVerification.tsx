import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BankAccountVerificationContainer,
  StyledInput,
  StyledButton,
  UploadButton,
  ErrorMessage,
  DragDropArea,
  UploadIcon,
  DragDropText,
} from "./BankAccountVerificationContainer.styled";
import { saveBankAccountDetailsThunk } from "../../../redux/slices/orders/paymentSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { BankAccountVerification as BankAccountVerificationType } from "../../../types/sharedTypes";

interface BankAccountVerificationProps {
  data: BankAccountVerificationType;
  onUpdate: (updatedData: Partial<BankAccountVerificationType>) => void;
  onProofUpload?: (file: File) => void;
  onNext: () => void;
}

const BankAccountVerification: React.FC<BankAccountVerificationProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.payments);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({
    accountNumber: "",
    bankName: "",
    routingCode: "",
    proofUpload: "",
    accountHolderName: "",
  });

  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9 ]{12,30}$/;

  const validateInput = (field: string, value: string) => {
    let errorMessage = "";
    const sanitizedValue = value.replace(/\s+/g, "");

    switch (field) {
      case "accountHolderName":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "Account holder name can only contain letters and spaces.";
        }
        break;
      case "accountNumber":
        if (!/^\d{8,20}$/.test(sanitizedValue)) {
          errorMessage = "Account number must be between 8 and 20 digits.";
        }
        break;
      case "bankName":
        if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
          errorMessage = "Bank name can only contain letters and spaces.";
        }
        break;
      case "routingCode":
        if (!ibanRegex.test(sanitizedValue)) {
          errorMessage = "Invalid IBAN format.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
    return errorMessage === "";
  };

  
  
  const handleInputChange = (field: keyof BankAccountVerificationType, value: string) => {
    onUpdate({ [field]: value });
    validateInput(field, value);
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setProofFile(file);
      onUpdate({
        proofOfBankOwnership: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
      });
      setErrors((prevErrors) => ({ ...prevErrors, proofUpload: "" }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        proofUpload: "Please upload a valid image file.",
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleNext = async () => {
    if (!data.accountNumber || !data.bankName || !data.routingCode || !proofFile) {
      alert("Please complete all fields and upload the proof of ownership.");
      return;
    }

    try {
      const resultAction = await dispatch(
        saveBankAccountDetailsThunk({ data, proofFile })
      ).unwrap();

      if (resultAction === "unverified") {
        alert("Bank account submitted for verification.");
        onNext(); // Proceed to the next step
      }
    } catch (err) {
      console.error("Failed to save bank account details:", err);
      alert("Failed to save bank account details. Please try again.");
    }
  };

  return (
    <BankAccountVerificationContainer>
      <h1>Bank Account Verification</h1>
      <p>Verify your bank account to receive payments securely.</p>
      <label htmlFor="accountHolderName">Account Holder Name</label>
      <StyledInput
        id="accountHolderName"
        placeholder="Enter account holder name"
        value={data.accountHolderName || ""}
        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
      />
      {errors.accountHolderName && <ErrorMessage>{errors.accountHolderName}</ErrorMessage>}


      <label htmlFor="accountNumber">Bank Account Number</label>
      <StyledInput
        id="accountNumber"
        placeholder="Enter your account number"
        value={data.accountNumber}
        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
      />
      {errors.accountNumber && <ErrorMessage>{errors.accountNumber}</ErrorMessage>}

      <label htmlFor="bankName">Bank Name</label>
      <StyledInput
        id="bankName"
        placeholder="Enter your bank name"
        value={data.bankName}
        onChange={(e) => handleInputChange("bankName", e.target.value)}
      />
      {errors.bankName && <ErrorMessage>{errors.bankName}</ErrorMessage>}

      <label htmlFor="routingCode">Routing/Sort Code/IBAN</label>
      <StyledInput
        id="routingCode"
        placeholder="Enter your routing code or IBAN"
        value={data.routingCode}
        onChange={(e) => handleInputChange("routingCode", e.target.value)}
      />
      {errors.routingCode && <ErrorMessage>{errors.routingCode}</ErrorMessage>}

      <p>
      Upload a valid proof of ownership, such as a bank statement or a screenshot of your account details.
      Accepted formats: JPG, PNG, PDF.
    </p>
      <DragDropArea
        dragOver={dragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon>📁</UploadIcon>
        <DragDropText>
          Drag and drop your proof of ownership here or{" "}
          <UploadButton onClick={() => document.getElementById("fileInput")?.click()}>
            browse
          </UploadButton>
        </DragDropText>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
      </DragDropArea>
      {errors.proofUpload && <ErrorMessage>{errors.proofUpload}</ErrorMessage>}
      {proofFile && <p>File uploaded: {proofFile.name}</p>}

      <StyledButton onClick={handleNext} disabled={loading}>
        {loading ? "Submitting..." : "Next"}
      </StyledButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </BankAccountVerificationContainer>
  );
};

export default BankAccountVerification;
