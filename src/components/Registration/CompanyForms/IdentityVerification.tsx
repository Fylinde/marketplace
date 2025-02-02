import React, { useState, useRef } from "react";
import {
  IdentityVerificationContainer,
  StyledSelect,
  UploadButton,
  CaptureButton,
  StyledVideo,
  StyledCanvas,
  StatusMessage,
  ActionButtons,
  NextButton,
} from "./IdentityVerificationContainer.styled";
import { IdentityVerification as IdentityVerificationType } from "../../../types/sharedTypes";

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

  // Handle ID type selection
  const handleInputChange = (field: keyof IdentityVerificationType, value: string) => {
    onUpdate({ [field]: value });
  };

  // Handle file uploads
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
    if (!file.type.startsWith("image/")) {
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

  // Handle selfie capture
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setStatusMessage("Camera access denied. Please enable camera access.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 300);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            onSelfieUpload(file);
            setStatusMessage("Selfie captured successfully.");
          }
        });
      }
    }
    closeCamera();
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <IdentityVerificationContainer>
      <h1>Identity Verification</h1>
      <p>Ensure your identity is verified to comply with our security requirements.</p>

      <label>ID Type</label>
      <StyledSelect
        value={data.idType}
        onChange={(e) => handleInputChange("idType", e.target.value)}
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
        style={{ display: "none" }}
        onChange={(e) => handleFileSelection(e, onIDUpload, "idDocument")}
      />
      <UploadButton onClick={() => document.getElementById("id-upload")?.click()}>
        Upload ID
      </UploadButton>

      <h2>Take a Selfie</h2>
      {!isCameraOpen ? (
        <CaptureButton onClick={openCamera}>Open Camera</CaptureButton>
      ) : (
        <div>
          <StyledVideo ref={videoRef} autoPlay muted />
          <StyledCanvas ref={canvasRef} width={300} height={300} />
          <ActionButtons>
            <CaptureButton onClick={capturePhoto}>Capture Photo</CaptureButton>
            <CaptureButton onClick={closeCamera}>Close Camera</CaptureButton>
          </ActionButtons>
        </div>
      )}

      {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}

      <ActionButtons>
        <NextButton onClick={onNext}>Next</NextButton>
      </ActionButtons>
    </IdentityVerificationContainer>
  );
};

export default IdentityVerification;
