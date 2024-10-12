import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import './SignInForm.css';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const authStatus = useSelector((state: RootState) => state.auth.status);
  const authError = useSelector((state: RootState) => state.auth.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      console.log('Login succeeded, access_token:', resultAction.payload.access_token);
      console.log('User:', resultAction.payload.user); // Optional: Log user details
      // You might want to store the token in localStorage or a secure place
      // localStorage.setItem('access_token', resultAction.payload.access_token);
      navigate('/request-otp'); // Navigate to the next step if login succeeds
    } else if (login.rejected.match(resultAction)) {
      console.error('Login failed:', resultAction.payload);
      console.log('Full error object:', resultAction);
      alert(
        typeof resultAction.payload === 'string'
          ? resultAction.payload
          : 'Login failed. Please check your email and password and try again.'
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button" disabled={authStatus === 'loading'}>
          {authStatus === 'loading' ? 'Signing in...' : 'Continue'}
        </button>
        {authError && <p className="error">{typeof authError === 'string' ? authError : 'An error occurred. Please try again.'}</p>}
        <p>By continuing, you agree to Fylinde's Conditions of Use and Privacy Notice.</p>
        <a href="#">Need help?</a>
      </form>
      <button className="auth-button" onClick={() => navigate('/create-account')}>
        Create your Fylinde account
      </button>
    </div>
  );
};

export default SignInForm;
