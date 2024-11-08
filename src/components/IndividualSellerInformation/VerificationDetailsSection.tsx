import React from 'react';
import { VerificationDetails } from '../../redux/slices/registrationSlice';

interface VerificationDetailsSectionProps {
  verificationDetails: VerificationDetails;
}

const VerificationDetailsSection: React.FC<VerificationDetailsSectionProps> = ({ verificationDetails }) => (
  <div>
    <h3>Verification Details</h3>
    <p>Identity Document: {verificationDetails.identityDocument ? 'Uploaded' : 'Not Uploaded'}</p>
    <p>Business Document: {verificationDetails.businessDocument ? 'Uploaded' : 'Not Uploaded'}</p>
  </div>
);

export default VerificationDetailsSection;
