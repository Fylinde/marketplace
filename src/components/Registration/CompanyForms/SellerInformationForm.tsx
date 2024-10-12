import React, { useState, useEffect } from 'react';
import './SellerInformationForm.css';

interface SellerInformationFormProps {
  data: {
    companyRegistrationNumber: string;
    businessAddress: string;
    phoneNumber: string;
    contactPersonFirstName: string;
    contactPersonMiddleName: string;
    contactPersonLastName: string;
    smsVerificationLanguage: string;
    verificationMethod: string;
  };
  onUpdate: (newData: Partial<{
    companyRegistrationNumber: string;
    businessAddress: string;
    phoneNumber: string;
    contactPersonFirstName: string;
    contactPersonMiddleName: string;
    contactPersonLastName: string;
    smsVerificationLanguage: string;
    verificationMethod: string;
  }>) => void;  // Correctly typed update callback
  onNext: () => void;  // Callback to move to the next step
}

const SellerInformationForm: React.FC<SellerInformationFormProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    companyRegistrationNumber: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '',
    contactPersonLastName: '',
    smsVerificationLanguage: 'English',
    verificationMethod: 'SMS',
  });

  // Sync formData with incoming props data when the component mounts or when the data prop changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Handle input changes and update the form data
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
    console.log('SellerInformationForm submitted:', formData);  // Log the form data

    onNext();  // Move to the next step
  };

  return (
    <form onSubmit={handleSubmit} className="seller-form">
      <h2>Seller Information</h2>

      <div className="form-group">
        <label>Company Registration Number</label>
        <input
          type="text"
          name="companyRegistrationNumber"
          value={formData.companyRegistrationNumber}
          onChange={handleChange}
          placeholder="Company Registration Number"
        />
      </div>

      <div className="form-group">
        <label>Registered Business Address</label>
        <input
          type="text"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          placeholder="Business Address"
        />
      </div>

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

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default SellerInformationForm;
