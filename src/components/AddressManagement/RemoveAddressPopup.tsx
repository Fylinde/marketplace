import React from 'react';
import './RemoveAddressPopup.css';

interface RemoveAddressPopupProps {
  address: any;
  onConfirm: () => void;
  onCancel: () => void;
}

const RemoveAddressPopup: React.FC<RemoveAddressPopupProps> = ({ address, onConfirm, onCancel }) => {
  if (!address) {
    return null;  // If no address is selected, return nothing
  }

  return (
    <div className="remove-address-popup">
      <h3>Remove Address</h3>
      <p>Are you sure you want to remove this address?</p>
      <p>{address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}</p>

      <div className="actions">
        <button onClick={onConfirm}>Yes, Remove</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default RemoveAddressPopup;
