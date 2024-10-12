import React from 'react';
import './Cart.css';

const Cart: React.FC = () => {
  return (
    <div className="cart">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Amazon-Cart-Icon.png"
        alt="Cart"
      />
      <span>0</span>
    </div>
  );
};

export default Cart;
