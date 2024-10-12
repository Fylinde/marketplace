import React, { useState, useEffect } from 'react';
import './StoreInformationForm.css';

interface StoreInformationFormProps {
  data: {
    storeName: string;
    upc: string;
    manufacturerBrandOwner: string;
    trademarkOwnership: string;
  };
  onUpdate: (newData: Partial<{
    storeName: string;
    upc: string;
    manufacturerBrandOwner: string;
    trademarkOwnership: string;
  }>) => void;
  onNext: () => void;
}

const StoreInformationForm: React.FC<StoreInformationFormProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    upc: '',
    manufacturerBrandOwner: '',
    trademarkOwnership: '',
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
    onUpdate(updatedData);  // Propagate the changes upwards to the parent component or state
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('StoreInformationForm submitted:', formData);  // Log the form data
    onNext();  // Move to the next step in the flow
  };

  return (
    <form onSubmit={handleSubmit} className="store-form">
      <h2>Store Information</h2>

      <div className="form-group">
        <label>Store Name</label>
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          placeholder="Enter Store Name"
        />
      </div>

      <div className="form-group">
        <label>Do you have Universal Product Codes (UPCs) for all your products?</label>
        <select name="upc" value={formData.upc} onChange={handleChange}>
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div className="form-group">
        <label>Are you the manufacturer or brand owner for any of the products you want to sell?</label>
        <select name="manufacturerBrandOwner" value={formData.manufacturerBrandOwner} onChange={handleChange}>
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="some">Some of them</option>
        </select>
      </div>

      <div className="form-group">
        <label>Do you own government-registered trademarks for the branded products?</label>
        <select name="trademarkOwnership" value={formData.trademarkOwnership} onChange={handleChange}>
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="some">Some of them</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">Next</button>
    </form>
  );
};

export default StoreInformationForm;
