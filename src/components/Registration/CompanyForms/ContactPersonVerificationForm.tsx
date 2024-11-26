import React, { useState, useRef } from 'react';
import { ContactPersonVerification } from '../../../redux/slices/registrationSlice';
import { FormContainer, FileUpload } from './ContactPersonVerificationForm.styles';

interface ContactPersonVerificationFormProps {
  data: ContactPersonVerification;
  onUpdate: (updatedData: Partial<ContactPersonVerification>) => void;
  onNext: () => void;
}

const ContactPersonVerificationForm: React.FC<ContactPersonVerificationFormProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  // Local state for file handling
  const [authorizationFile, setAuthorizationFile] = useState<File | null>(null);
  const [companyStampFile, setCompanyStampFile] = useState<File | null>(null);

  // Error state
  const [errors, setErrors] = useState({
    fullName: '',
    position: '',
    contactEmail: '',
    contactPhoneNumber: '',
    authorizationLetter: '',
    companyStampOrSeal: '',
  });

  const validateInput = (field: keyof ContactPersonVerification, value: string) => {
    let errorMessage = '';
    switch (field) {
      case 'fullName':
        if (!value.trim()) errorMessage = 'Full name is required.';
        break;
      case 'position':
        if (!value.trim()) errorMessage = 'Position is required.';
        break;
      case 'contactEmail':
        if (!/^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
          errorMessage = 'Please enter a valid email address.';
        }
        break;
      case 'contactPhoneNumber':
        if (!/^\+?[0-9]{7,15}$/.test(value)) {
          errorMessage = 'Please enter a valid phone number.';
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
    return errorMessage === '';
  };

  const handleInputChange = (field: keyof ContactPersonVerification, value: string) => {
    onUpdate({ [field]: value });
    validateInput(field, value);
  };

  const handleFileChange = (field: keyof ContactPersonVerification, file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      // Update local state and dispatch metadata to Redux
      const metadata = { name: file.name, size: file.size, type: file.type };

      if (field === 'authorizationLetter') {
        setAuthorizationFile(file);
      } else if (field === 'companyStampOrSeal') {
        setCompanyStampFile(file);
      }

      onUpdate({ [field]: metadata });
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: 'Please upload a valid image file.',
      }));
    }
  };

  const fileInputRefs = {
    authorizationLetter: useRef<HTMLInputElement | null>(null),
    companyStampOrSeal: useRef<HTMLInputElement | null>(null),
  };

  const triggerFileInput = (field: 'authorizationLetter' | 'companyStampOrSeal') => {
    const inputRef = fileInputRefs[field].current;
    if (inputRef) inputRef.click();
  };
  

  return (
    <FormContainer>
      <h2>Contact Person Verification</h2>

      <label>Full Name</label>
      <input
        type="text"
        value={data.fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('fullName', e.target.value)
        }
      />
      {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}

      <label>Position</label>
      <input
        type="text"
        value={data.position}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('position', e.target.value)
        }
      />
      {errors.position && <p style={{ color: 'red' }}>{errors.position}</p>}

      <label>Contact Email</label>
      <input
        type="email"
        value={data.contactEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('contactEmail', e.target.value)
        }
      />
      {errors.contactEmail && <p style={{ color: 'red' }}>{errors.contactEmail}</p>}

      <label>Contact Phone Number</label>
      <input
        type="tel"
        value={data.contactPhoneNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('contactPhoneNumber', e.target.value)
        }
      />
      {errors.contactPhoneNumber && <p style={{ color: 'red' }}>{errors.contactPhoneNumber}</p>}

      <label>Authorization Letter</label>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRefs.authorizationLetter}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          handleFileChange('authorizationLetter', file);
        }}
      />
      <button type="button" onClick={() => triggerFileInput('authorizationLetter')}>
        Upload Authorization Letter
      </button>
      {errors.authorizationLetter && <p style={{ color: 'red' }}>{errors.authorizationLetter}</p>}

      <label>Company Stamp or Seal</label>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRefs.companyStampOrSeal}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          handleFileChange('companyStampOrSeal', file);
        }}
      />
      <button type="button" onClick={() => triggerFileInput('companyStampOrSeal')}>
        Upload Company Stamp or Seal
      </button>
      {errors.companyStampOrSeal && <p style={{ color: 'red' }}>{errors.companyStampOrSeal}</p>}

      <button onClick={onNext}>Next</button>
    </FormContainer>
  );
};

export default ContactPersonVerificationForm;
