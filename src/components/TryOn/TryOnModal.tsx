import React from "react";
import styled from "styled-components";
import TryOn from "./TryOn";

interface TryOnModalProps {
  isOpen: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  productId: number; // Product ID to pass to TryOn
  fetchAsset: (productId: number) => Promise<string>; // Function to fetch asset
}

const TryOnModal: React.FC<TryOnModalProps> = ({ isOpen, onClose, productId, fetchAsset }) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <ModalContent>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <TryOn productId={productId} fetchAsset={fetchAsset} />
      </ModalContent>
    </ModalWrapper>
  );
};

// Styled Components
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  /* Ensure responsiveness */
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;

  &:hover {
    background-color: darkred;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;

export default TryOnModal;
