import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for making HTTP requests
import './CreateAccount.css';

const CreateAccount: React.FC = () => {
  const [full_name, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Allow string type for error
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasDigit: false,
    hasLowercase: false,
    hasUppercase: false,
    hasSpecialChar: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Password validation requirements
  const validatePassword = (password: string) => {
    const validations = {
      minLength: password.length >= 8,
      hasDigit: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword); // Update password validation state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Additional password validation
    if (!passwordValidations.minLength || !passwordValidations.hasDigit || 
        !passwordValidations.hasLowercase || !passwordValidations.hasUppercase || 
        !passwordValidations.hasSpecialChar) {
      setError('Password does not meet the requirements');
      return;
    }
    
    // Validate email or phone input
    const isEmail = emailOrPhone.includes('@');
  
    // Prepare the registration data to match backend's expected structure
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
      const response = await axios.post(
        'http://localhost:8001/users/register',
        registrationData,
        { headers: { 'Content-Type': 'application/json' } }  
      );
      console.log('Registration response:', response.data);
      
      
      //if (response.status === 200) {
        // Store the access token in localStorage
       // const token = response.data.access_token;
       // localStorage.setItem('token', token);  // Store token in localStorage

        // Redirect user to the dashboard or protected page
        console.log('Redirecting to Email Verification...');
        navigate('/registration/email-verification');
        
      //}
    } catch (error: any) {
      console.error("Full error during registration:", error);
      console.error("Error response data:", error.response?.data);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="create-account-container">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            placeholder="eg John Deo"
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
            placeholder="eg johndeo@example.com or +31 000 000 000"
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
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <ul className="password-requirements">
            <li className={passwordValidations.minLength ? 'valid' : ''}>
              At least 8 characters long
            </li>
            <li className={passwordValidations.hasDigit ? 'valid' : ''}>
              At least one digit
            </li>
            <li className={passwordValidations.hasLowercase ? 'valid' : ''}>
              At least one lowercase letter
            </li>
            <li className={passwordValidations.hasUppercase ? 'valid' : ''}>
              At least one uppercase letter
            </li>
            <li className={passwordValidations.hasSpecialChar ? 'valid' : ''}>
              At least one special character (e.g. !, @, #, $)
            </li>
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button 
            type="submit" 
            className="submit-button" 
            disabled={isLoading} // Disable the button while loading
            >
            {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

      </form>
    </div>
  );
};

export default CreateAccount;
