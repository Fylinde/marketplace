import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../redux/slices/authSlice';
import axios from 'axios';
import './EmailVerification.css';  // Make sure to import the CSS file

const EmailVerification: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const apiUrl = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8000';
    const userProfileApiUrl = 'http://localhost:8001/users/me';

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const verificationCode = queryParams.get('code');
        const accessToken = queryParams.get('access_token') || '';
        const refreshToken = queryParams.get('refresh_token') || '';

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            dispatch(setAuthData({ access_token: accessToken, refresh_token: refreshToken, user: null }));
            fetchUserData(accessToken);
        } else if (verificationCode) {
            setCode(verificationCode);
            verifyCode(verificationCode, true);
        }
    }, [location.search, dispatch, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        verifyCode(code, false);
    };

    const verifyCode = async (verificationCode: string, autoRedirect: boolean) => {
        try {
            const response = await fetch(`${apiUrl}/auth/verify?code=${verificationCode}&redirect=${autoRedirect}`);
            if (!response.ok) throw new Error('Verification failed');
            
            const data = await response.json();
            const { access_token = '', refresh_token = '' } = data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            dispatch(setAuthData({ access_token, refresh_token, user: null }));

            fetchUserData(access_token);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    const fetchUserData = async (token: string) => {
        try {
            const response = await axios.get(userProfileApiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            dispatch(setAuthData({ access_token: token, refresh_token: localStorage.getItem('refresh_token') || '', user }));

            navigate('/user-dashboard');
        } catch (error) {
            setError("Failed to load user data after verification. Please try logging in again.");
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
        }
    };

    return (
        <div className="auth-container">
            <h1>Email Verification</h1>
            <p>Please enter the verification code sent to your email to verify your account.</p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                    type="text"
                    id="verificationCode"
                    className="auth-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    minLength={4}
                    maxLength={6}
                    placeholder="Enter code"
                    required
                />
                <button type="submit" className="auth-button">Verify</button>
            </form>
        </div>
    );
};

export default EmailVerification;
