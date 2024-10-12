import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveVerificationDetails, selectVerificationDetails } from '../../redux/slices/registrationSlice'; // Import selector
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';  // Import the ProgressIndicator component
import './VerificationForm.css';

type VerificationDetails = {
  identityDocument: File | null;
  businessDocument: File | null;
  additionalComments?: string;
};

interface VerificationFormProps {
  onNext: (data: VerificationDetails) => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get saved verification details from Redux state
  const savedVerificationDetails = useSelector(selectVerificationDetails);

  // Initialize form state with saved data or default values
  const [identityDocument, setIdentityDocument] = useState<File | null>(savedVerificationDetails?.identityDocument || null);
  const [businessDocument, setBusinessDocument] = useState<File | null>(savedVerificationDetails?.businessDocument || null);
  const [additionalComments, setAdditionalComments] = useState<string>(savedVerificationDetails?.additionalComments || '');

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (e.target.name === 'identityDocument') {
      setIdentityDocument(file);
    } else if (e.target.name === 'businessDocument') {
      setBusinessDocument(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: VerificationDetails = {
      identityDocument,
      businessDocument,
      additionalComments,
    };

    // Save the verification details to Redux
    dispatch(saveVerificationDetails(formData));

    // Trigger the onNext function passed down as a prop
    onNext(formData);

    // Navigate to the final step or a review page
    navigate('/business/review'); // Adjust the route as necessary
  };

  return (
    <form onSubmit={handleSubmit} className="verification-form">
      <ProgressIndicator currentStep={4} /> {/* Add the progress indicator at the top */}
      <h1>Verification</h1>

      <div className="form-group">
        <label htmlFor="identityDocument">Identity Document (e.g., Passport, ID)</label>
        <input
          id="identityDocument"
          name="identityDocument"
          type="file"
          onChange={handleFileChange}
          required={!identityDocument}  // Only required if not already uploaded
        />
        {identityDocument && <p>Current file: {identityDocument.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="businessDocument">Business Document (if applicable)</label>
        <input
          id="businessDocument"
          name="businessDocument"
          type="file"
          onChange={handleFileChange}
        />
        {businessDocument && <p>Current file: {businessDocument.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="additionalComments">Additional Comments</label>
        <textarea
          id="additionalComments"
          name="additionalComments"
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default VerificationForm;
