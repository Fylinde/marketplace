import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for making HTTP requests
import './CreateAccount1.css';

const CreateAccount: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [full_name, setFullName] = useState(''); // Combine mobile/email field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure email or phone number is correctly formatted
    const isEmail = emailOrPhone.includes('@');

    const registrationData = {
      full_name,  // full_name is being passed correctly
      email: isEmail ? emailOrPhone : null,  // Only send email if valid
      phone_number: !isEmail ? emailOrPhone : null,  // Send phone number if it's not an email
      password,
      profile_picture: null,  // Optional field if you have it
      preferences: null,  // Optional field if you have it
    };
  
    console.log('Registration Data:', registrationData);

    // Check if full_name is not empty
    if (!full_name) {
      setError('Full name is required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/auth/register', registrationData);
      console.log('Registration response:', response.data);
      
      if (response.status === 200) {
        navigate('/email-verification');
      }
    } catch (error: any) {
      console.error("Full error during registration:", error);
      console.error("Error response data:", error.response?.data);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="create-account">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailOrPhone">Email or Phone Number</label>
          <input
            type="text"
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;