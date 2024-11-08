import React, { useState, useEffect } from 'react';
import CombinedInformationFormWrapper from './CombinedInformationFormWrapper';

interface CombinedInformationFormProps {
  data: {
    businessLocation?: string;
    businessType?: string;
    businessName?: string;
    companyName?: string;
    companyRegistrationNumber?: string;
    taxId?: string;
    countryOfIncorporation?: string;
    businessAddress?: string;
    phoneNumber?: string;
    contactPersonFirstName?: string;
    contactPersonMiddleName?: string;
    contactPersonLastName?: string;
    smsVerificationLanguage?: string;
    verificationMethod?: string;
  };
  onUpdate: (newData: Partial<CombinedInformationFormProps['data']>) => void;
  onSubmit: () => void;
  onNext: () => void;
}

const CombinedInformationForm: React.FC<CombinedInformationFormProps> = ({ data, onUpdate, onSubmit, onNext }) => {
  const [formData, setFormData] = useState({
    businessLocation: '',
    businessType: '',
    businessName: '',
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    countryOfIncorporation: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '',
    contactPersonLastName: '',
    smsVerificationLanguage: 'English',
    verificationMethod: 'SMS',
  });

  // Sync formData with incoming props data when component mounts or data changes
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }));
    }
  }, [data]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedData);
    onUpdate(updatedData);  // Propagate the changes upwards
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('CombinedInformationForm submitted:', formData);
    onSubmit();  // Call onSubmit to proceed
  };

  return (
    <CombinedInformationFormWrapper>
    <form onSubmit={handleSubmit} className="combined-form">
      <h2>Business Information</h2>

      <div className="form-group">
        <label>Business Location</label>
        <select name="businessLocation" value={formData.businessLocation} onChange={handleChange}>
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
        <select name="businessType" value={formData.businessType} onChange={handleChange}>
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
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>

      <h2>Company Information</h2>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter Company Name"
        />
      </div>

      <div className="form-group">
        <label>Company Registration Number</label>
        <input
          type="text"
          name="companyRegistrationNumber"
          value={formData.companyRegistrationNumber}
          onChange={handleChange}
          placeholder="Enter Company Registration Number"
        />
      </div>

      <div className="form-group">
        <label>Tax Identification Number (Tax ID)</label>
        <input
          type="text"
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          placeholder="Enter Tax ID"
        />
      </div>

      <div className="form-group">
        <label>Country of Incorporation</label>
        <select
          name="countryOfIncorporation"
          value={formData.countryOfIncorporation}
          onChange={handleChange}
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      <div className="form-group">
        <label>Business Address</label>
        <input
          type="text"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          placeholder="Enter Business Address"
        />
      </div>

      <h2>Seller Information</h2>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 555-5555"
        />
      </div>

      <div className="form-group">
        <label>Verification Method</label>
        <select name="verificationMethod" value={formData.verificationMethod} onChange={handleChange}>
          <option value="SMS">SMS</option>
          <option value="Call">Call</option>
        </select>
      </div>

      <div className="form-group">
        <label>SMS Verification Language</label>
        <select name="smsVerificationLanguage" value={formData.smsVerificationLanguage} onChange={handleChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>
      </div>

      <div className="form-group">
        <label>Primary Contact Person</label>
        <div className="name-group">
          <input
            type="text"
            name="contactPersonFirstName"
            placeholder="First Name"
            value={formData.contactPersonFirstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contactPersonMiddleName"
            placeholder="Middle Name"
            value={formData.contactPersonMiddleName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contactPersonLastName"
            placeholder="Last Name"
            value={formData.contactPersonLastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-navigation">
        <button type="button" onClick={onNext} className="next-button">Next</button>
        <button type="submit" className="submit-btn">Submit</button>
      </div>
      </form>
      </CombinedInformationFormWrapper>
  );
};

export default CombinedInformationForm;
