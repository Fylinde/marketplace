import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EmailVerification.css';

const EmailVerification: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code) {
      setVerificationCode(code);
      handleVerify(code);
    }
  }, [location.search]);

  const handleVerify = async (code: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/auth/verify?code=${code}`);
      if (response.status === 200) {
        navigate('/user-dashboard');
      }
    } catch (error: any) {
      console.error('Verification failed', error);
      setErrorMessage('Verification failed. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(verificationCode);
  };

  return (
    <div className="auth-container">
      <h1>Email Verification</h1>
      <form onSubmit={handleSubmit}>
        <label>Verification Code</label>
        <input 
          type="text" 
          value={verificationCode} 
          onChange={(e) => setVerificationCode(e.target.value)} 
          required 
        />
        <button type="submit" className="auth-button">Verify</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default EmailVerification;
