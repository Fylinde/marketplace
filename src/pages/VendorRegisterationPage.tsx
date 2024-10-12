// src/pages/VendorRegisterPage.js

import React from 'react';
import './VendorAuth.css';

const VendorRegisterPage = () => {
  return (
    <div className="vendor-auth">
      <form>
        <h2>Vendor Registration</h2>
        <input type="text" placeholder="Vendor Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default VendorRegisterPage;
