import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveAccountDetails, AccountDetails, selectAccountDetails, setSellerVerificationEmail } from '../../redux/slices/registrationSlice';
import axios from 'axios';

import './CreateSellerAccount.css';

interface CreateSellerAccountProps {
  data: AccountDetails;
  onUpdate: (updatedData: Partial<AccountDetails>) => void;
  onNext: () => void;
}

const CreateSellerAccount: React.FC<CreateSellerAccountProps> = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountDetails = useSelector(selectAccountDetails); // Use `useSelector` at the top level, not inside `useEffect`

  const [full_name, setName] = useState(data.full_name || '');
  const [email, setEmail] = useState(data.email || '');
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Log the account details outside of useEffect
  console.log('Redux Account Details:', accountDetails);

  // Update local state if `data` prop changes
  useEffect(() => {
    setName(data.full_name || '');
    setEmail(data.email || '');
    setPassword(data.password || '');
  }, [data]);

  // ... rest of the component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    // Save account details in Redux
    dispatch(saveAccountDetails({ full_name, email, password }));

    // Explicitly set email in `sellerVerification` if not automatically set
    dispatch(setSellerVerificationEmail(email));

    try {
        await sendVerificationEmail(full_name, email, password);
        onNext();
        navigate('/register/seller/seller-verification');
    } catch (err) {
        console.error('Failed to send verification email:', err);
        setError('Failed to send verification email. Please try again later.');
    }
};


  // API call function to register vendor and send verification email
  const sendVerificationEmail = async (full_name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8012/vendors/register_vendor', {
        full_name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw new Error('Error sending verification email');
    }
  };

  return (
    <div className="create-seller-account">
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label htmlFor="full_name">Your Full Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your first and last name"
          value={full_name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <small>Passwords must be at least 6 characters long.</small>

        <label htmlFor="confirmPassword">Re-enter Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">Next</button>
      </form>

      <p>
        By creating an account, you agree to Fylinde's{" "}
        <a href="#">Terms and Conditions</a>. Please review our{" "}
        <a href="#">Privacy Notice</a>,{" "}
        <a href="#">Cookie Statement</a>, and{" "}
        <a href="#">Interest-Based Ads Policy</a>.
      </p>

      <p>
        Already have an account? <a href="#" onClick={() => navigate('/sign-in')}>Sign in</a>
      </p>
    </div>
  );
};

export default CreateSellerAccount;
