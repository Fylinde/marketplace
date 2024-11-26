import React, { useState } from 'react';
import { AcknowledgmentContainer, Checkbox, SubmitButton, TermsContainer } from './AcknowledgmentContainer.styled';

interface AcknowledgmentProps {
  data: { consentGiven: boolean };
  onUpdate: (updatedData: { consentGiven: boolean }) => void;
  onNext: () => void;
}

const Acknowledgment: React.FC<AcknowledgmentProps> = ({ data, onUpdate, onNext }) => {
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ consentGiven: e.target.checked });
  };

  return (
    <AcknowledgmentContainer>
      <TermsContainer>
        {/* Placeholder text for Terms and Conditions */}
        <h2>Marketplace Terms and Conditions</h2>
        <p>
          By using this marketplace, you agree to comply with the terms and conditions set forth
          for selling, privacy, and verification processes. Please read the terms carefully before
          proceeding. Failure to comply may result in account suspension or termination.
        </p>
        <p>
          <em>Note: The full agreement will be available soon. Please review this information and indicate your consent to proceed.</em>
        </p>
      </TermsContainer>

      <Checkbox>
      <input
          type="checkbox"
          checked={data.consentGiven}
          onChange={handleConsentChange}
        />
        I acknowledge and agree to the terms of service, privacy policy, and verification process.
      </Checkbox>

      <button onClick={onNext}>Submit</button>
    </AcknowledgmentContainer>
  );
};

export default Acknowledgment;
