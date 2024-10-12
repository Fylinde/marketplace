import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateSellerAccount.css';

const CreateSellerAccount: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/vendor/register_vendor', {
        name,
        email,
        password,
        // Additional fields like description, profile_picture, etc., can be added here if necessary
      });
  
      console.log('Seller account created:', response.data);
      navigate('/welcome'); // Redirect to the Welcome page after successful registration
    } catch (err) {
      console.error('Error creating seller account:', err);
      setError('Failed to create account');
    }
  };
  

  return (
    <div className="create-seller-account">
      <h1>Create a Seller Account</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <label htmlFor="name">Your name</label>
        <input
          type="text"
          id="name"
          placeholder="First and last name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          placeholder=""
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
          placeholder=""
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
