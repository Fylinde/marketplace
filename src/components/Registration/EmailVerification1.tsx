import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthData } from '../../redux/slices/auth/authSlice';
import { login } from '../../redux/slices/auth/authSlice';
import './EmailVerification.css';

const EmailVerification: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract and set verification code from URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code) {
      setVerificationCode(code);
      verifyEmailCode(code);
    }
  }, [location.search]);

  const verifyEmailCode = async (code: string) => {
    const trimmedCode = code.trim();  // Trim any spaces from the code
    const verifyUrl = "http://localhost:8000/auth/verify";

    try {
      const response = await axios.get(verifyUrl, {
        params: { code: trimmedCode }  // Correctly pass the trimmed code as a query parameter
      });

      if (response.status === 200) {
        const { access_token, refresh_token, user } = response.data;

        // Dispatch setAuthData with tokens and user data
        dispatch(setAuthData({ access_token, refresh_token, user }));

        navigate('/user-dashboard'); // Redirect to dashboard
      } else {
        setErrorMessage('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed with error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmailCode(verificationCode);
  };

  return (
    <div className="auth-container">
      <h1>Email Verification</h1>
      <form onSubmit={handleSubmit}>
        <label>Verification Code</label>
        <input
          type="text"
          maxLength={6}   // Limit input length to 6
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.trim())}
          required
        />
        <button type="submit" className="auth-button">Verify</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default EmailVerification;