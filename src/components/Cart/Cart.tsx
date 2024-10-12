import React from 'react';

const Cart: React.FC = () => {
  return (
    <div style={cartContainer}>
      <div style={cartIcon}>
        <img src="https://via.placeholder.com/24x24?text=C" alt="Cart" />
        <div style={cartCount}>0</div>
      </div>
      <span>Cart</span>
    </div>
  );
};

const cartContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginRight: '20px',
  padding: '10px',
  border: '1px solid transparent',  // Initial border
  borderRadius: '4px',
  transition: 'border 0.3s ease',  // Smooth transition
};

const cartIcon: React.CSSProperties = {
  position: 'relative',
};

const cartCount: React.CSSProperties = {
  position: 'absolute',
  top: '-5px',
  right: '-10px',
  backgroundColor: 'orange',
  color: 'white',
  fontSize: '12px',
  padding: '2px 5px',
  borderRadius: '50%',
};

export default Cart;
