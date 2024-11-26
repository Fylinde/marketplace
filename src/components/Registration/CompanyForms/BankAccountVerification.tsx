import React, { useState, useRef } from 'react';
import { BankAccountVerificationContainer, StyledInput } from './BankAccountVerificationContainer.styled';
import { BankAccountVerification as BankAccountVerificationType } from '../../../redux/slices/registrationSlice';

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
  // Local state for file
  const [proofFile, setProofFile] = useState<File | null>(null);

  // Error state for form fields
  const [errors, setErrors] = useState({
    accountNumber: '',
    bankName: '',
    routingCode: '',
    proofUpload: '',
  });

  // Regular expressions for validation
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9 ]{12,30}$/;

  // Validation function
  const validateInput = (field: string, value: string) => {
    let errorMessage = '';
    const sanitizedValue = value.replace(/\s+/g, ''); // Remove spaces before validation

    switch (field) {
      case 'accountNumber':
        if (!/^\d{8,20}$/.test(sanitizedValue)) {
          errorMessage = 'Invalid account number. It should be between 8 and 20 digits.';
        }
        break;
      case 'bankName':
        if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
          errorMessage = 'Invalid bank name. Only letters and spaces are allowed.';
        }
        break;
      case 'routingCode':
        if (!ibanRegex.test(sanitizedValue)) {
          errorMessage = 'Invalid IBAN format. Please enter a valid IBAN.';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
    return errorMessage === '';
  };

  // Handle input changes for text fields
  const handleInputChange = (field: keyof BankAccountVerificationType, value: string) => {
    onUpdate({ [field]: value });
    validateInput(field, value);
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setProofFile(file); // Store the actual file locally
      onUpdate({
        proofOfBankOwnership: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      });
      setErrors((prevErrors) => ({ ...prevErrors, proofUpload: '' }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        proofUpload: 'Please upload a valid image file.',
      }));
    }
  };

  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file upload
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <BankAccountVerificationContainer>
      <label>Bank Account Number</label>
      <StyledInput
        placeholder="12345678"
        value={data.accountNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('accountNumber', e.target.value)
        }
      />
      {errors.accountNumber && <p style={{ color: 'red' }}>{errors.accountNumber}</p>}

      <label>Bank Name</label>
      <StyledInput
        placeholder="Bank Name"
        value={data.bankName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('bankName', e.target.value)
        }
      />
      {errors.bankName && <p style={{ color: 'red' }}>{errors.bankName}</p>}

      <label>Routing/Sort Code/IBAN</label>
      <StyledInput
        placeholder="GB29 NWBK 6016 1331 9268 19" // Example format for IBAN
        value={data.routingCode}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('routingCode', e.target.value)
        }
      />
      {errors.routingCode && <p style={{ color: 'red' }}>{errors.routingCode}</p>}

      <div>
        <label>Upload Proof of Bank Account Ownership</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        <button type="button" onClick={triggerFileUpload}>
          Upload Proof
        </button>
        {errors.proofUpload && <p style={{ color: 'red' }}>{errors.proofUpload}</p>}
      </div>

      <button type="button" onClick={onNext}>
        Next
      </button>
    </BankAccountVerificationContainer>
  );
};

export default BankAccountVerification;
