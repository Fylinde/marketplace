import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveAccountDetails, selectAccountDetails } from '../../redux/slices/registrationSlice';


import './CreateSellerAccount.css';

interface CreateSellerAccountProps {
  onNext: () => void;
}

const CreateSellerAccount: React.FC<CreateSellerAccountProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountDetails = useSelector(selectAccountDetails);
  
  const [name, setName] = useState(accountDetails.name);
  const [email, setEmail] = useState(accountDetails.email);
  const [password, setPassword] = useState(accountDetails.password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    dispatch(saveAccountDetails({ name, email, password }));
    navigate('/welcome');
  };
  

  return (
    <div className="create-seller-account">
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        
        <label htmlFor="name">Your name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your first and last name"
          value={name}
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
        
        <label htmlFor="confirmPassword">Re-enter password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <button type="submit" className="submit-button" onClick={onNext}>Next</button>
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
