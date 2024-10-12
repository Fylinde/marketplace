import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestOTPForm: React.FC = () => {
  const [method, setMethod] = useState('email');
  const [contact, setContact] = useState('');
  const [carrierGateway, setCarrierGateway] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  console.log('Token in RequestOTPForm:', token);

  useEffect(() => {
    if (!token) {
      console.error("Authorization token is missing.");
      navigate('/sign-in'); // Redirect to login if no token is found
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }

    try {
      const payload: any = {};
      if (method === 'sms') {
        payload.phone_number = contact;
        payload.carrier_gateway = carrierGateway;
      } else {
        payload.email = contact;
      }

      console.log('Sending payload:', payload); // Log the payload to see what is being sent

      const response = await axios.post('http://localhost:8000/auth/send-otp', new URLSearchParams(payload), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('OTP sent successfully', response.data);
      navigate('/verify-otp');
    } catch (error: unknown) {
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
