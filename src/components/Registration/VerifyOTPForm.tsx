import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../redux/slices/auth/authSlice';
import axios from 'axios';
import './VerifyOTPForm.css';

const VerifyOTPForm: React.FC = () => {
  const [otpCode, setOtpCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8000';
  const userProfileApiUrl = 'http://localhost:8001/users/me';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);  // Reset error

    try {
      // Retrieve the contact from localStorage
      const contact = localStorage.getItem('contact');
      console.log("Retrieved contact from localStorage:", contact);

      // Validate that contact and otpCode are both defined
      if (!contact) {
        console.error("Error: Contact information is missing.");
        setError("Contact information is missing.");
        return;
      }
      if (!otpCode) {
        console.error("Error: OTP code is missing.");
        setError("OTP code is missing.");
        return;
      }

      const formData = new URLSearchParams();
      formData.append("contact", contact);
      formData.append("otp", otpCode);

      // Send OTP verification request
      const response = await axios.post(
        `${apiUrl}/auth/verify-otp`,
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      // Check for a successful response
      if (response.status === 200) {
        console.log("OTP verified successfully:", response.data);

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        dispatch(setAuthData({ access_token, refresh_token, user: null }));
        await fetchUserData(access_token);
      } else {
        throw new Error('OTP verification failed.');
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("Invalid OTP or missing contact information. Please try again.");
    }
  };


  const fetchUserData = async (token: string) => {
    try {
      console.log("Fetching user data with access token:", token);

      const response = await axios.get(userProfileApiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      dispatch(setAuthData({ access_token: token, refresh_token: localStorage.getItem('refresh_token') || '', user }));

      console.log("User data fetched and stored:", user);

      navigate('/user-dashboard');
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load user data. Please log in again.");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <h1>Two-Factor Authentication</h1>
      <p>Please enter the OTP sent to your email/phone to verify your identity.</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleVerify}>
        <label>Enter OTP Code</label>
        <input
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          required
          minLength={4}
          maxLength={6}
          placeholder="Enter OTP"
          className="auth-input"
        />
        <button type="submit" className="auth-button">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOTPForm;
