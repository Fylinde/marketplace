import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestOTPForm: React.FC = () => {
  const [method, setMethod] = useState('email');
  const [contact, setContact] = useState('');
  const [carrierGateway, setCarrierGateway] = useState('');

  const token = useSelector((state: RootState) => state.auth.access_token);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    console.log("Token in Redux:", token);
    console.log("User in Redux:", user);
    console.log("Access Token in LocalStorage:", localStorage.getItem('access_token'));
    console.log("User in LocalStorage:", localStorage.getItem('user'));

    if (authStatus === 'succeeded' && !token) {
      console.error("Authorization token is missing.");
      navigate('/registration/sign-in');
    }
  }, [token, navigate, authStatus, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }

    try {
      const payload: any = {};
      if (method === 'sms') {
        payload.phoneNumber = contact;
        payload.carrier_gateway = carrierGateway;
      } else {
        payload.email = contact;
      }

      const response = await axios.post('http://localhost:8000/auth/send-otp', new URLSearchParams(payload), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('OTP sent successfully', response.data);
      navigate('/registration/verify-otp');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to send OTP', error.response?.data || error.message);
      } else {
        console.error('Failed to send OTP', (error as Error).message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Request OTP</h1>
      <form onSubmit={handleSubmit}>
        <label>Send OTP via:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        {method === 'sms' ? (
          <>
            <input
              type="text"
              placeholder="Phone Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Carrier Gateway"
              value={carrierGateway}
              onChange={(e) => setCarrierGateway(e.target.value)}
              required
            />
          </>
        ) : (
          <input
            type="email"
            placeholder="Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        )}
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default RequestOTPForm;
