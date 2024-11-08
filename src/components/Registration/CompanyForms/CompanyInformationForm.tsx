import React, { useState, useEffect } from 'react';
import './BusinessInformationForm.css';

// Define interfaces for each section of information
interface BusinessInformation {
  businessLocation: string;
  businessType: string;
  businessName: string;
}

interface CompanyInformation {
  companyName: string;
  companyRegistrationNumber: string;
  taxId: string;
  countryOfIncorporation: string;
  businessAddress: string;
  phoneNumber: string;
  contactPersonFirstName: string;
  contactPersonMiddleName?: string; // Optional
  contactPersonLastName: string;
}

// Define props interface to include both business and company information
interface CombinedInformationFormProps {
  data: {
    businessInformation: BusinessInformation;
    companyInformation: CompanyInformation;
  };
  onUpdate: (newData: Partial<CombinedInformationFormProps['data']>) => void;
  onSubmit: () => void;
  onNext: () => void;
}

const CombinedInformationForm: React.FC<CombinedInformationFormProps> = ({ data, onUpdate, onSubmit, onNext }) => {
  const [formData, setFormData] = useState(data);
  const [isAgreed, setIsAgreed] = useState(false);

  // Sync formData with incoming props data when component mounts or data prop changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Handle input changes and update form data for both business and company information
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const [section, name] = e.target.name.split('.'); // 'section.field'
    const updatedSection = {
      ...formData[section as 'businessInformation' | 'companyInformation'],
      [name]: e.target.value,
    };
    
    const updatedData = { ...formData, [section]: updatedSection };
    setFormData(updatedData);
    onUpdate(updatedData); // Pass updated data to the parent
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAgreed) {
      alert('Please agree to the terms before continuing.');
      return;
    }
    console.log('CombinedInformationForm submitted:', formData);
    onSubmit(); // Call parent onSubmit for additional actions (like saving data)
    onNext(); // Navigate to the next form
  };

  // Handle checkbox change for agreement
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} className="combined-form">
      <h2>Business Information</h2>

      <div className="form-group">
        <label>Business Location</label>
        <select name="businessInformation.businessLocation" value={formData.businessInformation.businessLocation} onChange={handleChange}>
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="NL">Netherlands</option>
          <option value="NG">Nigeria</option>
        </select>
      </div>

      <div className="form-group">
        <label>Business Type</label>
        <select name="businessInformation.businessType" value={formData.businessInformation.businessType} onChange={handleChange}>
          <option value="">Select Business Type</option>
          <option value="privately_owned">Privately-owned business</option>
          <option value="public_company">Public company</option>
          <option value="non_profit">Non-profit organization</option>
        </select>
      </div>

      <div className="form-group">
        <label>Business Name</label>
        <input
          type="text"
          name="businessInformation.businessName"
          placeholder="Business Name"
          value={formData.businessInformation.businessName}
          onChange={handleChange}
        />
      </div>

      <h2>Company Information</h2>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyInformation.companyName"
          placeholder="Company Name"
          value={formData.companyInformation.companyName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Company Registration Number</label>
        <input
          type="text"
          name="companyInformation.companyRegistrationNumber"
          placeholder="Registration Number"
          value={formData.companyInformation.companyRegistrationNumber}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Tax ID</label>
        <input
          type="text"
          name="companyInformation.taxId"
          placeholder="Tax ID"
          value={formData.companyInformation.taxId}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Country of Incorporation</label>
        <input
          type="text"
          name="companyInformation.countryOfIncorporation"
          placeholder="Country of Incorporation"
          value={formData.companyInformation.countryOfIncorporation}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Business Address</label>
        <input
          type="text"
          name="companyInformation.businessAddress"
          placeholder="Business Address"
          value={formData.companyInformation.businessAddress}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="companyInformation.phoneNumber"
          placeholder="Phone Number"
          value={formData.companyInformation.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Primary Contact Person</label>
        <input
          type="text"
          name="companyInformation.contactPersonFirstName"
          placeholder="First Name"
          value={formData.companyInformation.contactPersonFirstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="companyInformation.contactPersonMiddleName"
          placeholder="Middle Name"
          value={formData.companyInformation.contactPersonMiddleName || ''}
          onChange={handleChange}
        />
        <input
          type="text"
          name="companyInformation.contactPersonLastName"
          placeholder="Last Name"
          value={formData.companyInformation.contactPersonLastName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <input type="checkbox" id="agreement" name="agreement" checked={isAgreed} onChange={handleCheckboxChange} />
        <label htmlFor="agreement">
          By clicking 'Agree and continue', you agree to accept the following policies, agreements, and notices.
        </label>
      </div>

      <button type="submit" className="submit-btn">Agree and continue</button>
    </form>
  );
};

export default CombinedInformationForm;
