import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveVerificationDetails, selectVerificationDetails } from '../../redux/slices/auth/registrationSlice';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';
import { convertFileMetadataToFile } from '../../utils/convertFileMetadataToFile ';
import _ from 'lodash';
import './VerificationForm.css';

// Define the VerificationDetails type
type VerificationDetails = {
  identityDocument: File | null;
  businessDocument: File | null;
  additionalComments?: string;
  verificationMethod?: string;
  phoneNumber?: string;
  verificationLanguage?: string;
  primaryContactFirstName?: string;
  primaryContactMiddleName?: string;
  primaryContactLastName?: string;
};

interface VerificationFormProps {
  data: VerificationDetails;
  onUpdate: (updatedData: Partial<VerificationDetails>) => void;
  onNext: () => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const savedVerificationDetails = useSelector(selectVerificationDetails);

  const processedDetails: VerificationDetails = {
    ...savedVerificationDetails,
    identityDocument: savedVerificationDetails?.identityDocument
      ? convertFileMetadataToFile(savedVerificationDetails.identityDocument)
      : null,
    businessDocument: savedVerificationDetails?.businessDocument
      ? convertFileMetadataToFile(savedVerificationDetails.businessDocument)
      : null,
  };

  useEffect(() => {
    if (savedVerificationDetails && !_.isEqual(processedDetails, data)) {
      onUpdate(processedDetails);
    }
  }, [processedDetails, data]);

  const [additionalComments, setAdditionalComments] = useState(data.additionalComments || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onUpdate({ [e.target.name]: file });
  };

  const handleAdditionalCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalComments(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: VerificationDetails = {
      ...data,
      additionalComments,
    };

    dispatch(saveVerificationDetails(formData));
    onNext();
    navigate('/register/seller/individual/review');
  };

  return (
    <form onSubmit={handleSubmit} className="verification-form">
      <ProgressIndicator currentStep={4} />
      <h1>Verification</h1>

      <div className="form-group">
        <label htmlFor="verificationMethod">Verification Method</label>
        <input
          type="text"
          id="verificationMethod"
          name="verificationMethod"
          value={data.verificationMethod || ''}
          onChange={(e) => onUpdate({ verificationMethod: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={data.phoneNumber || ''}
          onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="verificationLanguage">Verification Language</label>
        <input
          type="text"
          id="verificationLanguage"
          name="verificationLanguage"
          value={data.verificationLanguage || ''}
          onChange={(e) => onUpdate({ verificationLanguage: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="primaryContactFirstName">Primary Contact First Name</label>
        <input
          type="text"
          id="primaryContactFirstName"
          name="primaryContactFirstName"
          value={data.primaryContactFirstName || ''}
          onChange={(e) => onUpdate({ primaryContactFirstName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="primaryContactMiddleName">Primary Contact Middle Name</label>
        <input
          type="text"
          id="primaryContactMiddleName"
          name="primaryContactMiddleName"
          value={data.primaryContactMiddleName || ''}
          onChange={(e) => onUpdate({ primaryContactMiddleName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="primaryContactLastName">Primary Contact Last Name</label>
        <input
          type="text"
          id="primaryContactLastName"
          name="primaryContactLastName"
          value={data.primaryContactLastName || ''}
          onChange={(e) => onUpdate({ primaryContactLastName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="identityDocument">Identity Document (e.g., Passport, ID)</label>
        <input
          id="identityDocument"
          name="identityDocument"
          type="file"
          onChange={handleFileChange}
        />
        {data.identityDocument && <p>Current file: {data.identityDocument.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="businessDocument">Business Document (if applicable)</label>
        <input
          id="businessDocument"
          name="businessDocument"
          type="file"
          onChange={handleFileChange}
        />
        {data.businessDocument && <p>Current file: {data.businessDocument.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="additionalComments">Additional Comments</label>
        <textarea
          id="additionalComments"
          name="additionalComments"
          value={additionalComments}
          onChange={handleAdditionalCommentsChange}
        />
      </div>

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default VerificationForm;
