import React from 'react';

interface TypeSelectionFormProps {
  onTypeSelect: (type: 'individual' | 'professional') => void;
}

const TypeSelectionForm: React.FC<TypeSelectionFormProps> = ({ onTypeSelect }) => {
  return (
    <div>
      <h2>Select Seller Type</h2>
      <button onClick={() => onTypeSelect('individual')}>Individual Seller</button>
      <button onClick={() => onTypeSelect('professional')}>Professional Seller</button>
    </div>
  );
};

export default TypeSelectionForm;
