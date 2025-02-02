import styled from "styled-components";

export const IdentityVerificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
`;

export const StyledSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

export const UploadButton = styled.button`
  background: #0073e6;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #005bb5;
  }
`;

export const CaptureButton = styled.button`
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #1e7e34;
  }
`;

export const StyledVideo = styled.video`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

export const StyledCanvas = styled.canvas`
  display: none; /* Display when capturing */
`;

export const StatusMessage = styled.p`
  color: #ff5722;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const NextButton = styled.button`
  background: #0073e6;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #005bb5;
  }

  &:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
`;
