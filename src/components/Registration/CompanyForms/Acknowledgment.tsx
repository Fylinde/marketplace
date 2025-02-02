import React, { useState } from "react";
import {
  AcknowledgmentContainer,
  Checkbox,
  SubmitButton,
  TermsContainer,
  TermsButton,
  ModalOverlay,
  ModalContent,
  CloseButton,
} from "./AcknowledgmentContainer.styled";

interface AcknowledgmentProps {
  data: { consentGiven: boolean };
  onUpdate: (updatedData: { consentGiven: boolean }) => void;
  onNext: () => void;
}

const Acknowledgment: React.FC<AcknowledgmentProps> = ({ data, onUpdate, onNext }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ consentGiven: e.target.checked });
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <AcknowledgmentContainer>
      <TermsContainer>
        {/* Summary of Terms and Conditions */}
        <h2>Marketplace Terms and Conditions</h2>
        <p>
          By using this marketplace, you agree to comply with the terms and conditions set forth
          for selling, privacy, and verification processes. Please read the terms carefully before
          proceeding. Failure to comply may result in account suspension or termination.
        </p>
        <TermsButton onClick={toggleModal}>Read Full Terms and Conditions</TermsButton>
      </TermsContainer>

      {/* Modal for Full Terms and Conditions */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={toggleModal}>&times;</CloseButton>
            <h2>Full Terms and Conditions</h2>
            <p>
              Welcome to our marketplace. By using our platform, you agree to abide by the following
              terms and conditions:
            </p>
            <ul>
              <li>Ensure the authenticity and legality of all items listed for sale.</li>
              <li>Respect user privacy and avoid sharing personal data without consent.</li>
              <li>Adhere to all applicable laws, regulations, and policies.</li>
              <li>Do not engage in fraudulent or deceptive activities.</li>
              <li>Timely communication and fulfillment of orders are required.</li>
            </ul>
            <p>
              For more details on our privacy policy, selling requirements, and account management,
              please contact our support team or visit our website.
            </p>
          </ModalContent>
        </ModalOverlay>
      )}

      <Checkbox>
        <input
          type="checkbox"
          checked={data.consentGiven}
          onChange={handleConsentChange}
        />
        I acknowledge and agree to the terms of service, privacy policy, and verification process.
      </Checkbox>

      <SubmitButton disabled={!data.consentGiven} onClick={onNext}>
        Submit
      </SubmitButton>
    </AcknowledgmentContainer>
  );
};

export default Acknowledgment;
