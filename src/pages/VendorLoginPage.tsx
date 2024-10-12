// src/pages/VendorLoginPage.js

import React from 'react';
import './VendorAuth.css';

const VendorLoginPage = () => {
  return (
    <div className="vendor-auth">
      <form>
        <h2>Vendor Login</h2>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default VendorLoginPage;
