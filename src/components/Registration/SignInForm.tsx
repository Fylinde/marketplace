import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/slices/authSlice';
import { AppDispatch } from '../../redux/store';
import './SignInForm.css';

const SignInForm: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ emailOrPhone, password }));

    if (login.fulfilled.match(resultAction)) {
      // OTP has been successfully sent, proceed to the OTP entry form
      console.log(resultAction.payload.message);
      navigate('/registration/verify-otp');
    } else if (login.rejected.match(resultAction)) {
      console.error('Login failed:', resultAction.payload);
      alert(
        typeof resultAction.payload === 'string'
          ? resultAction.payload
          : 'Login failed. Please check your email/phone and password and try again.'
      );
    }
  };

  return (
    <div className="auth-container">
      <img src="Logo/fylind_logo_1.png" alt="Fylinde" className="auth-logo" onClick={() => navigate('/')} />
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label>Email or mobile phone number</label>
        <input
          type="text"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">
          Continue
        </button>
      </form>
      <button className="auth-button" onClick={() => navigate('/registration/create-account')}>
        Create your Fylinde account
      </button>
    </div>
  );
};

export default SignInForm;
