import React, { useState, useEffect } from 'react';
import './SMSCallVerificationForm.css';

interface SMSCallVerificationFormProps {
  data: {
    verificationMethod: string;
    phoneNumber: string;
    verificationLanguage: string;
    primaryContactFirstName: string;
    primaryContactMiddleName: string;
    primaryContactLastName: string;
  };
  onUpdate: (newData: Partial<{
    verificationMethod: string;
    phoneNumber: string;
    verificationLanguage: string;
    primaryContactFirstName: string;
    primaryContactMiddleName: string;
    primaryContactLastName: string;
  }>) => void;
  onNext: () => void;
}

const SMSCallVerificationForm: React.FC<SMSCallVerificationFormProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    verificationMethod: 'SMS',
    phoneNumber: '',
    verificationLanguage: 'English',
    primaryContactFirstName: '',
    primaryContactMiddleName: '',
    primaryContactLastName: ''
  });

  // Sync formData with incoming props data when the component mounts or data changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Handle form input changes and propagate them upwards
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedData);
    onUpdate(updatedData); // Propagate the changes upwards to the parent component or state
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('SMSCallVerificationForm submitted:', formData); // Log the form data
    onNext(); // Move to the next step in the registration process
  };

  return (
    <form onSubmit={handleSubmit} className="verification-form">
      <h2>Verification</h2>

      <div className="form-group">
        <label>Receive PIN through</label>
        <select
          name="verificationMethod"
          value={formData.verificationMethod}
          onChange={handleChange}
        >
          <option value="SMS">SMS</option>
          <option value="Call">Call</option>
        </select>
      </div>

      <div className="form-group">
        <label>Phone Number for Verification</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 555-5555"
        />
      </div>

      <div className="form-group">
        <label>Verification Language</label>
        <select
          name="verificationLanguage"
          value={formData.verificationLanguage}
          onChange={handleChange}
        >
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
            name="primaryContactFirstName"
            placeholder="First Name"
            value={formData.primaryContactFirstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="primaryContactMiddleName"
            placeholder="Middle Name"
            value={formData.primaryContactMiddleName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="primaryContactLastName"
            placeholder="Last Name"
            value={formData.primaryContactLastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default SMSCallVerificationForm;
