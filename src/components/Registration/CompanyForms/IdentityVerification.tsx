import React, { useState, useRef } from 'react';
import {
  IdentityVerificationContainer,
  StyledSelect,
  StyledInput,
} from './IdentityVerificationContainer.styled';
import { IdentityVerification as IdentityVerificationType } from '../../../redux/slices/registrationSlice';

interface IdentityVerificationProps {
  data: IdentityVerificationType;
  onUpdate: (updatedData: Partial<IdentityVerificationType>) => void;
  onNext: () => void;
  onIDUpload: (file: File) => void;
  onSelfieUpload: (file: File) => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  data,
  onUpdate,
  onNext,
  onIDUpload,
  onSelfieUpload,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleInputChange = (field: keyof IdentityVerificationType, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleFileSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    uploadHandler: (file: File) => void,
    type: string
  ) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setStatusMessage(`No file selected for ${type}.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setStatusMessage(`Please upload a valid image file.`);
      return;
    }

    uploadHandler(file);

    onUpdate({
      [`${type}Metadata` as keyof IdentityVerificationType]: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });

    setStatusMessage(`${type} uploaded successfully.`);
  };

  return (
    <IdentityVerificationContainer>
      <label>ID Type</label>
      <StyledSelect
        value={data.idType}
        onChange={(e) => handleInputChange('idType', e.target.value)}
      >
        <option value="">Select ID Type</option>
        <option value="Passport">Passport</option>
        <option value="Driver’s License">Driver’s License</option>
        <option value="National ID">National ID</option>
      </StyledSelect>

      <label>Upload Government-Issued ID</label>
      <input
        type="file"
        id="id-upload"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelection(e, onIDUpload, 'idDocument')}
      />
      <button onClick={() => document.getElementById('id-upload')?.click()}>
        Upload ID
      </button>

      <button onClick={onNext}>Next</button>
    </IdentityVerificationContainer>
  );
};

export default IdentityVerification;
