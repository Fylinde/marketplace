import React, { useEffect, useState } from 'react';
import './CompanyInformationForm.css';

interface CompanyInformationFormProps {
  data: {
    companyName: string;
    companyRegistrationNumber: string;
    taxId: string;
    countryOfIncorporation: string;
    businessAddress: string;
  };
  onUpdate: (updatedData: Partial<{
    companyName: string;
    companyRegistrationNumber: string;
    taxId: string;
    countryOfIncorporation: string;
    businessAddress: string;
  }>) => void;
  onSubmit: () => void;
  onNext: () => void;
}

const CompanyInformationForm: React.FC<CompanyInformationFormProps> = ({ data, onUpdate, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    countryOfIncorporation: '',
    businessAddress: ''
  });

  // Sync formData with incoming props data when component mounts or data changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedData);
    onUpdate(updatedData);  // Propagate the changes up
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('CompanyInformationForm submitted:', formData);
    onSubmit();  // Call onSubmit to proceed
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
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

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default CompanyInformationForm;
