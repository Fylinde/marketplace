import React from 'react';

const DeliveryOption: React.FC = () => {
  return (
    <div style={deliveryContainer}>
      <span>Deliver to</span>
      <div style={locationText}>Lagos</div>
    </div>
  );
};

const deliveryContainer: React.CSSProperties = {
  marginLeft: '10px',
  textAlign: 'left',
  fontSize: '12px',
};

const locationText: React.CSSProperties = {
  fontWeight: 'bold',
};

export default DeliveryOption;
