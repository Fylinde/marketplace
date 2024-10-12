import React, { useState, useEffect } from 'react';
import './BusinessInformationForm.css';

interface BusinessInformationFormProps {
  data: {
    businessLocation: string;
    businessType: string;
    businessName: string;
  };
  onUpdate: (newData: Partial<{
    businessLocation: string;
    businessType: string;
    businessName: string;
  }>) => void;
  onNext: () => void;
}

const BusinessInformationForm: React.FC<BusinessInformationFormProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    businessLocation: '',
    businessType: '',
    businessName: '',
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
    onUpdate(updatedData);  // Pass updated data to the parent
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('BusinessInformationForm submitted:', formData);

    // Proceed to the next step
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="business-form">
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

      <div className="form-group">
        <input type="checkbox" id="agreement" name="agreement" />
        <label htmlFor="agreement">
          By clicking 'Agree and continue', you agree to accept the following policies, agreements, and notices.
        </label>
      </div>

      <button type="submit" className="submit-btn">Agree and continue</button>
    </form>
  );
};

export default BusinessInformationForm;
