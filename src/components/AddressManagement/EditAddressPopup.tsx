import React, { useState } from 'react';  // Make sure useState is imported
import './EditAddressPopup.css';


// Define the props interface
interface EditAddressPopupProps {
  address: any;  // Replace `any` with the correct type for the address if you have it
  onConfirm: (addressId: number) => void; // Function to confirm the edit
  onCancel: () => void; // Function to cancel the edit
}

const EditAddressPopup: React.FC<EditAddressPopupProps> = ({ address, onConfirm, onCancel }) => {
  if (!address) {
    return null; // or some loading state
  }

  const handleConfirm = () => {
    if (address && address.id) {
      onConfirm(address.id); // Call the confirm function with the address id
    }
  };

  return (
    <div className="edit-address-popup">
      <h3>Edit Address</h3>
      <p>{address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>

      <div className="actions">
        <button onClick={handleConfirm}>Save Changes</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditAddressPopup;
