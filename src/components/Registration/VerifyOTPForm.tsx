import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyOTPForm.css';

const VerifyOTPForm: React.FC = () => {
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform 2FA verification logic here
    navigate('/user-dashboard'); // Navigate to user dashboard after 2FA verification
  };

  return (
    <div className="two-fa-verification-container">
      <h1>Two-Factor Authentication</h1>
      <form onSubmit={handleVerify}>
        <label>Enter 2FA Code</label>
        <input type="text" required />
        <button type="submit" className="verify-button">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOTPForm;
