import React, { useState } from 'react';
import { BusinessDocumentationFormContainer, FileUpload } from './BusinessDocumentationFormContainer.styles';
import { BusinessDocumentation as BusinessDocumentationType } from '../../../types/sharedTypes';


interface BusinessDocumentationFormProps {
  data: BusinessDocumentationType;
  onUpdate: (updatedData: Partial<BusinessDocumentationType>) => void;
  onNext: () => void;
}

const BusinessDocumentationForm: React.FC<BusinessDocumentationFormProps> = ({ data, onUpdate, onNext }) => {
  // Local state for storing actual File objects
  const [businessRegistrationFile, setBusinessRegistrationFile] = useState<File | null>(null);
  const [taxDocumentFile, setTaxDocumentFile] = useState<File | null>(null);

  const handleFileChange = (field: keyof BusinessDocumentationType, file: File | null) => {
    if (file) {
      // Store the file in the local state
      if (field === 'businessRegistrationDocument') {
        setBusinessRegistrationFile(file);
      } else if (field === 'taxDocument') {
        setTaxDocumentFile(file);
      }

      // Dispatch only file metadata to Redux
      onUpdate({
        [field]: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      });
    } else {
      // Clear the local state and metadata if no file is selected
      if (field === 'businessRegistrationDocument') {
        setBusinessRegistrationFile(null);
      } else if (field === 'taxDocument') {
        setTaxDocumentFile(null);
      }
      onUpdate({ [field]: null });
    }
  };

  const handleInputChange = (field: keyof BusinessDocumentationType, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <BusinessDocumentationFormContainer>
      <h2>Business Documentation</h2>

      <label>Business Registration Document</label>
      <FileUpload
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange('businessRegistrationDocument', e.target.files ? e.target.files[0] : null)
        }
      />

      <label>Document Number</label>
      <input
        type="text"
        value={data.documentNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('documentNumber', e.target.value)
        }
      />

      <label>Issuing Authority</label>
      <input
        type="text"
        value={data.issuingAuthority}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('issuingAuthority', e.target.value)
        }
      />

      <label>Tax ID Number</label>
      <input
        type="text"
        value={data.taxIdNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('taxIdNumber', e.target.value)
        }
      />

      <label>Tax Document</label>
      <FileUpload
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange('taxDocument', e.target.files ? e.target.files[0] : null)
        }
      />

      <label>Country of Tax Residence</label>
      <input
        type="text"
        value={data.taxCountryOfResidence}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange('taxCountryOfResidence', e.target.value)
        }
      />

      <button onClick={onNext}>Next</button>
    </BusinessDocumentationFormContainer>
  );
};

export default BusinessDocumentationForm;
