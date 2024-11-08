import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateAccount.css';

const CreateAccount: React.FC = () => {
  const [full_name, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasDigit: false,
    hasLowercase: false,
    hasUppercase: false,
    hasSpecialChar: false,
  });

  const navigate = useNavigate();
  const registrationApiUrl = 'http://localhost:8001/users/register';

  // Password validation function
  const validatePassword = (password: string) => {
    setPasswordValidations({
      minLength: password.length >= 8,
      hasDigit: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!full_name) {
      setError('Full name is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!Object.values(passwordValidations).every(Boolean)) {
      setError('Password does not meet the requirements');
      return;
    }

    const isEmail = emailOrPhone.includes('@');
    const registrationData = {
      full_name,
      email: isEmail ? emailOrPhone : null,
      phone_number: !isEmail ? emailOrPhone : null,
      password,
      profile_picture: null,
      preferences: null,
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        registrationApiUrl,
        registrationData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Full registration response:', response);

      if (response.status === 200 && response.data.status === 'success') {
        console.log('Registration successful. Redirecting to Email Verification...');
        navigate('/register/email-verification');
      } else {
        setError('Unexpected response from the server');
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError((error as any).response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            placeholder="e.g., John Doe"
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
            placeholder="e.g., johndoe@example.com or +31 000 000 000"
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
            <li className={passwordValidations.minLength ? 'valid' : ''}>At least 8 characters long</li>
            <li className={passwordValidations.hasDigit ? 'valid' : ''}>At least one digit</li>
            <li className={passwordValidations.hasLowercase ? 'valid' : ''}>At least one lowercase letter</li>
            <li className={passwordValidations.hasUppercase ? 'valid' : ''}>At least one uppercase letter</li>
            <li className={passwordValidations.hasSpecialChar ? 'valid' : ''}>At least one special character (e.g., !, @, #, $)</li>
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

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
